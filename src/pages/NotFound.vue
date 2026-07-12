<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next';
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-background text-foreground font-mono px-4">
    <div class="w-full max-w-md border border-border bg-black/40 p-6">
      <div class="flex mb-4 gap-2 items-center">
        <AlertCircle class="h-8 w-8 text-destructive" />
        <h1 class="text-2xl font-bold">404 Not Found</h1>
      </div>
      <p class="mt-4 text-sm text-muted-foreground">
        &gt; This route doesn't exist.
      </p>
      <router-link to="/" class="mt-6 inline-block text-sm text-primary hover:underline">
        $ cd ~
      </router-link>
    </div>
  </div>
</template>
