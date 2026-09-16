<template>
  <div class="date-page" :class="{ celebrate: step === 'done' }">
    <div class="bg-blobs" aria-hidden="true">
      <span class="blob blob-a"></span>
      <span class="blob blob-b"></span>
      <span class="blob blob-c"></span>
    </div>

    <div class="floating-hearts" aria-hidden="true">
      <span
        v-for="heart in floatingHearts"
        :key="heart.id"
        class="float-heart"
        :style="heart.style"
        >{{ heart.emoji }}</span
      >
    </div>

    <main class="stage">
      <div
        v-if="step !== 'ask' && step !== 'done'"
        class="progress"
        aria-hidden="true"
      >
        <span
          v-for="n in questionSteps"
          :key="n"
          class="dot"
          :class="{ on: progressIndex >= n }"
        ></span>
      </div>

      <transition name="fade-swap" mode="out-in">
        <!-- Step 1: The big question -->
        <section v-if="step === 'ask'" key="ask" class="panel ask-panel">
          <p class="eyebrow">urgent. romantic. scientifically important 💌</p>
          <div class="mascot" aria-hidden="true">{{ mascot }}</div>
          <h1 class="headline">
            Hey Nooraaaa… <span class="accent">wanna go on a date</span> with
            me?
          </h1>
          <p class="subcopy">
            I’ve rehearsed this in the mirror {{ attempts || 1 }} time(s). That
            red button is… emotionally unavailable.
          </p>

          <div class="button-arena" :class="{ chasing: noMoved }" ref="arena">
            <button
              class="btn yes"
              type="button"
              :style="yesScaleStyle"
              @click="sayYes"
            >
              Yes 💘
            </button>
            <button
              ref="noBtn"
              class="btn no"
              type="button"
              :class="{ escaped: noMoved }"
              :style="noStyle"
              @mouseenter="flee"
              @focus="flee"
              @touchstart.prevent="flee"
              @click.prevent="flee"
            >
              {{ noLabel }}
            </button>
          </div>

          <p class="hint">{{ hint }}</p>
        </section>

        <!-- Step 2: Food -->
        <section v-else-if="step === 'food'" key="food" class="panel">
          <p class="step-label">question 1 of 5 🍽️</p>
          <div class="mascot small" aria-hidden="true">🍕</div>
          <h1 class="headline">
            What should we <span class="accent">eat</span>?
          </h1>
          <p class="subcopy">Choose wisely. This decides the vibe.</p>
          <div class="choices">
            <button
              v-for="opt in foodOptions"
              :key="opt"
              type="button"
              class="choice"
              :class="{ selected: answers.food === opt }"
              @click="pick('food', opt)"
            >
              {{ opt }}
            </button>
          </div>
          <button
            class="btn yes continue"
            type="button"
            :disabled="!answers.food"
            @click="nextStep"
          >
            Next ✨
          </button>
        </section>

        <!-- Step 3: Day -->
        <section v-else-if="step === 'day'" key="day" class="panel">
          <p class="step-label">question 2 of 5 📅</p>
          <div class="mascot small" aria-hidden="true">🗓️</div>
          <h1 class="headline">Which <span class="accent">day</span> works?</h1>
          <p class="subcopy">
            I’m free whenever you steal me for a little romance.
          </p>
          <div class="choices">
            <button
              v-for="opt in dayOptions"
              :key="opt"
              type="button"
              class="choice"
              :class="{ selected: answers.day === opt }"
              @click="pick('day', opt)"
            >
              {{ opt }}
            </button>
          </div>
          <div class="nav-row">
            <button class="btn ghost" type="button" @click="prevStep">
              Back
            </button>
            <button
              class="btn yes continue"
              type="button"
              :disabled="!answers.day"
              @click="nextStep"
            >
              Next ✨
            </button>
          </div>
        </section>

        <!-- Step 4: Time -->
        <section v-else-if="step === 'time'" key="time" class="panel">
          <p class="step-label">question 3 of 5 ⏰</p>
          <div class="mascot small" aria-hidden="true">🕰️</div>
          <h1 class="headline">What <span class="accent">time</span>?</h1>
          <p class="subcopy">Early bird or soft-lighting evening person?</p>
          <div class="choices">
            <button
              v-for="opt in timeOptions"
              :key="opt"
              type="button"
              class="choice"
              :class="{ selected: answers.time === opt }"
              @click="pick('time', opt)"
            >
              {{ opt }}
            </button>
          </div>
          <div class="nav-row">
            <button class="btn ghost" type="button" @click="prevStep">
              Back
            </button>
            <button
              class="btn yes continue"
              type="button"
              :disabled="!answers.time"
              @click="nextStep"
            >
              Next ✨
            </button>
          </div>
        </section>

        <!-- Step 5: Activity -->
        <section v-else-if="step === 'activity'" key="activity" class="panel">
          <p class="step-label">question 4 of 5 🎬</p>
          <div class="mascot small" aria-hidden="true">✨</div>
          <h1 class="headline">What’s the <span class="accent">plan</span>?</h1>
          <p class="subcopy">Pick the main event. Side quests welcome.</p>
          <div class="choices">
            <button
              v-for="opt in activityOptions"
              :key="opt"
              type="button"
              class="choice"
              :class="{ selected: answers.activity === opt }"
              @click="pick('activity', opt)"
            >
              {{ opt }}
            </button>
          </div>
          <div class="nav-row">
            <button class="btn ghost" type="button" @click="prevStep">
              Back
            </button>
            <button
              class="btn yes continue"
              type="button"
              :disabled="!answers.activity"
              @click="nextStep"
            >
              Next ✨
            </button>
          </div>
        </section>

        <!-- Step 6: Extra sweet questions -->
        <section v-else-if="step === 'extras'" key="extras" class="panel">
          <p class="step-label">question 5 of 5 💕</p>
          <div class="mascot small" aria-hidden="true">🥰</div>
          <h1 class="headline">
            Last cute <span class="accent">details</span>
          </h1>
          <p class="subcopy">
            Almost done. These are legally binding (joking… mostly).
          </p>

          <div class="field">
            <label>Dessert situation? 🍰</label>
            <div class="choices compact">
              <button
                v-for="opt in dessertOptions"
                :key="opt"
                type="button"
                class="choice"
                :class="{ selected: answers.dessert === opt }"
                @click="pick('dessert', opt)"
              >
                {{ opt }}
              </button>
            </div>
          </div>

          <div class="field">
            <label>How nervous am I allowed to be? 😳</label>
            <div class="choices compact">
              <button
                v-for="opt in nervesOptions"
                :key="opt"
                type="button"
                class="choice"
                :class="{ selected: answers.nerves === opt }"
                @click="pick('nerves', opt)"
              >
                {{ opt }}
              </button>
            </div>
          </div>

          <div class="field">
            <label>Your nickname for the invite 💌</label>
            <input
              v-model.trim="answers.nickname"
              class="text-input"
              type="text"
              maxlength="24"
              placeholder="e.g. Sunshine, Trouble, Babe…"
              autocomplete="off"
            />
          </div>

          <div class="nav-row">
            <button class="btn ghost" type="button" @click="prevStep">
              Back
            </button>
            <button
              class="btn yes continue"
              type="button"
              :disabled="!extrasReady || sending"
              @click="finish"
            >
              {{ sending ? "Sending… 💌" : "Lock it in 💘" }}
            </button>
          </div>
          <p v-if="sendError" class="send-error">{{ sendError }}</p>
        </section>

        <!-- Final summary -->
        <section v-else key="done" class="panel yes-panel">
          <div class="mascot big" aria-hidden="true">🥳</div>
          <h1 class="headline">
            It’s official, <span class="accent">{{ displayName }}</span
            >! 🎉
          </h1>
          <p class="subcopy">
            {{
              emailSent
                ? "Answers delivered. Confetti deployed. I’m smiling at my inbox. 💌"
                : "Screenshot this and send it back. Calendar invite incoming (emotionally)."
            }}
          </p>

          <ul class="summary">
            <li>
              <span>💘</span>
              <div>
                <strong>Answer</strong>
                <p>YES to the date</p>
              </div>
            </li>
            <li>
              <span>🍽️</span>
              <div>
                <strong>Food</strong>
                <p>{{ answers.food }}</p>
              </div>
            </li>
            <li>
              <span>📅</span>
              <div>
                <strong>When</strong>
                <p>{{ answers.day }} · {{ answers.time }}</p>
              </div>
            </li>
            <li>
              <span>✨</span>
              <div>
                <strong>Plan</strong>
                <p>{{ answers.activity }}</p>
              </div>
            </li>
            <li>
              <span>🍰</span>
              <div>
                <strong>Dessert</strong>
                <p>{{ answers.dessert }}</p>
              </div>
            </li>
            <li>
              <span>😳</span>
              <div>
                <strong>Nerves level</strong>
                <p>{{ answers.nerves }}</p>
              </div>
            </li>
          </ul>

          <p class="final-note">
            Can’t wait. Wear something cute. I’ll bring the butterflies. 😌💕
          </p>

          <button class="btn yes again" type="button" @click="reset">
            Start over 🔁
          </button>
        </section>
      </transition>
    </main>
  </div>
</template>

<script>
import confetti from "canvas-confetti";

const NOTIFY_EMAIL = "fabian.schufa@gmail.com";

const NO_LABELS = [
  "No 😅",
  "Nope 🫣",
  "You sure? 🥺",
  "Think again… 👀",
  "My ego is fragile 💔",
  "Please? 🥹",
  "Almost yes? 💘",
  "Still no?? 😭",
  "Okay rude 😤",
  "Catch me 🏃",
];

const HINTS = [
  "Tip: No has commitment issues on mobile too.",
  "Hmm… that button is doing parkour.",
  "Fun fact: No is currently unavailable in your area.",
  "Scientists say Yes is the healthier option.",
  "Okay wow, you’re persistent. I’m flattered… and terrified.",
];

const FLOW = ["ask", "food", "day", "time", "activity", "extras", "done"];

export default {
  name: "DateAskPage",
  data() {
    return {
      step: "ask",
      attempts: 0,
      noX: 0,
      noY: 0,
      noMoved: false,
      lastFleeAt: 0,
      sending: false,
      sendError: "",
      emailSent: false,
      floatingHearts: [],
      heartId: 0,
      answers: {
        food: "",
        day: "",
        time: "",
        activity: "",
        dessert: "",
        nerves: "",
        nickname: "",
      },
      foodOptions: [
        "🍕 Pizza date",
        "🍣 Sushi night",
        "🍔 Burgers + fries",
        "🌮 Tacos",
        "🍝 Pasta & vibes",
        "🥗 Something cute & light",
      ],
      dayOptions: [
        "Tonight 🌙",
        "Tomorrow ☀️",
        "This weekend 🎉",
        "Next week 📅",
        "Surprise me 🎲",
      ],
      timeOptions: [
        "Brunch o’clock 🥐",
        "Afternoon hang 🌤️",
        "Golden hour 🌅",
        "Dinner time 🍽️",
        "Late-night stroll 🌌",
      ],
      activityOptions: [
        "🎬 Movie night",
        "🚶 Long walk + talk",
        "🎮 Arcade / fun games",
        "🎨 Museum or cute spot",
        "☕ Café + people watching",
        "🎶 Live music",
      ],
      dessertOptions: [
        "Ice cream 🍦",
        "Cake 🎂",
        "Cookies 🍪",
        "Skip… for now 😏",
      ],
      nervesOptions: ["A little 😊", "Very 🫣", "Maximum chaos 🎢"],
    };
  },
  computed: {
    questionSteps() {
      return 5;
    },
    progressIndex() {
      const map = { food: 1, day: 2, time: 3, activity: 4, extras: 5 };
      return map[this.step] || 0;
    },
    noStyle() {
      if (!this.noMoved) {
        return {};
      }
      return {
        position: "absolute",
        left: `${this.noX}px`,
        top: `${this.noY}px`,
        right: "auto",
        bottom: "auto",
        margin: 0,
      };
    },
    yesScaleStyle() {
      const boost = Math.min(this.attempts * 0.06, 0.45);
      if (!this.noMoved) {
        return { transform: `scale(${1 + boost})` };
      }
      return {
        transform: `translate(-50%, -50%) scale(${1 + boost})`,
      };
    },
    noLabel() {
      return NO_LABELS[Math.min(this.attempts, NO_LABELS.length - 1)];
    },
    hint() {
      if (this.attempts === 0) {
        return "Go on… try the other button. I dare you. 😈";
      }
      return HINTS[Math.min(this.attempts - 1, HINTS.length - 1)];
    },
    mascot() {
      if (this.attempts === 0) return "😊";
      if (this.attempts < 3) return "🥺";
      if (this.attempts < 6) return "😭";
      return "💍";
    },
    extrasReady() {
      return !!(this.answers.dessert && this.answers.nerves);
    },
    displayName() {
      return this.answers.nickname || "Nooraaaa";
    },
  },
  mounted() {
    this.spawnAmbientHearts();
    this._heartTimer = setInterval(this.spawnAmbientHearts, 2400);
    window.addEventListener("resize", this.keepNoInBounds, { passive: true });
  },
  beforeDestroy() {
    clearInterval(this._heartTimer);
    window.removeEventListener("resize", this.keepNoInBounds);
  },
  methods: {
    flee(event) {
      const now = Date.now();
      if (now - this.lastFleeAt < 200) return;
      this.lastFleeAt = now;
      this.attempts += 1;
      this.noMoved = true;
      this.$nextTick(() => this.moveNoAway(event));
      this.burstHearts(1);
    },
    moveNoAway(event) {
      const arena = this.$refs.arena;
      const btn = this.$refs.noBtn;
      if (!arena || !btn) return;

      const arenaRect = arena.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const btnW = btnRect.width || 120;
      const btnH = btnRect.height || 52;
      const pad = 6;
      const maxX = Math.max(0, arenaRect.width - btnW - pad);
      const maxY = Math.max(0, arenaRect.height - btnH - pad);

      let pointerX = arenaRect.width / 2;
      let pointerY = arenaRect.height / 2;
      if (event && (event.clientX || (event.touches && event.touches[0]))) {
        const touch = event.touches && event.touches[0];
        const cx = touch ? touch.clientX : event.clientX;
        const cy = touch ? touch.clientY : event.clientY;
        pointerX = cx - arenaRect.left;
        pointerY = cy - arenaRect.top;
      }

      let nextX = this.noX;
      let nextY = this.noY;
      let bestDist = -1;

      for (let i = 0; i < 18; i += 1) {
        const candidateX = Math.random() * maxX;
        const candidateY = Math.random() * maxY;
        const dist = Math.hypot(candidateX - pointerX, candidateY - pointerY);
        const movedEnough =
          this.attempts <= 1 ||
          Math.hypot(candidateX - this.noX, candidateY - this.noY) >
            Math.min(90, maxX * 0.35);
        if (dist > bestDist && movedEnough) {
          bestDist = dist;
          nextX = candidateX;
          nextY = candidateY;
        }
      }

      this.noX = nextX;
      this.noY = nextY;
    },
    keepNoInBounds() {
      if (!this.noMoved || this.step !== "ask") return;
      const arena = this.$refs.arena;
      const btn = this.$refs.noBtn;
      if (!arena || !btn) return;
      const arenaRect = arena.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const maxX = Math.max(0, arenaRect.width - btnRect.width - 6);
      const maxY = Math.max(0, arenaRect.height - btnRect.height - 6);
      this.noX = Math.min(this.noX, maxX);
      this.noY = Math.min(this.noY, maxY);
    },
    sayYes() {
      this.step = "food";
      for (let i = 0; i < 12; i += 1) {
        setTimeout(() => this.burstHearts(1, true), i * 60);
      }
      this.scrollTop();
    },
    pick(key, value) {
      this.answers[key] = value;
      this.burstHearts(1);
    },
    nextStep() {
      const idx = FLOW.indexOf(this.step);
      this.step = FLOW[Math.min(idx + 1, FLOW.length - 1)];
      this.scrollTop();
    },
    prevStep() {
      const idx = FLOW.indexOf(this.step);
      this.step = FLOW[Math.max(idx - 1, 1)];
      this.scrollTop();
    },
    async finish() {
      if (!this.extrasReady || this.sending) return;
      this.sending = true;
      this.sendError = "";

      try {
        await this.sendResultsEmail();
        this.emailSent = true;
        this.step = "done";
        this.scrollTop();
        this.fireConfetti();
        for (let i = 0; i < 20; i += 1) {
          setTimeout(() => this.burstHearts(1, true), i * 70);
        }
      } catch (err) {
        this.sendError =
          "Couldn’t send just now 😢 Check your connection and tap Lock it in again.";
      } finally {
        this.sending = false;
      }
    },
    async sendResultsEmail() {
      const payload = {
        _subject: `💘 ${this.displayName} said YES to the date!`,
        _template: "table",
        _captcha: "false",
        _honey: "",
        From: this.displayName,
        Food: this.answers.food,
        Day: this.answers.day,
        Time: this.answers.time,
        Plan: this.answers.activity,
        Dessert: this.answers.dessert,
        "Nerves level": this.answers.nerves,
        Nickname: this.answers.nickname || "Nooraaaa",
        Summary: [
          "YES to the date",
          `Food: ${this.answers.food}`,
          `When: ${this.answers.day} · ${this.answers.time}`,
          `Plan: ${this.answers.activity}`,
          `Dessert: ${this.answers.dessert}`,
          `Nerves: ${this.answers.nerves}`,
          `Nickname: ${this.answers.nickname || "Nooraaaa"}`,
        ].join("\n"),
      };

      const response = await fetch(
        `https://formsubmit.co/ajax/${NOTIFY_EMAIL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Email failed with status ${response.status}`);
      }

      const data = await response.json().catch(() => ({}));
      if (data.success === "false" || data.error) {
        throw new Error(data.message || "Email provider rejected the request");
      }
    },
    fireConfetti() {
      const colors = ["#ff4d6d", "#2ec4b6", "#ffd166", "#ff8fa3", "#c9184a"];
      const defaults = {
        colors,
        disableForReducedMotion: true,
        zIndex: 9999,
      };

      confetti({
        ...defaults,
        particleCount: 120,
        spread: 80,
        origin: { y: 0.65 },
      });

      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 70,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
        });
        confetti({
          ...defaults,
          particleCount: 70,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
        });
      }, 180);

      setTimeout(() => {
        confetti({
          ...defaults,
          particleCount: 90,
          spread: 100,
          startVelocity: 45,
          origin: { y: 0.4 },
        });
      }, 420);
    },
    reset() {
      this.step = "ask";
      this.attempts = 0;
      this.noX = 0;
      this.noY = 0;
      this.noMoved = false;
      this.sending = false;
      this.sendError = "";
      this.emailSent = false;
      this.answers = {
        food: "",
        day: "",
        time: "",
        activity: "",
        dessert: "",
        nerves: "",
        nickname: "",
      };
      this.scrollTop();
    },
    scrollTop() {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    spawnAmbientHearts() {
      this.burstHearts(2);
    },
    burstHearts(count = 1, celebrate = false) {
      const emojis = celebrate
        ? ["💖", "💕", "✨", "💘", "🥰", "🎉", "💗"]
        : ["💕", "✨", "🌸", "💓", "💗"];

      for (let i = 0; i < count; i += 1) {
        const id = (this.heartId += 1);
        const left = 8 + Math.random() * 84;
        const duration = 4 + Math.random() * 3;
        const size = 16 + Math.random() * 18;
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const heart = {
          id,
          emoji,
          style: {
            left: `${left}%`,
            fontSize: `${size}px`,
            animationDuration: `${duration}s`,
          },
        };
        this.floatingHearts.push(heart);
        setTimeout(() => {
          this.floatingHearts = this.floatingHearts.filter((h) => h.id !== id);
        }, duration * 1000);
      }
    },
  },
};
</script>

<style scoped>
.date-page {
  --rose: #ff4d6d;
  --rose-deep: #c9184a;
  --ink: #3b1f2b;
  --soft: #7a4558;
  --yes: #2ec4b6;
  --yes-deep: #1b9c91;
  --panel: rgba(255, 255, 255, 0.86);
  box-sizing: border-box;
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: max(16px, env(safe-area-inset-top)) 14px
    max(28px, env(safe-area-inset-bottom));
  position: relative;
  overflow-x: hidden;
  background: radial-gradient(circle at 15% 20%, #ffd6e0 0%, transparent 42%),
    radial-gradient(circle at 85% 15%, #ffc2d4 0%, transparent 36%),
    radial-gradient(circle at 50% 100%, #fff0f5 0%, transparent 45%),
    linear-gradient(160deg, #fff5f8 0%, #ffe3ec 45%, #ffd1dc 100%);
  color: var(--ink);
  font-family: "Nunito", sans-serif;
  -webkit-font-smoothing: antialiased;
}

.date-page.celebrate {
  background: radial-gradient(circle at 20% 20%, #ffd6ff 0%, transparent 40%),
    radial-gradient(circle at 80% 30%, #ffe8a3 0%, transparent 35%),
    radial-gradient(circle at 50% 90%, #c8fff4 0%, transparent 40%),
    linear-gradient(160deg, #fff7fb 0%, #ffe9f2 50%, #e8fff9 100%);
}

.bg-blobs {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(8px);
  opacity: 0.55;
  animation: drift 10s ease-in-out infinite;
}

.blob-a {
  width: min(220px, 55vw);
  height: min(220px, 55vw);
  background: #ff9ebb;
  top: -40px;
  left: -30px;
}

.blob-b {
  width: min(180px, 45vw);
  height: min(180px, 45vw);
  background: #ffc2e2;
  right: -40px;
  top: 18%;
  animation-delay: -3s;
}

.blob-c {
  width: min(260px, 70vw);
  height: min(260px, 70vw);
  background: #ffd6a5;
  bottom: -80px;
  left: 25%;
  animation-delay: -6s;
}

.floating-hearts {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.float-heart {
  position: absolute;
  bottom: -30px;
  animation-name: rise;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  opacity: 0.85;
}

.stage {
  width: min(560px, 100%);
  position: relative;
  z-index: 2;
}

.progress {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(201, 24, 74, 0.22);
  transition: transform 0.2s ease, background 0.2s ease;
}

.dot.on {
  background: var(--rose-deep);
  transform: scale(1.25);
}

.panel {
  background: var(--panel);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 28px;
  box-shadow: 0 20px 50px rgba(201, 24, 74, 0.12),
    0 2px 0 rgba(255, 255, 255, 0.8) inset;
  padding: 24px 18px 20px;
  text-align: center;
}

.step-label {
  margin: 0 0 4px;
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--soft);
  letter-spacing: 0.02em;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--soft);
  animation: softPulse 2.4s ease-in-out infinite;
}

.mascot {
  font-size: clamp(3.2rem, 12vw, 4.2rem);
  line-height: 1;
  margin: 6px 0 10px;
  display: inline-block;
  animation: bouncey 1.8s ease-in-out infinite;
  filter: drop-shadow(0 8px 12px rgba(201, 24, 74, 0.18));
}

.mascot.small {
  font-size: clamp(2.4rem, 10vw, 3.2rem);
}

.mascot.big {
  font-size: clamp(3.6rem, 14vw, 5rem);
}

.headline {
  font-family: "Fraunces", Georgia, serif;
  font-weight: 700;
  font-size: clamp(1.55rem, 6.2vw, 2.3rem);
  line-height: 1.2;
  margin: 0 0 10px;
}

.accent {
  background: linear-gradient(120deg, #ff4d6d, #c9184a, #ff8fa3);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.subcopy {
  margin: 0 auto 18px;
  max-width: 34ch;
  color: var(--soft);
  font-size: clamp(0.95rem, 3.6vw, 1.05rem);
  line-height: 1.5;
}

.button-arena {
  position: relative;
  width: 100%;
  min-height: 64px;
  margin: 4px 0 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
  flex-wrap: nowrap;
}

.button-arena.chasing {
  min-height: 200px;
  height: min(42vh, 280px);
  touch-action: none;
  overflow: hidden;
  display: block;
}

.btn {
  appearance: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 800;
  font-size: 1.05rem;
  border-radius: 999px;
  padding: 14px 26px;
  min-height: 48px;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease,
    opacity 0.18s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.btn.yes {
  background: linear-gradient(135deg, var(--yes), var(--yes-deep));
  color: white;
  box-shadow: 0 10px 24px rgba(27, 156, 145, 0.35);
  position: relative;
  z-index: 2;
  animation: yesGlow 2s ease-in-out infinite;
  flex-shrink: 0;
}

.button-arena.chasing .btn.yes {
  position: absolute;
  left: 50%;
  top: 38%;
}

.btn.yes:hover:not(:disabled),
.btn.yes:focus-visible:not(:disabled) {
  box-shadow: 0 14px 28px rgba(27, 156, 145, 0.45);
}

.btn.no {
  background: linear-gradient(135deg, #ff758f, var(--rose-deep));
  color: white;
  box-shadow: 0 10px 24px rgba(201, 24, 74, 0.28);
  z-index: 3;
  min-width: 118px;
  position: relative;
  flex-shrink: 0;
  transition: left 0.12s ease-out, top 0.12s ease-out, transform 0.12s ease-out;
}

.btn.no.escaped {
  position: absolute;
  transform: none;
  margin: 0;
}

.btn.continue,
.btn.again,
.btn.ghost {
  position: static;
  left: auto;
  top: auto;
  transform: none !important;
  animation: none;
}

.btn.continue {
  width: min(100%, 280px);
  margin-top: 8px;
}

.btn.ghost {
  background: rgba(255, 255, 255, 0.7);
  color: var(--rose-deep);
  border: 1.5px solid rgba(201, 24, 74, 0.2);
  box-shadow: none;
}

.btn.again {
  width: min(100%, 280px);
}

.hint {
  min-height: 1.4em;
  margin: 0;
  color: var(--rose-deep);
  font-weight: 700;
  font-size: 0.95rem;
}

.send-error {
  margin: 12px 0 0;
  color: var(--rose-deep);
  font-weight: 700;
  font-size: 0.92rem;
}

.choices {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin: 0 0 16px;
}

.choices.compact {
  margin-bottom: 0;
}

.choice {
  appearance: none;
  border: 1.5px solid rgba(201, 24, 74, 0.14);
  background: rgba(255, 247, 250, 0.95);
  color: var(--ink);
  border-radius: 16px;
  padding: 14px 16px;
  min-height: 52px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease,
    background 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.choice:active {
  transform: scale(0.98);
}

.choice.selected {
  border-color: var(--rose);
  background: linear-gradient(135deg, #ffe3ec, #fff7fa);
  box-shadow: 0 0 0 3px rgba(255, 77, 109, 0.15);
}

.field {
  text-align: left;
  margin-bottom: 16px;
}

.field label {
  display: block;
  font-weight: 800;
  margin-bottom: 8px;
  color: var(--ink);
  font-size: 0.95rem;
}

.text-input {
  width: 100%;
  box-sizing: border-box;
  border: 1.5px solid rgba(201, 24, 74, 0.18);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 14px;
  padding: 14px 16px;
  font-family: inherit;
  font-size: 16px; /* prevents iOS zoom */
  font-weight: 600;
  color: var(--ink);
  outline: none;
}

.text-input:focus {
  border-color: var(--rose);
  box-shadow: 0 0 0 3px rgba(255, 77, 109, 0.15);
}

.nav-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.summary {
  list-style: none;
  margin: 0 0 16px;
  padding: 0;
  display: grid;
  gap: 10px;
  text-align: left;
}

.summary li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: start;
  background: rgba(255, 240, 245, 0.95);
  border-radius: 16px;
  padding: 12px 14px;
  border: 1px solid rgba(255, 77, 109, 0.12);
}

.summary li span {
  font-size: 1.4rem;
  line-height: 1;
}

.summary strong {
  display: block;
  font-size: 0.85rem;
  color: var(--soft);
  margin-bottom: 2px;
}

.summary p {
  margin: 0;
  font-weight: 800;
  font-size: 1rem;
}

.final-note {
  margin: 0 0 16px;
  color: var(--soft);
  font-weight: 700;
}

.fade-swap-enter-active,
.fade-swap-leave-active {
  transition: all 0.28s ease;
}

.fade-swap-enter,
.fade-swap-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

@keyframes bouncey {
  0%,
  100% {
    transform: translateY(0) rotate(-2deg);
  }
  50% {
    transform: translateY(-8px) rotate(2deg);
  }
}

@keyframes softPulse {
  0%,
  100% {
    opacity: 0.75;
  }
  50% {
    opacity: 1;
  }
}

@keyframes yesGlow {
  0%,
  100% {
    box-shadow: 0 10px 24px rgba(27, 156, 145, 0.35);
  }
  50% {
    box-shadow: 0 12px 30px rgba(27, 156, 145, 0.55);
  }
}

@keyframes drift {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(18px, -14px) scale(1.06);
  }
}

@keyframes rise {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.9;
  }
  100% {
    transform: translateY(-110vh) rotate(28deg);
    opacity: 0;
  }
}

@media (min-width: 520px) {
  .choices {
    grid-template-columns: 1fr 1fr;
  }

  .panel {
    padding: 28px 24px 24px;
  }
}

@media (max-width: 480px) {
  .panel {
    border-radius: 22px;
    padding: 20px 14px 18px;
  }

  .button-arena {
    gap: 12px;
  }

  .button-arena.chasing {
    min-height: 230px;
    height: 46vh;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mascot,
  .eyebrow,
  .btn.yes,
  .blob,
  .float-heart {
    animation: none !important;
  }
}
</style>
