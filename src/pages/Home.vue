<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { siGithub, siTelegram, siDiscord, siVk } from 'simple-icons';

import ParticleBackground from '@/components/ParticleBackground.vue';
import GlitchText from '@/components/GlitchText.vue';
import GitHubProjects from '@/components/GitHubProjects.vue';
import IntroScreen from '@/components/IntroScreen.vue';
import MusicPlayer from '@/components/MusicPlayer.vue';
import SocialLink from '@/components/SocialLink.vue';

const DISCORD_ID = '680636323471818876';
const FALLBACK_AVATAR = 'https://avatars.githubusercontent.com/u/98818336?v=4';

const entered = ref(false);
const avatarUrl = ref(FALLBACK_AVATAR);
const heroMounted = ref(false);
const hintVisible = ref(false);
const currentYear = new Date().getFullYear();

const chevronDelays = [0, 0.18, 0.36];

let hintTimeout: ReturnType<typeof setTimeout> | undefined;

onUnmounted(() => {
  console.debug('[Home] Unmounted');
  if (hintTimeout) clearTimeout(hintTimeout);
});

onMounted(() => {
  console.debug('[Home] Mounted, fetching Lanyard avatar for Discord ID:', DISCORD_ID);
  fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`)
    .then((r) => r.json())
    .then((json) => {
      const hash = json?.data?.discord_user?.avatar;
      if (hash) {
        avatarUrl.value = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${hash}.png?size=256`;
        console.debug('[Home] Avatar loaded from Discord CDN');
      } else {
        console.debug('[Home] No Discord avatar hash, using GitHub fallback');
      }
    })
    .catch((err) => {
      console.debug('[Home] Lanyard fetch failed, keeping fallback avatar:', err);
    });

  requestAnimationFrame(() => {
    heroMounted.value = true;
    console.debug('[Home] Hero section animation triggered');
  });
  hintTimeout = setTimeout(() => {
    hintVisible.value = true;
    console.debug('[Home] Scroll hint now visible');
  }, 1000);
});

function handleEnter() {
  console.debug('[Home] Intro screen dismissed, entering main content');
  entered.value = true;
}

function scrollToProjects() {
  console.debug('[Home] Scrolling to #projects');
  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    leave-to-class="opacity-0"
  >
    <IntroScreen v-if="!entered" @enter="handleEnter" />
  </Transition>

  <MusicPlayer :entered="entered" />

  <div class="min-h-[100dvh] w-full bg-background text-foreground relative selection:bg-primary selection:text-primary-foreground font-mono overflow-x-hidden">
    <div class="scanlines"></div>
    <ParticleBackground />

    <main class="relative z-10 flex flex-col min-h-[100dvh]">
      <!-- Hero Section -->
      <section class="flex-1 flex flex-col items-center justify-center px-4 pb-20 md:pb-24 relative min-h-[90vh]">
        <div
          class="flex flex-col items-center text-center space-y-8 max-w-3xl transition-all duration-[800ms] ease-out"
          :class="heroMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'"
        >
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/0 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <img
              :src="avatarUrl"
              alt="privatekey"
              class="w-32 h-32 rounded-full border-2 border-border object-cover relative z-10 grayscale group-hover:grayscale-0 transition-all duration-500"
              data-testid="img-avatar"
            />
          </div>

          <div class="space-y-4">
            <h1 class="text-5xl md:text-7xl font-bold tracking-tighter">
              <GlitchText text="privatekey" />
            </h1>
            <p class="text-lg md:text-xl text-muted-foreground flex items-center justify-center gap-2">
              "Security is just a suggestion"
            </p>
          </div>

          <div class="flex items-center gap-6 pt-4" data-testid="container-socials">
            <SocialLink href="https://github.com/keydevelops" label="GitHub">
              <svg viewBox="0 0 24 24" class="w-6 h-6" fill="currentColor"><path :d="siGithub.path" /></svg>
            </SocialLink>
            <SocialLink href="https://t.me/corruptedkeyy" label="Telegram">
              <svg viewBox="0 0 24 24" class="w-6 h-6" fill="currentColor"><path :d="siTelegram.path" /></svg>
            </SocialLink>
            <SocialLink href="https://discord.com/users/680636323471818876" label="Discord">
              <svg viewBox="0 0 24 24" class="w-6 h-6" fill="currentColor"><path :d="siDiscord.path" /></svg>
            </SocialLink>
            <SocialLink href="https://vk.com/pkeyz" label="VK">
              <svg viewBox="0 0 24 24" class="w-6 h-6" fill="currentColor"><path :d="siVk.path" /></svg>
            </SocialLink>
          </div>
        </div>

        <button
          @click="scrollToProjects"
          class="absolute left-1/2 -translate-x-1/2 bottom-6 md:bottom-8 hidden md:flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground transition-all duration-300 group"
          :class="hintVisible ? 'opacity-100' : 'opacity-0'"
          style="transition-property: opacity, color"
          aria-label="Scroll to projects"
          data-testid="button-scroll-hint"
        >
          <span class="text-xs font-mono tracking-wide opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            <span class="text-primary/60">$</span> cd ./projects
            <span class="inline-block w-[7px] h-[13px] bg-current/70 ml-1 align-middle animate-[blink_1s_step-start_infinite]" />
          </span>
          <div class="flex flex-col items-center -space-y-1.5">
            <svg
              v-for="(delay, i) in chevronDelays"
              :key="i"
              width="14"
              height="8"
              viewBox="0 0 14 8"
              fill="none"
              class="animate-[chevronFade_1.4s_ease-in-out_infinite]"
              :style="{ animationDelay: `${delay}s` }"
            >
              <path d="M1 1L7 7L13 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </button>
      </section>

      <!-- Projects Section -->
      <section id="projects" class="py-24 px-4 bg-background/50 backdrop-blur-sm border-t border-border/50">
        <div class="max-w-5xl mx-auto space-y-12">
          <div class="flex items-center gap-4">
            <h2 class="text-3xl md:text-4xl font-bold">
              <GlitchText text="/projects" />
            </h2>
            <div class="flex-1 h-px bg-border max-w-xs"></div>
          </div>

          <GitHubProjects />
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-8 px-4 border-t border-border/30 bg-background/80 backdrop-blur-md mt-auto">
        <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p class="flex items-center gap-2">
            &copy; {{ currentYear }} <GlitchText text="privatekey" />. <span>_ EOF</span>
          </p>
          <div class="flex items-center gap-4">
            <a href="https://github.com/keydevelops" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">GitHub</a>
            <a href="https://t.me/corruptedkeyy" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">Telegram</a>
            <a href="https://discord.com/users/680636323471818876" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </main>
  </div>
</template>
