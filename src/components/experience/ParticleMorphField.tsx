'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  NormalBlending,
  type Points,
  ShaderMaterial,
} from 'three'
import { experienceState } from '@/lib/experience-state'
import { createMorphBuffers } from '@/lib/morph-targets'

const VERTEX = /* glsl */ `
uniform float uSize;
uniform float uPixelRatio;
uniform float uDrift;
attribute float aSeed;

void main() {
  vec3 drifted = position;
  drifted.x += sin(uDrift * (0.6 + aSeed) + aSeed * 6.28) * 0.04;
  drifted.y += cos(uDrift * (0.45 + aSeed * 0.5) + aSeed * 4.1) * 0.03;
  vec4 mvPosition = modelViewMatrix * vec4(drifted, 1.0);
  float dist = -mvPosition.z;
  gl_PointSize = uSize * uPixelRatio * (1.0 + aSeed * 0.7) * (2.2 / max(dist, 0.6));
  gl_Position = projectionMatrix * mvPosition;
}
`

const FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uAccent;
uniform float uAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float soft = smoothstep(0.5, 0.1, d);
  float core = smoothstep(0.2, 0.0, d);
  vec3 col = mix(uColor, uAccent, core * 0.7);
  float alpha = soft * uAlpha * (0.4 + core * 0.45);
  gl_FragColor = vec4(col, alpha);
}
`

type Props = {
  count?: number
  animate: boolean
}

/**
 * Atmosphere only — does not scrub CHAPTER_SCRIPT morphs.
 * ArchitectureAssemblage owns the scroll morph story.
 */
export function ParticleMorphField({ count = 420, animate }: Props) {
  const points = useRef<Points>(null)
  const ink = useRef(new Color('#12141a'))
  const accent = useRef(new Color('#0d6b5c'))
  const drift = useRef(0)

  const { geometry, material } = useMemo(() => {
    const geo = new BufferGeometry()
    const [lattice] = createMorphBuffers(count, ['lattice'])
    geo.setAttribute('position', new BufferAttribute(lattice!.slice(), 3))
    const seeds = new Float32Array(count)
    for (let i = 0; i < count; i++) seeds[i] = Math.random()
    geo.setAttribute('aSeed', new BufferAttribute(seeds, 1))

    const mat = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uSize: { value: 2.8 },
        uPixelRatio: { value: 1 },
        uColor: { value: new Color('#4a5160') },
        uAccent: { value: new Color('#0d6b5c') },
        uAlpha: { value: 0.28 },
        uDrift: { value: 0 },
      },
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
    })

    return { geometry: geo, material: mat }
  }, [count])

  useFrame((_state, delta) => {
    const mesh = points.current
    if (!mesh || experienceState.paused) return

    ink.current.set(experienceState.ink)
    accent.current.set(experienceState.accent)

    if (animate && !experienceState.reduced) {
      drift.current += delta * (0.35 + Math.abs(experienceState.scrollVelocity) * 0.4)
    }
    material.uniforms.uDrift.value = drift.current
    material.uniforms.uPixelRatio.value = Math.min(_state.gl.getPixelRatio(), 2)
    material.uniforms.uColor.value.copy(ink.current).lerp(accent.current, 0.2)
    material.uniforms.uAccent.value.copy(accent.current)
    material.uniforms.uAlpha.value = experienceState.dark ? 0.2 : 0.26

    const nextBlend = experienceState.dark ? AdditiveBlending : NormalBlending
    if (material.blending !== nextBlend) {
      material.blending = nextBlend
      material.needsUpdate = true
    }

    const px = experienceState.pointerX
    const py = experienceState.pointerY
    const p = experienceState.smooth
    mesh.rotation.y = p * 0.2 + px * 0.1
    mesh.rotation.x = py * 0.06
    mesh.scale.setScalar(1.55)
    mesh.position.z = -0.85
    mesh.position.y = 0.05
  })

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />
}
