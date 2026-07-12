<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const emit = defineEmits<{ enter: [] }>();

const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*-+[]{}|;<>';
const TARGET_TEXT = 'click';

const glitchedText = ref('\u00a0'.repeat(TARGET_TEXT.length));
const cursorVisible = ref(true);
const hovered = ref(false);
const visible = ref(false);
const leaving = ref(false);

let cursorInterval: ReturnType<typeof setInterval> | undefined;
let animTimeout: ReturnType<typeof setTimeout> | undefined;
let revealTimeout: ReturnType<typeof setTimeout> | undefined;
let exitTimeout: ReturnType<typeof setTimeout> | undefined;

function startGlitchReveal(startDelay = 900) {
  console.debug('[IntroScreen] Glitch reveal starting in', startDelay, 'ms');
  const chars = TARGET_TEXT.split('');
  let frame = 0;

  const tick = () => {
    const revealed = Math.floor(frame / 4);
    let result = '';
    for (let i = 0; i < chars.length; i++) {
      if (i < revealed) {
        result += chars[i];
      } else {
        result += GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      }
    }
    glitchedText.value = result;
    frame++;
    if (revealed < chars.length) {
      animTimeout = setTimeout(tick, 55);
    } else {
      glitchedText.value = TARGET_TEXT;
      console.debug('[IntroScreen] Glitch reveal complete, text:', TARGET_TEXT);
    }
  };

  revealTimeout = setTimeout(tick, startDelay);
}

onMounted(() => {
  console.debug('[IntroScreen] Mounted');
  requestAnimationFrame(() => {
    visible.value = true;
  });
  startGlitchReveal();
  cursorInterval = setInterval(() => {
    cursorVisible.value = !cursorVisible.value;
  }, 520);
});

onUnmounted(() => {
  console.debug('[IntroScreen] Unmounted');
  if (cursorInterval) clearInterval(cursorInterval);
  if (animTimeout) clearTimeout(animTimeout);
  if (revealTimeout) clearTimeout(revealTimeout);
  if (exitTimeout) clearTimeout(exitTimeout);
});

function handleClick() {
  if (leaving.value) return;
  console.debug('[IntroScreen] Clicked, starting exit transition');
  leaving.value = true;
  exitTimeout = setTimeout(() => {
    console.debug('[IntroScreen] Exit transition done, emitting enter');
    emit('enter');
  }, 900);
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden transition-opacity duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
    :class="leaving ? 'opacity-0' : 'opacity-100'"
    @click="handleClick"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <!-- Scanlines -->
    <div class="scanlines absolute inset-0 pointer-events-none" />

    <!-- Background grid lines -->
    <div
      class="absolute inset-0 pointer-events-none opacity-[0.04]"
      style="
        background-image: linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px);
        background-size: 60px 60px;
      "
    />

    <!-- Sweep line — runs once top to bottom -->
    <div
      class="absolute left-0 right-0 h-px bg-white/20 pointer-events-none transition-[top,opacity] duration-[1400ms] ease-linear"
      :style="visible ? { top: '100vh', opacity: 0, transitionDelay: '0.2s' } : { top: '-2px', opacity: 0.6 }"
    />

    <!-- Center content -->
    <div
      class="font-mono text-center px-4 transition-opacity duration-300"
      :class="visible ? 'opacity-100' : 'opacity-0'"
    >
      <!-- Corner decoration -->
      <div
        class="text-white/20 text-xs tracking-widest mb-8 transition-all duration-500"
        :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'"
        style="transition-delay: 0.5s"
      >
        // prvkey.ru
      </div>

      <!-- Main "click" word -->
      <div
        class="text-6xl md:text-9xl font-bold text-white tracking-tight leading-none transition-[text-shadow] duration-300"
        :style="{ textShadow: hovered ? '0 0 20px rgba(255,255,255,0.4)' : '0 0 0px rgba(255,255,255,0)' }"
      >
        {{ glitchedText }}<span
          class="inline-block w-[3px] md:w-[5px] align-bottom ml-1"
          :style="{
            height: '0.85em',
            background: 'white',
            opacity: cursorVisible ? 1 : 0,
            transition: 'opacity 0.05s',
            verticalAlign: 'middle',
          }"
        />
      </div>

      <!-- Hint -->
      <p class="mt-10 text-[10px] md:text-xs text-white/30 tracking-[0.45em] uppercase animate-[hintPulse_4s_ease-in-out_2.2s_infinite]">
        press anywhere
      </p>
    </div>

    <!-- Corner brackets — decorative -->
    <div
      v-for="(cls, i) in [
        'top-6 left-6 border-t border-l',
        'top-6 right-6 border-t border-r',
        'bottom-6 left-6 border-b border-l',
        'bottom-6 right-6 border-b border-r',
      ]"
      :key="i"
      :class="['absolute w-8 h-8 border-white/15 pointer-events-none transition-all duration-500', cls, visible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.8]']"
      :style="{ transitionDelay: `${0.3 + i * 0.08}s` }"
    />
  </div>
</template>
