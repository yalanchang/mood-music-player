<template>
  <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
    <div class="flex items-center space-x-4 mb-6">
      <div class="w-20 h-20  bg-gradient-to-r from-white/10  to-white flex items-center justify-center overflow-hidden shadow-lg">
        <span v-if="!currentTrack?.cover" class="text-white text-3xl font-light">♪</span>
        <img 
          v-else 
          :src="currentTrack.cover" 
          :alt="currentTrack.title"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-xl font-bold text-white truncate">{{ currentTrack?.title || '未播放' }}</h3>
        <p class="text-white/50 truncate text-sm">{{ currentTrack?.artist || '選擇一首歌曲開始' }}</p>
      </div>
    </div>
    
    <div class="space-y-2 mb-6">
      <div class="progress-bar" @click="handleProgressClick">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="flex justify-between text-xs text-white/40 font-mono">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(currentTrack?.duration || 0) }}</span>
      </div>
    </div>
    
    <div class="flex items-center justify-center space-x-4">
      <button 
        @click="playPrevious" 
        class="w-12 h-12   transition-all flex items-center justify-center text-white/70 hover:text-white"
        title="上一首"
      >
        <span class="text-xl">〈</span>
      </button>
      
      <button 
        @click="togglePlay" 
        class="w-16 h-16  transition-all flex items-center justify-center text-white  "
      >
        <span class="text-3xl font-light">{{ isPlaying ? '∥' : '▶' }}</span>
      </button>
      
      <button 
        @click="playNext" 
        class="w-12 h-12   transition-all flex items-center justify-center text-white/70 hover:text-white"
        title="下一首"
      >
        <span class="text-xl">〉</span>
      </button>
    </div>
    
<div class="mt-6">
  <div class="flex items-center justify-between mb-2">
    <span class="text-white/40 text-xs font-light tracking-wider">VOLUME</span>
    <span class="text-white/60 text-xs font-mono">{{ Math.round(volume * 100) }}%</span>
  </div>
  <div class="relative h-8 flex items-center">
    <div class="absolute w-full h-0.5 bg-white/10 rounded-full"></div>
    
    <div 
      class="absolute h-0.5 bg-gradient-to-r from-white/10  to-white rounded-full transition-all duration-150"
      :style="{ width: (volume * 100) + '%' }"
    ></div>
    
    <div 
      class="absolute w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-150 flex items-center justify-center"
      :style="{ left: `calc(${volume * 100}% - 8px)` }"
    >
      <div class="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
    </div>
    
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      :value="volume"
      @input="handleVolumeChange"
      class="absolute w-full h-8 opacity-0 cursor-pointer z-10"
    />
  </div>
</div>
  </div>
</template>

<script setup lang="ts">
import { useMusicStore } from '~/stores/musicStore'
import { storeToRefs } from 'pinia'

const musicStore = useMusicStore()

const { 
  currentTrack, 
  isPlaying, 
  currentTime, 
  volume, 
  progress,
  formatTime
} = storeToRefs(musicStore)

const { togglePlay, playNext, playPrevious, seekTo, setVolume } = musicStore

const handleProgressClick = (e: any) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const x = e.clientX - rect.left
  const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
  seekTo(percentage)
}

const handleVolumeChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const value = parseFloat(target.value)
  setVolume(value)
}
</script>

<style scoped>
.progress-bar {
  @apply w-full h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer transition-all hover:h-1.5;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-white/10  to-white rounded-full transition-all duration-100;
}

button {
  transition: all 0.2s ease;
}

button:active {
  transform: scale(0.95);
}

input[type=range] {
  -webkit-appearance: none;
  background: transparent;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
}

input[type=range]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
}
</style>