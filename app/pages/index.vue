<template>
  <div class="min-h-screen p-4 md:p-8" style="background: #0D1B2A;">
    <div class="max-w-7xl mx-auto">
      <header class="mb-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-2 text-gray-100/40  ">
          心情播放器
        </h1>
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