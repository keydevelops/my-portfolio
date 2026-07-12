<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { Star, ExternalLink } from 'lucide-vue-next';

interface Repo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  fork: boolean;
}

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  Ruby: '#701516',
};

/**
 * Column span class for a card in a 6-col grid, balancing the last row.
 * Stacks to a single column below the `md` breakpoint.
 */
function getColSpan(index: number, total: number): string {
  const remainder = total % 3;
  if (remainder === 0) return 'col-span-1 md:col-span-2';
  const lastRowStart = total - remainder;
  if (index < lastRowStart) return 'col-span-1 md:col-span-2';
  if (remainder === 1) return 'col-span-1 md:col-span-6';
  return 'col-span-1 md:col-span-3';
}

const repos = ref<Repo[]>([]);
const isLoading = ref(true);
const error = ref(false);
const revealed = ref<Set<number>>(new Set());
const cardRefs = new Map<number, HTMLElement>();
let observer: IntersectionObserver | undefined;

function setCardRef(id: number, el: Element | null) {
  const existing = cardRefs.get(id);
  if (existing && existing !== el) {
    observer?.unobserve(existing);
    cardRefs.delete(id);
  }
  if (el) {
    cardRefs.set(id, el as HTMLElement);
    observer?.observe(el);
  }
}

onUnmounted(() => {
  console.debug('[GitHubProjects] Unmounted, disconnecting observer');
  observer?.disconnect();
  cardRefs.clear();
});

onMounted(async () => {
  console.debug('[GitHubProjects] Mounted, setting up IntersectionObserver');
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = Number((entry.target as HTMLElement).dataset.repoId);
          console.debug('[GitHubProjects] Card revealed:', id);
          revealed.value.add(id);
          observer?.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '-50px', threshold: 0.05 },
  );

  console.debug('[GitHubProjects] Fetching repos from GitHub API');
  try {
    const res = await fetch(
      'https://api.github.com/users/keydevelops/repos?sort=updated&per_page=20',
    );
    if (!res.ok) throw new Error('Failed to fetch projects');
    const json: Repo[] = await res.json();
    repos.value = json.filter((repo) => !repo.fork);
    console.debug('[GitHubProjects] Loaded', repos.value.length, 'repos (excluded forks)');
  } catch (err) {
    console.debug('[GitHubProjects] Fetch failed:', err);
    error.value = true;
  } finally {
    isLoading.value = false;
    await nextTick();
    cardRefs.forEach((el) => observer?.observe(el));
    console.debug('[GitHubProjects] Observer attached to', cardRefs.size, 'cards');
  }
});
</script>

<template>
  <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-6 gap-4 w-full" data-testid="grid-projects-loading">
    <div
      v-for="i in 6"
      :key="i"
      class="col-span-1 md:col-span-2 border border-border/50 bg-card/10 p-6 h-40 animate-pulse flex flex-col justify-between"
    >
      <div>
        <div class="h-5 bg-muted w-1/3 mb-3" />
        <div class="h-4 bg-muted w-full mb-1" />
        <div class="h-4 bg-muted w-2/3" />
      </div>
      <div class="flex gap-4">
        <div class="h-4 bg-muted w-16" />
        <div class="h-4 bg-muted w-16" />
      </div>
    </div>
  </div>

  <div
    v-else-if="error"
    class="text-destructive py-10 font-mono border border-destructive/20 bg-destructive/5 p-6"
    data-testid="text-projects-error"
  >
    &gt; Error: Failed to load projects from GitHub API.
    <br />
    &gt; Retrying...
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-6 gap-4 w-full relative z-10" data-testid="grid-projects">
    <a
      v-for="(repo, index) in repos"
      :key="repo.id"
      :ref="(el) => setCardRef(repo.id, el as Element | null)"
      :data-repo-id="repo.id"
      :href="repo.html_url"
      target="_blank"
      rel="noopener noreferrer"
      :class="[
        getColSpan(index, repos.length),
        'group block border border-border bg-black/40 backdrop-blur-sm p-6 hover:border-primary/50 transition-all duration-300 relative overflow-hidden',
        'transition-[opacity,transform] duration-[400ms] ease-out',
        revealed.has(repo.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
      ]"
      :style="{ transitionDelay: `${index * 0.05}s` }"
      :data-testid="`link-project-${repo.name}`"
    >
      <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div class="relative z-10 h-full flex flex-col justify-between gap-4">
        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2 truncate pr-2">
              <span class="text-primary/50 shrink-0">&gt;</span>
              <span class="truncate">{{ repo.name }}</span>
            </h3>
            <ExternalLink class="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </div>
          <p class="text-sm text-muted-foreground line-clamp-2">
            {{ repo.description ?? 'No description provided.' }}
          </p>
        </div>

        <div class="flex items-center gap-4 text-xs text-muted-foreground">
          <div v-if="repo.language" class="flex items-center gap-1.5">
            <span
              class="w-2.5 h-2.5 rounded-full shrink-0"
              :style="{ backgroundColor: languageColors[repo.language] ?? '#888' }"
            />
            {{ repo.language }}
          </div>
          <div class="flex items-center gap-1">
            <Star class="w-3.5 h-3.5" />
            {{ repo.stargazers_count }}
          </div>
        </div>
      </div>
    </a>
  </div>
</template>
