<template>
  <div class="glass-morphism rounded-2xl p-6">
    <h2 class="text-2xl font-bold mb-4 text-white/40">
      今天的心情是？
    </h2>
    
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4  ">
      <div 
        v-for="mood in moods" 
        :key="mood.id"
        class="mood-btn"
        :class="[currentMood === mood.id ? 'active' : '']"
        :style="{ backgroundColor: mood.bgColor }"
        @click="setMood(mood.id)"
      >
      
        <div class="font-medium text-white">{{ mood.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMusicStore } from '~/stores/musicStore'
import { storeToRefs } from 'pinia'

const musicStore = useMusicStore()
const { currentMood, currentMoodData } = storeToRefs(musicStore)
const { setMood } = musicStore

const moods = [
{ id: 'happy', name: '快樂', bgColor: '#1B263B' },     
  { id: 'sad', name: '悲傷', bgColor: '#415A77' },       
  { id: 'energetic', name: '活力', bgColor: '#778DA9' },  
  { id: 'relaxed', name: '放鬆', bgColor: '#0B132B' },   
  { id: 'romantic', name: '浪漫', bgColor: '#1C2541' },    
  { id: 'focused', name: '專注', bgColor: '#3A506B' }     
]
</script>

<style scoped>
.mood-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1/1;
  border-radius: 50%; 
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.mood-btn:hover {
  border-color: rgba(255, 255, 255, 0.3);
}

.mood-btn.active {
  transform: scale(1.05);
  border-color: transparent;
}

</style>