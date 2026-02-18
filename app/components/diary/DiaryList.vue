<template>
    <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
  
      <div v-if="diaryStore.loading" class="text-center py-12">
        <div class="text-white/40">載入中...</div>
      </div>
  
      <div v-else-if="sortedDiaries.length === 0" class="text-center py-12">
        <p class="text-white/40">還沒有任何日記</p>
        <p class="text-white/20 text-sm mt-2">點擊「寫新日記」開始記錄</p>
      </div>
  
      <div v-else class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        <div
          v-for="diary in sortedDiaries"
          :key="diary.id"
          class=" p-4  transition-all cursor-pointer group"
          @click="editDiary(diary)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <span class="text-white/60 text-sm">{{ formatDate(diary.date) }}</span>
                <span class="px-2 py-0.5 rounded-full text-xs"
                  :class="getMoodClass(diary.mood)"
                >
                  {{ getMoodName(diary.mood) }}
                </span>
              </div>
              
              <p class="text-white/80 line-clamp-2">{{ diary.content }}</p>
              
              <p class="text-white/20 text-xs mt-2">
                更新於 {{ formatTime(diary.updated_at) }}
            </p>
            </div>
  
            <button
              @click.stop="confirmDelete(diary)"
              class="opacity-0 group-hover:opacity-100 transition-opacity ml-2 w-4 h-4  flex items-center justify-center text-white/60 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-[#0D090A] rounded-2xl w-full max-w-sm border border-white/10 p-6">
        <h3 class="text-lg font-bold text-white mb-2">確認刪除</h3>
        <p class="text-white/60 text-sm mb-6">確定要刪除這篇日記嗎？此操作無法復原。</p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10"
          >
            取消
          </button>
          <button
            @click="deleteDiary"
            class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            刪除
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue'
  import { useDiaryStore } from '~/stores/diaryStore'
  
  const diaryStore = useDiaryStore()
  
  const showDeleteModal = ref(false)
  const diaryToDelete = ref(null)
  
  const sortedDiaries = computed(() => {
    return diaryStore.sortedDiaries
  })
  
  const getMoodName = (moodId) => {
    const moods = {
      happy: '快樂',
      sad: '悲傷',
      energetic: '活力',
      relaxed: '放鬆',
      romantic: '浪漫',
      focused: '專注'
    }
    return moods[moodId] || moodId
  }
  
  const getMoodClass = (moodId) => {
    const classes = {
      happy: 'bg-yellow-400/20 text-yellow-300',
      sad: 'bg-blue-400/20 text-blue-300',
      energetic: 'bg-orange-400/20 text-orange-300',
      relaxed: 'bg-green-400/20 text-green-300',
      romantic: 'bg-red-400/20 text-red-300',
      focused: 'bg-purple-400/20 text-purple-300'
    }
    return classes[moodId] || 'bg-white/20 text-white/60'
  }
  
  const formatDate = (dateStr) => {
  if (!dateStr) return ''
  
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return `${year}/${month}/${day}`
}
  
  // 格式化時間
  const formatTime = (datetimeStr) => {
  if (!datetimeStr) return ''
  
  const date = new Date(datetimeStr)
  if (isNaN(date.getTime())) return ''
  
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${hours}:${minutes}`
}
  

  
  const confirmDelete = (diary) => {
    diaryToDelete.value = diary
    showDeleteModal.value = true
  }
  
  const deleteDiary = async () => {
    if (!diaryToDelete.value) return
    
    const success = await diaryStore.deleteDiary(diaryToDelete.value.id)
    if (success) {
      showDeleteModal.value = false
      diaryToDelete.value = null
    }
  }
  </script>
  
  <style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>