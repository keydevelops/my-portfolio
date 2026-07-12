<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

interface Track {
  author: string;
  name: string;
  cover: string;
  link: string;
}

const props = defineProps<{ entered: boolean }>();

const PLAYLIST_URL = 'https://cdn.prvkey.ru/music.json';

function isValidTrack(t: unknown): t is Track {
  if (!t || typeof t !== 'object') return false;
  const r = t as Record<string, unknown>;
  return (
    typeof r.author === 'string' && r.author.trim() !== '' &&
    typeof r.name === 'string' && r.name.trim() !== '' &&
    typeof r.link === 'string' && r.link.trim() !== ''
  );
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const playlist = ref<Track[]>([]);
const current = ref<Track | null>(null);
const playing = ref(false);
const volume = ref(0.05);
const ready = ref(false);
const expanded = ref(false);

const audioRef = ref<HTMLAudioElement | null>(null);
let intendToPlay = false;
let preloadAudio: HTMLAudioElement | null = null;

const eqHeights = [0.6, 1, 0.75, 0.9, 0.5];

function preloadTrack(track: Track) {
  console.debug('[MusicPlayer] Preloading track:', track.name, '—', track.author);
  if (preloadAudio) {
    preloadAudio.src = '';
    preloadAudio.load();
  }
  preloadAudio = new Audio();
  preloadAudio.preload = 'auto';
  preloadAudio.src = track.link;
  preloadAudio.addEventListener('canplaythrough', () => {
    console.debug('[MusicPlayer] Preload complete for:', track.name);
  }, { once: true });
  preloadAudio.addEventListener('error', (e) => {
    console.debug('[MusicPlayer] Preload error for:', track.name, e);
  }, { once: true });
  preloadAudio.load();
}

onMounted(() => {
  console.debug('[MusicPlayer] Mounted, fetching playlist from:', PLAYLIST_URL);
  fetch(PLAYLIST_URL)
    .then((r) => r.json())
    .then((data: unknown) => {
      const valid = Array.isArray(data) ? data.filter(isValidTrack) : [];
      console.debug('[MusicPlayer] Playlist fetched:', valid.length, 'valid tracks');
      if (valid.length > 0) {
        playlist.value = valid;
        const picked = pickRandom(valid);
        current.value = picked;
        console.debug('[MusicPlayer] Selected track:', picked.name, '—', picked.author);
        preloadTrack(picked);
      } else {
        console.debug('[MusicPlayer] No valid tracks found in playlist');
      }
    })
    .catch((err) => {
      console.debug('[MusicPlayer] Failed to fetch playlist:', err);
    });
});

watch(
  () => [props.entered, current.value?.link] as const,
  ([entered]) => {
    if (!entered || !current.value || !audioRef.value) return;
    console.debug('[MusicPlayer] Entered, attempting autoplay:', current.value.name);
    const audio = audioRef.value;
    audio.volume = volume.value;
    intendToPlay = true;
    audio.play().catch((err) => {
      console.debug('[MusicPlayer] Autoplay blocked:', err);
      intendToPlay = false;
    });
  },
);

watch(volume, (v) => {
  console.debug('[MusicPlayer] Volume changed:', Math.round(v * 100) + '%');
  if (audioRef.value) audioRef.value.volume = v;
});

function skip() {
  if (playlist.value.length === 0) return;
  const others = current.value
    ? playlist.value.filter((t) => t.link !== current.value!.link)
    : playlist.value;
  const next = others.length > 0 ? pickRandom(others) : playlist.value[0];
  console.debug('[MusicPlayer] Skipping to:', next.name, '—', next.author);
  current.value = next;
  ready.value = false;
  preloadTrack(next);
}

function togglePlay() {
  const audio = audioRef.value;
  if (!audio || !ready.value) return;
  if (playing.value) {
    console.debug('[MusicPlayer] Pausing');
    audio.pause();
    intendToPlay = false;
  } else {
    console.debug('[MusicPlayer] Resuming playback');
    intendToPlay = true;
    audio.play().catch((err) => {
      console.debug('[MusicPlayer] Play failed:', err);
      intendToPlay = false;
    });
  }
}

function handleCanPlay() {
  console.debug('[MusicPlayer] canplay fired for:', current.value?.name);
  ready.value = true;
  if (intendToPlay && audioRef.value) {
    audioRef.value.volume = volume.value;
    audioRef.value.play().catch(() => {});
  }
}

function handleEnded() {
  console.debug('[MusicPlayer] Track ended:', current.value?.name);
  if (playlist.value.length > 1) skip();
}

function handleCoverError(e: Event) {
  console.debug('[MusicPlayer] Cover image failed to load for:', current.value?.name);
  (e.target as HTMLImageElement).style.display = 'none';
}

const volumePercent = computed(() => Math.round(volume.value * 100));
</script>

<template>
  <template v-if="current">
    <audio
      :key="current.link"
      ref="audioRef"
      :src="current.link"
      :loop="playlist.length <= 1"
      preload="auto"
      @canplay="handleCanPlay"
      @play="playing = true"
      @pause="playing = false"
      @ended="handleEnded"
    />

    <Transition
      enter-active-class="transition-all duration-[350ms] ease-out"
      enter-from-class="opacity-0 scale-[0.6] translate-y-5"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-[350ms] ease-out"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-[0.6] translate-y-5"
    >
      <div
        v-if="entered"
        class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
        style="transition-delay: 0.1s"
      >
        <Transition
          enter-active-class="transition-all duration-[220ms] ease-out"
          enter-from-class="opacity-0 scale-[0.92] translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-[220ms] ease-out"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-[0.92] translate-y-2"
        >
          <div
            v-if="expanded"
            class="w-64 border border-border/60 bg-black/95 backdrop-blur-md p-3 flex flex-col gap-3 origin-bottom-right"
          >
            <div class="flex items-center gap-3">
              <img
                :src="current.cover ?? ''"
                :alt="current.name"
                class="w-12 h-12 object-cover border border-border/50 shrink-0 grayscale"
                @error="handleCoverError"
              />
              <div class="flex flex-col min-w-0">
                <span class="text-[11px] text-white/90 font-mono truncate leading-snug">{{ current.name }}</span>
                <span class="text-[10px] text-white/40 font-mono truncate leading-snug">{{ current.author }}</span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="togglePlay"
                :disabled="!ready"
                :aria-label="playing ? 'Pause' : 'Play'"
                class="flex-1 h-7 flex items-center justify-center border border-border/60 text-white/70 hover:border-white/40 hover:text-white transition-all duration-150 disabled:opacity-30"
              >
                <svg v-if="playing" width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                  <rect x="0.5" y="0.5" width="3" height="11" rx="0.5" />
                  <rect x="6.5" y="0.5" width="3" height="11" rx="0.5" />
                </svg>
                <svg v-else width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                  <path d="M0.5 0.5 L9.5 6 L0.5 11.5 Z" />
                </svg>
              </button>

              <button
                v-if="playlist.length > 1"
                @click="skip"
                aria-label="Skip"
                class="flex-1 h-7 flex items-center justify-center border border-border/60 text-white/70 hover:border-white/40 hover:text-white transition-all duration-150"
              >
                <svg width="13" height="12" viewBox="0 0 13 12" fill="currentColor">
                  <path d="M0.5 0.5 L8 6 L0.5 11.5 Z" />
                  <rect x="9.5" y="0.5" width="3" height="11" rx="0.5" />
                </svg>
              </button>
            </div>

            <div class="flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="currentColor" class="text-white/35 shrink-0">
                <path d="M1 5h3l4-3v10l-4-3H1V5z" />
                <path v-if="volume > 0" d="M9.5 4.5a3 3 0 0 1 0 5" stroke="currentColor" stroke-width="1.2" fill="none" />
                <path v-if="volume > 0.4" d="M11 2.5a5.5 5.5 0 0 1 0 9" stroke="currentColor" stroke-width="1.2" fill="none" />
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                v-model.number="volume"
                aria-label="Volume"
                class="volume-slider flex-1"
              />
              <span class="text-[10px] text-white/30 font-mono w-6 text-right tabular-nums shrink-0">{{ volumePercent }}%</span>
            </div>
          </div>
        </Transition>

        <button
          @click="expanded = !expanded"
          :aria-label="expanded ? 'Hide player' : 'Show player'"
          class="w-10 h-10 flex items-center justify-center border border-border/60 bg-black/90 backdrop-blur-md text-white/60 hover:border-white/40 hover:text-white transition-all duration-200 relative"
        >
          <span v-if="playing" class="flex items-end gap-[2px] h-3">
            <span
              v-for="(h, i) in eqHeights"
              :key="i"
              class="w-[2px] bg-white/70 rounded-sm"
              :style="{ height: `${h * 100}%`, animation: `eqBar 0.8s ease-in-out ${i * 0.12}s infinite alternate` }"
            />
          </span>
          <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="opacity-70">
            <path d="M13 1v8.268A2.5 2.5 0 1 1 11 7V3.535L6 4.8V12.5A2.5 2.5 0 1 1 4 10V4.2l9-2.4z" />
          </svg>
        </button>
      </div>
    </Transition>
  </template>
</template>
