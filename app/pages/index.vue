<template>
  <div class="min-h-screen p-4 md:p-8" style="background: #0D1B2A;">
    <div class="max-w-7xl mx-auto">
      <header class="mb-8 flex items-center justify-between">
        <div class="flex-1"></div>
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold mb-2 text-white/80">
            心情播放器
          </h1>
        </div>
        <div class="flex-1 flex justify-end">
          <NuxtLink 
            to="/diary"
            class="px-4 py-2  text-white/80 hover:text-white  transition-all flex items-center space-x-2"
          >
            <span>📔</span>
          </NuxtLink>
        </div>
      </header>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1">
          <MoodSelector />
        </div>
        <div class="lg:col-span-2 space-y-6">
          <PlayerControls />
          <Playlist />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMusicStore } from '~/stores/musicStore'

const musicStore = useMusicStore()

onMounted(() => {
  musicStore.initAudio()
})

onUnmounted(() => {
  if (musicStore.audioElement) {
    musicStore.audioElement.pause()
    musicStore.audioElement.src = ''
  }
})
</script>