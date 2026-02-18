import { defineStore } from 'pinia'
import { format } from 'date-fns'

export interface Diary {
  id: number
  date: string
  mood: string
  content: string
  created_at: string
  updated_at: string
}

interface DiaryUpdates {
  mood: string
  content: string
}

interface DiaryInput {
  date: string
  mood: string
  content: string
}

// 定義各種 API 回應的型別
interface DiariesApiResponse {
  success: boolean
  data: Diary[]
  error?: string
}

interface DiaryApiResponse {
  success: boolean
  data: Diary | null
  error?: string
}

interface DiaryPostApiResponse {
  success: boolean
  data?: Diary
  error?: string
}

interface DiaryDeleteApiResponse {
  success: boolean
  error?: string
}

interface DiaryUpdateApiResponse {
  success: boolean
  error?: string
}

export const useDiaryStore = defineStore('diary', {
  state: () => ({
    diaries: [] as Diary[],
    currentDiary: null as Diary | null,
    selectedDate: format(new Date(), 'yyyy-MM-dd'),
    loading: false,
    error: null as string | null
  }),

  getters: {
    // 原有的 getters
    getDiaryByDate: (state) => (date: string) => {
      return state.diaries.find(d => d.date === date)
    },
    
    hasDiary: (state) => (date: string) => {
      return state.diaries.some(d => d.date === date)
    },
    
    sortedDiaries: (state) => {
      return [...state.diaries].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    },

    formattedDiaries: (state) => {
        return state.diaries.map(diary => {
          const dateStr = diary.date?.split('T')?.[0] || ''
          const [year, month, day] = dateStr.split('-')
          
          return {
            ...diary,
            displayDate: year && month && day ? `${year}/${month}/${day}` : diary.date || '',
            displayTime: diary.updated_at ? (() => {
              const date = new Date(diary.updated_at)
              if (isNaN(date.getTime())) return ''
              return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
            })() : ''
          }
        })
      },

      formattedCurrentDiary: (state) => {
        if (!state.currentDiary) return null
        
        const diary = state.currentDiary
        
        let displayDate = diary.date || ''
        if (displayDate && displayDate.includes('-')) {
          const dateParts = displayDate.split('T')
          const dateStr = dateParts[0] || ''
          if (dateStr) {
            const [year, month, day] = dateStr.split('-')
            if (year && month && day) {
              displayDate = `${year}/${month}/${day}`
            }
          }
        }
        
        let displayTime = ''
        if (diary.updated_at) {
          const date = new Date(diary.updated_at)
          if (!isNaN(date.getTime())) {
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            displayTime = `${hours}:${minutes}`
          }
        }
        
        return {
          ...diary,
          displayDate,
          displayTime
        }
      }
  },

  actions: {
    // 獲取所有日記
    async fetchDiaries() {
      this.loading = true
      this.error = null
      
      try {
        const response = await $fetch<DiariesApiResponse>('/api/diary')
        if (response.success) {
          this.diaries = response.data
        } else {
          this.error = response.error || '獲取日記失敗'
        }
      } catch (error: any) {
        this.error = error.message
        console.error('獲取日記失敗:', error)
      } finally {
        this.loading = false
      }
    },

    // 獲取特定日期的日記
    async fetchDiaryByDate(date: string) {
      this.loading = true
      this.error = null
      
      try {
        const response = await $fetch<DiaryApiResponse>(`/api/diary/date/${date}`)
        if (response.success) {
          this.currentDiary = response.data
          return response.data
        }
        return null
      } catch (error: any) {
        this.error = error.message
        return null
      } finally {
        this.loading = false
      }
    },

    // 新增日記
    async addDiary(diary: DiaryInput) {
      this.loading = true
      this.error = null
      
      try {
        const response = await $fetch<DiaryPostApiResponse>('/api/diary/post', {
          method: 'POST',
          body: diary
        })
        
        if (response.success && response.data) {
          this.diaries.push(response.data)
          this.currentDiary = response.data
          return true
        } else {
          this.error = response.error || '新增日記失敗'
          return false
        }
      } catch (error: any) {
        this.error = error.message
        console.error('新增日記失敗:', error)
        return false
      } finally {
        this.loading = false
      }
    },

   // 修改日記
async updateDiary(id: number, updates: DiaryUpdates) {
    this.loading = true
    this.error = null
    
    try {
      const response = await $fetch<DiaryUpdateApiResponse>(`/api/diary/id/${id}`, {
        method: 'PUT',
        body: updates
      })
      
      if (response.success) {
        this.diaries = this.diaries.map(diary => {
          if (diary.id === id) {
            return {
              id: diary.id,
              date: diary.date,
              mood: updates.mood,
              content: updates.content,
              created_at: diary.created_at,
              updated_at: new Date().toISOString()
            }
          }
          return diary
        })
        
        if (this.currentDiary?.id === id) {
          this.currentDiary = {
            id: this.currentDiary.id,
            date: this.currentDiary.date,
            mood: updates.mood,
            content: updates.content,
            created_at: this.currentDiary.created_at,
            updated_at: new Date().toISOString()
          }
        }
        
        return true
      }
      return false
    } catch (error: any) {
      this.error = error.message
      return false
    } finally {
      this.loading = false
    }
  },

    // 刪除日記
    async deleteDiary(id: number) {
      this.loading = true
      this.error = null
      
      try {
        const response = await $fetch<DiaryDeleteApiResponse>(`/api/diary/id/${id}`, {
          method: 'DELETE'
        })
        
        if (response.success) {
          this.diaries = this.diaries.filter(d => d.id !== id)
          if (this.currentDiary?.id === id) {
            this.currentDiary = null
          }
          return true
        }
        return false
      } catch (error: any) {
        this.error = error.message
        return false
      } finally {
        this.loading = false
      }
    },

    setSelectedDate(date: string) {
      this.selectedDate = date
    },

    // 清除錯誤
    clearError() {
      this.error = null
    }
  }
})