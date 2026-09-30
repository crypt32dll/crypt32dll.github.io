#!/usr/bin/env python3
"""Generate a brighter, more melodic ambient pad (original, CC0-equivalent).

C-major progression with moving arpeggios — not a static minor drone.

Usage:
  python3 scripts/generate-ambient.py
  afconvert -f m4af -d aac -b 128000 public/audio/ambient-bright.wav public/audio/ambient-bright.m4a
  rm public/audio/ambient-bright.wav
"""

from __future__ import annotations

import math
import os
import struct
import wave

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT_WAV = os.path.join(ROOT, "public", "audio", "ambient-bright.wav")

SR = 44100
DUR = 32.0  # 8 bars @ 60bpm-feel in 4 chord slots
TWO_PI = 2.0 * math.pi
BPM = 72.0
BEAT = 60.0 / BPM

# C major warm progression: C → G → Am → F (I–V–vi–IV), soft portfolio energy
# Each chord lasts 8 beats (≈6.67s), loop = 4 chords ≈ 26.67s — we use 32s with 8s each
CHORD_LEN = DUR / 4.0

CHORDS = [
    # (root, third, fifth, optional color) in Hz — C major family
    (130.81, 164.81, 196.00, 261.63),  # C
    (98.00, 123.47, 146.83, 196.00),  # G
    (110.00, 130.81, 164.81, 220.00),  # Am (brief shade, not dwelling)
    (87.31, 110.00, 130.81, 174.61),  # F
]

# Melodic motifs in scale degrees relative to chord root (major thirds/fifths/6ths)
MELODY_STEPS = [
    (0, 4, 7, 12, 7, 4, 2, 0),
    (7, 4, 0, 4, 7, 11, 12, 7),
    (0, 3, 7, 10, 12, 10, 7, 3),  # Am leans minor 3rd — short
    (0, 4, 7, 9, 12, 9, 7, 4),
]


def midi_to_hz(midi: float) -> float:
    return 440.0 * (2.0 ** ((midi - 69.0) / 12.0))


def hz_to_midi(hz: float) -> float:
    return 69.0 + 12.0 * math.log2(hz / 440.0)


def note_from_root(root_hz: float, semitones: float) -> float:
    return midi_to_hz(hz_to_midi(root_hz) + semitones)


_state = 90210


def rnd() -> float:
    global _state
    _state = (1664525 * _state + 1013904223) & 0xFFFFFFFF
    return (_state / 0xFFFFFFFF) * 2.0 - 1.0


def soft_sin(phase: float) -> float:
    # Soften harshness with a touch of odd harmonics (organ-ish, not buzzy)
    return (
        math.sin(phase)
        + 0.18 * math.sin(2 * phase)
        + 0.06 * math.sin(3 * phase)
    )


def main() -> None:
    n = int(SR * DUR)
    left = [0.0] * n
    right = [0.0] * n
    lp_l = 0.0
    lp_r = 0.0
    a = 0.06

    for i in range(n):
        t = i / SR
        chord_i = min(3, int(t / CHORD_LEN))
        local = t - chord_i * CHORD_LEN
        # Crossfade between chords
        edge = 0.55
        fade_in = min(1.0, local / edge)
        fade_out = min(1.0, (CHORD_LEN - local) / edge)
        chord_env = fade_in * fade_out
        # Smooth bump so mid-chord is full
        chord_env = 0.55 + 0.45 * chord_env

        root, third, fifth, high = CHORDS[chord_i]
        steps = MELODY_STEPS[chord_i]

        # Pad voices
        pad = 0.0
        for freq, amp, pan in (
            (root, 0.16, -0.25),
            (third, 0.12, 0.15),
            (fifth, 0.11, -0.1),
            (high, 0.07, 0.35),
            (root * 0.5, 0.1, 0.0),  # sub octave warmth
        ):
            det = 1.0 + 0.001 * math.sin(TWO_PI * 0.07 * t + freq * 0.01)
            phase = TWO_PI * freq * det * t
            s = soft_sin(phase) * amp * chord_env
            # slow tremolo for life
            s *= 0.88 + 0.12 * math.sin(TWO_PI * 0.11 * t + pan)
            pl = 0.5 + pan * 0.5
            pr = 0.5 - pan * 0.5
            left[i] += s * pl
            right[i] += s * pr
            pad += abs(s)

        # Moving arpeggio — 8 notes per chord, brighter and clearly different
        note_dur = CHORD_LEN / len(steps)
        note_i = min(len(steps) - 1, int(local / note_dur))
        note_local = local - note_i * note_dur
        attack = min(1.0, note_local / 0.04)
        decay = math.exp(-note_local * 2.8)
        mel_hz = note_from_root(root, steps[note_i])
        # Often up an octave for sparkle
        mel_hz *= 2.0
        mel = soft_sin(TWO_PI * mel_hz * t) * 0.045 * attack * decay * chord_env
        # Echo a fifth above quietly for color
        mel += soft_sin(TWO_PI * mel_hz * 1.5 * t) * 0.012 * attack * decay * chord_env
        left[i] += mel * 0.75
        right[i] += mel * 1.0

        # Soft rhythmic shimmer every beat (not a kick — airy click)
        beat_pos = (t % BEAT) / BEAT
        if beat_pos < 0.08:
            shimmer = (1.0 - beat_pos / 0.08) * 0.012 * math.sin(TWO_PI * 880 * t)
            left[i] += shimmer * 0.6
            right[i] += shimmer

        # Air noise bed (very light)
        nenv = 0.55 + 0.45 * math.sin(TWO_PI * (1.0 / DUR) * t)
        nl = rnd() * 0.008 * nenv
        nr = rnd() * 0.008 * nenv
        lp_l += a * (nl - lp_l)
        lp_r += a * (nr - lp_r)
        left[i] += lp_l
        right[i] += lp_r

        # Overall gentle breath across the whole loop
        breath = 0.9 + 0.1 * math.sin(TWO_PI * (1.0 / DUR) * t)
        left[i] *= breath
        right[i] *= breath

    # Seamless loop crossfade
    fade = int(SR * 1.25)
    for i in range(fade):
        w = i / fade
        j = n - fade + i
        left[j] = left[j] * (1.0 - w) + left[i] * w
        right[j] = right[j] * (1.0 - w) + right[i] * w

    peak = max(max(abs(x) for x in left), max(abs(x) for x in right), 1e-9)
    gain = (10 ** (-14 / 20)) / peak
    left = [x * gain for x in left]
    right = [x * gain for x in right]

    os.makedirs(os.path.dirname(OUT_WAV), exist_ok=True)
    with wave.open(OUT_WAV, "w") as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        frames = bytearray()
        for i in range(n):
            for sample in (left[i], right[i]):
                v = max(-1.0, min(1.0, sample))
                frames += struct.pack("<h", int(v * 32767))
        wf.writeframes(frames)

    print(f"wrote {OUT_WAV} ({os.path.getsize(OUT_WAV)} bytes)")


if __name__ == "__main__":
    main()
