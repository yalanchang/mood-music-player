<template>
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-[#0D090A] rounded-2xl w-full max-w-md border border-white/10">
        <div class="p-6 border-b border-white/10">
          <h3 class="text-xl font-bold text-white">
            {{ mode === 'add' ? '寫新日記' : '編輯日記' }}
          </h3>
          <p class="text-white/40 text-sm mt-1">{{ displayDate }}</p>
        </div>
    
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-white/60 text-sm mb-2">今天的心情</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="mood in moods"
                :key="mood.id"
                @click="form.mood = mood.id"
                class="py-2 px-3 rounded-lg transition-all"
                :class="[
                  form.mood === mood.id 
                    ? 'bg-white/50 text-white' 
                    : 'bg-white/5 text-white/60 hover:bg-white/20'
                ]"
              >
                {{ mood.name }}
              </button>
            </div>
          </div>
    
          <div>
            <label class="block text-white/60 text-sm mb-2">日記內容</label>
            <textarea
              v-model="form.content"
              rows="6"
              class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="寫下今天的心情..."
            ></textarea>
          </div>
        </div>
    
        <div class="p-6 border-t border-white/10 flex justify-end space-x-3">
          <button
            @click="$emit('close')"
            class="px-4 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 transition-colors"
          >
            取消
          </button>
          <button
            @click="saveDiary"
            :disabled="!canSave"
            class="px-4 py-2 rounded-lg bg-gray text-white font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ mode === 'add' ? '儲存' : '更新' }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed, watch } from 'vue'
  import { useDiaryStore } from '~/stores/diaryStore'
  
  const props = defineProps({
    mode: {
      type: String,
      default: 'add'
    },
    initialDate: {
      type: [Date, String],  
      default: () => new Date()
    },
    initialDiary: {
      type: Object,
      default: null
    }
  })
  
  const emit = defineEmits(['close', 'saved'])
  const diaryStore = useDiaryStore()
  
  const moods = [
    { id: 'happy', name: '快樂' },
    { id: 'sad', name: '悲傷' },
    { id: 'energetic', name: '活力' },
    { id: 'relaxed', name: '放鬆' },
    { id: 'romantic', name: '浪漫' },
    { id: 'focused', name: '專注' }
  ]
  
  const getLocalDateFromISO = (isoString) => {
    if (!isoString) return ''
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(isoString)) {
      return isoString
    }
    
    if (isoString.includes('T')) {
      const date = new Date(isoString)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    
    return isoString
  }
  
  const toDateString = (input) => {
    if (!input) return ''
    
    if (typeof input === 'string') {
      return getLocalDateFromISO(input)
    }
    
    if (input instanceof Date) {
      const year = input.getFullYear()
      const month = String(input.getMonth() + 1).padStart(2, '0')
      const day = String(input.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    
    return String(input)
  }
  
  const toDisplayDate = (input) => {
    const dateStr = toDateString(input)
    if (!dateStr) return ''
    const [year, month, day] = dateStr.split('-')
    return `${year}年${month}月${day}日`
  }
  
  const form = reactive({
    date: '',
    mood: '',
    content: ''
  })
  
  const initForm = () => {
    if (props.mode === 'edit' && props.initialDiary) {
      
      form.date = getLocalDateFromISO(props.initialDiary.date)
      form.mood = props.initialDiary.mood || ''
      form.content = props.initialDiary.content || ''
      
    } else {
      form.date = toDateString(props.initialDate)
      form.mood = ''
      form.content = ''
      
    }
  }
  
  watch(() => [props.mode, props.initialDiary, props.initialDate], () => {
    initForm()
  }, { immediate: true, deep: true })
  
  const displayDate = computed(() => {
    return toDisplayDate(form.date)
  })
  
  const canSave = computed(() => {
    return form.mood && form.content.trim()
  })
  
  const saveDiary = async () => {
    if (!canSave.value) return
  
    console.log('儲存前檢查:', {
      mode: props.mode,
      initialDiary: props.initialDiary,
      formData: { ...form }
    })
  
    let success
    if (props.mode === 'add') {
      success = await diaryStore.addDiary({
        date: form.date,
        mood: form.mood,
        content: form.content.trim()
      })
    } else {
      if (!props.initialDiary?.id) {
        alert('無法更新：找不到日記 ID')
        return
      }
      
      success = await diaryStore.updateDiary(props.initialDiary.id, {
        mood: form.mood,
        content: form.content.trim()
      })
    }
  
    if (success) {
      emit('saved')
    }
  }
  </script>