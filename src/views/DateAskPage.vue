<template>
  <div class="date-page" :class="{ celebrate: saidYes }">
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
      >{{ heart.emoji }}</span>
    </div>

    <main class="stage">
      <transition name="fade-swap" mode="out-in">
        <section v-if="!saidYes" key="ask" class="card ask-card">
          <p class="eyebrow">urgent. romantic. scientifically important 💌</p>
          <div class="mascot" aria-hidden="true">{{ mascot }}</div>
          <h1 class="headline">
            Hey you… <span class="accent">wanna go on a date</span> with me?
          </h1>
          <p class="subcopy">
            I’ve rehearsed this in the mirror {{ attempts || 1 }} time(s).
            Please be gentle with my feelings… and that tiny red button.
          </p>

          <div class="button-arena" ref="arena">
            <button class="btn yes" type="button" @click="sayYes">
              Yes 💘
            </button>
            <button
              class="btn no"
              type="button"
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

        <section v-else key="yes" class="card yes-card">
          <div class="mascot big" aria-hidden="true">🥰</div>
          <h1 class="headline">
            YAYYYYY! <span class="accent">It’s a date!</span> 🎉
          </h1>
          <p class="subcopy">
            Official confirmation received. My heart just did a little backflip.
            Pick a vibe and I’ll handle the rest ✨
          </p>

          <ul class="date-ideas">
            <li v-for="idea in dateIdeas" :key="idea.title">
              <span class="idea-emoji">{{ idea.emoji }}</span>
              <div>
                <strong>{{ idea.title }}</strong>
                <p>{{ idea.detail }}</p>
              </div>
            </li>
          </ul>

          <p class="final-note">
            Screenshot this and send it back with a time. I already said yes for
            both of us. 😌💕
          </p>

          <button class="btn yes again" type="button" @click="reset">
            Ask me again (for fun) 🔁
          </button>
        </section>
      </transition>
    </main>
  </div>
</template>

<script>
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
  "The button ran away 🏃",
];

const HINTS = [
  "Tip: the red button has commitment issues.",
  "Hmm… that No seems athletic today.",
  "Fun fact: No is currently unavailable in your area.",
  "Scientists say Yes is the healthier option.",
  "That button is doing cardio. Impressive.",
  "Okay wow, you’re persistent. I’m flattered… and terrified.",
];

export default {
  name: "DateAskPage",
  data() {
    return {
      saidYes: false,
      attempts: 0,
      noX: 0,
      noY: 0,
      floatingHearts: [],
      heartId: 0,
      dateIdeas: [
        {
          emoji: "🍦",
          title: "Ice cream + walk",
          detail: "Sugar high, soft lighting, peak flirt energy.",
        },
        {
          emoji: "🎬",
          title: "Movie night",
          detail: "You pick the film. I bring the snacks (and nerves).",
        },
        {
          emoji: "☕",
          title: "Cute café date",
          detail: "Lattes, people-watching, and accidental hand brushes.",
        },
        {
          emoji: "🌅",
          title: "Sunset hang",
          detail: "Golden hour does 90% of the romance. We do the rest.",
        },
      ],
    };
  },
  computed: {
    noStyle() {
      return {
        transform: `translate(${this.noX}px, ${this.noY}px)`,
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
  },
  mounted() {
    this.spawnAmbientHearts();
    this._heartTimer = setInterval(this.spawnAmbientHearts, 2200);
  },
  beforeDestroy() {
    clearInterval(this._heartTimer);
  },
  methods: {
    flee() {
      this.attempts += 1;
      const arena = this.$refs.arena;
      if (!arena) return;

      const arenaRect = arena.getBoundingClientRect();
      const btnW = 120;
      const btnH = 52;
      const pad = 8;
      const maxX = Math.max(pad, arenaRect.width - btnW - pad);
      const maxY = Math.max(pad, arenaRect.height - btnH - pad);

      let nextX = this.noX;
      let nextY = this.noY;
      let tries = 0;

      while (tries < 12) {
        nextX = Math.random() * maxX - maxX * 0.35;
        nextY = Math.random() * maxY - maxY * 0.2;
        const movedEnough =
          Math.hypot(nextX - this.noX, nextY - this.noY) > 70;
        if (movedEnough) break;
        tries += 1;
      }

      this.noX = nextX;
      this.noY = nextY;
      this.burstHearts(1);
    },
    sayYes() {
      this.saidYes = true;
      for (let i = 0; i < 18; i += 1) {
        setTimeout(() => this.burstHearts(1, true), i * 70);
      }
    },
    reset() {
      this.saidYes = false;
      this.attempts = 0;
      this.noX = 0;
      this.noY = 0;
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
  --blush: #ffe5ec;
  --cream: #fff7f9;
  --ink: #3b1f2b;
  --soft: #7a4558;
  --yes: #2ec4b6;
  --yes-deep: #1b9c91;
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px 16px 40px;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 15% 20%, #ffd6e0 0%, transparent 42%),
    radial-gradient(circle at 85% 15%, #ffc2d4 0%, transparent 36%),
    radial-gradient(circle at 50% 100%, #fff0f5 0%, transparent 45%),
    linear-gradient(160deg, #fff5f8 0%, #ffe3ec 45%, #ffd1dc 100%);
  color: var(--ink);
  font-family: "Nunito", sans-serif;
}

.date-page.celebrate {
  background:
    radial-gradient(circle at 20% 20%, #ffd6ff 0%, transparent 40%),
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
  width: 220px;
  height: 220px;
  background: #ff9ebb;
  top: -40px;
  left: -30px;
}

.blob-b {
  width: 180px;
  height: 180px;
  background: #ffc2e2;
  right: -40px;
  top: 20%;
  animation-delay: -3s;
}

.blob-c {
  width: 260px;
  height: 260px;
  background: #ffd6a5;
  bottom: -80px;
  left: 30%;
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

.card {
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 28px;
  box-shadow:
    0 20px 50px rgba(201, 24, 74, 0.12),
    0 2px 0 rgba(255, 255, 255, 0.8) inset;
  padding: 28px 22px 24px;
  text-align: center;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--soft);
  animation: softPulse 2.4s ease-in-out infinite;
}

.mascot {
  font-size: 4.2rem;
  line-height: 1;
  margin: 6px 0 10px;
  display: inline-block;
  animation: bouncey 1.8s ease-in-out infinite;
  filter: drop-shadow(0 8px 12px rgba(201, 24, 74, 0.18));
}

.mascot.big {
  font-size: 5rem;
}

.headline {
  font-family: "Fraunces", Georgia, serif;
  font-weight: 700;
  font-size: clamp(1.7rem, 5vw, 2.35rem);
  line-height: 1.2;
  margin: 0 0 12px;
}

.accent {
  color: var(--rose-deep);
  background: linear-gradient(120deg, #ff4d6d, #c9184a, #ff8fa3);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.subcopy {
  margin: 0 auto 22px;
  max-width: 34ch;
  color: var(--soft);
  font-size: 1.02rem;
  line-height: 1.5;
}

.button-arena {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 18px;
  min-height: 150px;
  margin: 8px 0 10px;
  padding: 12px;
}

.btn {
  appearance: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 800;
  font-size: 1.05rem;
  border-radius: 999px;
  padding: 14px 28px;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.btn.yes {
  background: linear-gradient(135deg, var(--yes), var(--yes-deep));
  color: white;
  box-shadow: 0 10px 24px rgba(27, 156, 145, 0.35);
  z-index: 2;
  animation: yesGlow 2s ease-in-out infinite;
}

.btn.yes:hover,
.btn.yes:focus-visible {
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 14px 28px rgba(27, 156, 145, 0.45);
}

.btn.yes:active {
  transform: scale(0.98);
}

.btn.no {
  position: relative;
  background: linear-gradient(135deg, #ff758f, var(--rose-deep));
  color: white;
  box-shadow: 0 10px 24px rgba(201, 24, 74, 0.28);
  z-index: 3;
  transition: transform 0.12s ease-out;
  min-width: 118px;
}

.btn.again {
  margin-top: 8px;
}

.hint {
  min-height: 1.4em;
  margin: 0;
  color: var(--rose-deep);
  font-weight: 700;
  font-size: 0.95rem;
}

.date-ideas {
  list-style: none;
  margin: 0 0 18px;
  padding: 0;
  display: grid;
  gap: 10px;
  text-align: left;
}

.date-ideas li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  align-items: start;
  background: rgba(255, 240, 245, 0.9);
  border-radius: 16px;
  padding: 12px 14px;
  border: 1px solid rgba(255, 77, 109, 0.12);
}

.idea-emoji {
  font-size: 1.5rem;
  line-height: 1;
}

.date-ideas strong {
  display: block;
  font-size: 1rem;
  margin-bottom: 2px;
}

.date-ideas p {
  margin: 0;
  color: var(--soft);
  font-size: 0.92rem;
  line-height: 1.4;
}

.final-note {
  margin: 0 0 16px;
  color: var(--soft);
  font-weight: 700;
}

.fade-swap-enter-active,
.fade-swap-leave-active {
  transition: all 0.35s ease;
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

@media (max-width: 480px) {
  .card {
    padding: 24px 16px 20px;
    border-radius: 22px;
  }

  .button-arena {
    min-height: 170px;
  }

  .btn {
    padding: 13px 22px;
    font-size: 1rem;
  }
}
</style>
