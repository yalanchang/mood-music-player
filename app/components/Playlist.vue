<template>
  <div class="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold text-white">播放清單</h2>
      <div class="relative">
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="搜尋歌曲..."
          class="bg-white/10 rounded-full px-4 py-2  text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
      </div>
    </div>
    
    <div class="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
      <div 
        v-for="track in filteredTracks" 
        :key="track.id"
        class="flex items-center p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all"
        :class="{ 'bg-white/10': currentTrack?.id === track.id }"
        @click="playTrack(track)"
      >
        <div class="w-10 h-10  bg-white/20 mr-3 overflow-hidden flex-shrink-0">
          <img v-if="track.cover" :src="track.cover" class="w-full h-full object-cover" />
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="font-medium text-white truncate">{{ track.title }}</h4>
          <p class="text-sm text-white/60 truncate">{{ track.artist }}</p>
        </div>
        <div class="text-sm text-white/40 mx-3">{{ formatTime(track.duration) }}</div>
        <button 
          v-if="currentTrack?.id === track.id"
          class="w-8 h-8  flex items-center justify-center"
          @click.stop="togglePlay"
        >
          <span class="text-sm">{{ isPlaying ? '∥' : '▶' }}</span>
        </button>
      </div>
      
      <div v-if="filteredTracks.length === 0" class="text-center py-8 text-white/40">
        沒有找到符合的歌曲
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMusicStore } from '~/stores/musicStore'
import { storeToRefs } from 'pinia'

const musicStore = useMusicStore()

const { 
  filteredTracks, 
  currentTrack, 
  isPlaying,
  searchQuery,
  formatTime
} = storeToRefs(musicStore)

const { playTrack, togglePlay } = musicStore
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}
</style>