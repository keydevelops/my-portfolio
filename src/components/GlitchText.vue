<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    text: string;
    as?: string;
    class?: string;
  }>(),
  { as: 'span', class: '' },
);

const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_+=[]{}|;:,.<>?";

const displayText = ref(props.text);
const isHovered = ref(false);
let interval: ReturnType<typeof setInterval> | undefined;
let revertTimeout: ReturnType<typeof setTimeout> | undefined;

function glitch() {
  if (Math.random() < 0.1 || isHovered.value) {
    const textArray = props.text.split('');
    const numGlitches = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numGlitches; i++) {
      const randIndex = Math.floor(Math.random() * textArray.length);
      const randChar = CHARS[Math.floor(Math.random() * CHARS.length)];
      if (textArray[randIndex] !== ' ') {
        textArray[randIndex] = randChar;
      }
    }
    displayText.value = textArray.join('');

    revertTimeout = setTimeout(() => {
      if (!isHovered.value) {
        displayText.value = props.text;
      }
    }, 50 + Math.random() * 100);
  } else {
    displayText.value = props.text;
  }
}

onMounted(() => {
  interval = setInterval(glitch, 150);
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
  if (revertTimeout) clearTimeout(revertTimeout);
});

watch(
  () => props.text,
  (next) => {
    displayText.value = next;
  },
);

function handleMouseEnter() {
  isHovered.value = true;
}

function handleMouseLeave() {
  isHovered.value = false;
  displayText.value = props.text;
}
</script>

<template>
  <component
    :is="as"
    :class="props.class"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    :data-testid="`text-glitch-${text.replace(/\s+/g, '-').toLowerCase()}`"
  >{{ displayText }}</component>
</template>
