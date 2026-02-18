<template>
    <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h2 class="text-xl font-bold text-white mb-4">選擇日期</h2>
      
      <div class="flex items-center justify-between mb-4">
        <button 
          @click="prevMonth" 
          class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-white"
        >
          ←
        </button>
        <span class="text-white font-medium">{{ currentYear }}年 {{ currentMonth }}月</span>
        <button 
          @click="nextMonth" 
          class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-white"
        >
          →
        </button>
      </div>
  
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div v-for="day in weekDays" :key="day" class="text-center text-white/40 text-sm">
          {{ day }}
        </div>
      </div>
  
      <div class="grid grid-cols-7 gap-1">
        <div 
          v-for="(date, index) in calendarDays" 
          :key="index"
          class="aspect-square p-1"
        >
          <button
            v-if="date"
            @click="selectDate(date)"
            class="w-full h-full rounded-lg flex flex-col items-center justify-center transition-all relative"
            :class="[
              isSelected(date) ? 'bg-white/50 text-white' : 'bg-white/5 hover:bg-white/20 text-white/80',
              hasDiaryOnDate(date) ? 'ring-2 ring-green-400' : ''
            ]"
          >
            <span class="text-sm">{{ date.getDate() }}</span>
            <span v-if="hasDiaryOnDate(date)" class="text-[8px] mt-0.5">📝</span>
          </button>
          <div v-else class="w-full h-full"></div>
        </div>
      </div>
  
      <button 
        @click="openAddModal"
        class="w-full mt-6 py-3  text-white font-medium hover:opacity-60 transition-all"
      >
        ＋ 寫新日記
      </button>
    </div>
  
    <DiaryModal 
      v-if="showModal"
      :mode="modalMode"
      :initial-date="selectedDate"
      :initial-diary="selectedDiary"
      @close="showModal = false"
      @saved="handleSaved"
    />
  </template>
 
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { format, startOfDay, getYear, getMonth, getDate, parseISO } from 'date-fns' 
  import { useDiaryStore } from '~/stores/diaryStore'
  import DiaryModal from './DiaryModal.vue'
  
  const diaryStore = useDiaryStore()
  const { hasDiary, fetchDiaries } = diaryStore
  
  const weekDays = ['一', '二', '三', '四', '五', '六', '日']
  
  const currentDate = ref(new Date())
  const currentYear = computed(() => getYear(currentDate.value))
  const currentMonth = computed(() => getMonth(currentDate.value) + 1)
  
  const selectedDate = ref(new Date())
  const showModal = ref(false)
  const modalMode = ref('add')
  const selectedDiary = ref(null)
  
  const calendarDays = computed(() => {
    const year = currentYear.value
    const month = currentMonth.value - 1  
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const days = []
    
    const firstDayIndex = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null)
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  })
  
  const hasDiaryOnDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return hasDiary(dateStr)
  }
  
  const isSelected = (date) => {
    if (!selectedDate.value || !date) return false
    return format(date, 'yyyy-MM-dd') === format(selectedDate.value, 'yyyy-MM-dd')
  }
  
  const selectDate = async (date) => {
    selectedDate.value = startOfDay(date)
    const dateStr = format(selectedDate.value, 'yyyy-MM-dd')
    
    const diary = await diaryStore.fetchDiaryByDate(dateStr)
  
    if (diary) {
      selectedDiary.value = diary
      modalMode.value = 'edit'
      showModal.value = true
    }
  }
  
  const openAddModal = () => {
    selectedDiary.value = null
    modalMode.value = 'add'
    showModal.value = true
    console.log('新增 Modal 日期:', format(selectedDate.value, 'yyyy-MM-dd'))
  }
  
  const handleSaved = () => {
    showModal.value = false
    fetchDiaries() 
  }
  
  const prevMonth = () => {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(newDate.getMonth() - 1)
    currentDate.value = newDate
  }
  
  const nextMonth = () => {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(newDate.getMonth() + 1)
    currentDate.value = newDate
  }
  

  
  onMounted(() => {
    fetchDiaries()
  })
  </script>