<script setup lang="ts">
defineProps<{
  href: string;
  label: string;
}>();
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    class="p-3 border border-border bg-black/40 hover:border-primary hover:text-primary text-muted-foreground transition-all duration-300 rounded-none group relative"
    :aria-label="label"
    :data-testid="`link-social-${label.toLowerCase()}`"
  >
    <div class="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div class="relative z-10">
      <slot />
    </div>
  </a>
</template>
