import { defineStore } from 'pinia'

// 定義介面
export interface Track {
  id: string
  title: string
  artist: string
  cover: string
  url: string
  duration: number
}

interface Mood {
  id: string
  name: string
  emoji: string
  color: string
  bgColor: string
}

// 定義 Mood 類型，作為 musicLibrary 的索引鍵
type MoodId = 'happy' | 'sad' | 'energetic' | 'relaxed' | 'romantic' | 'focused'

// 定義 MusicLibrary 介面，使用 MoodId 作為鍵
interface MusicLibrary {
  happy: Track[]
  sad: Track[]
  energetic: Track[]
  relaxed: Track[]
  romantic: Track[]
  focused: Track[]
}

// 可用的測試音檔（SoundHelix - 非常穩定的測試用音樂）
const TEST_AUDIO_URLS = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
]

export const useMusicStore = defineStore('music', {
  state: () => ({
    currentMood: 'happy' as MoodId,
    currentTrack: null as Track | null,
    isPlaying: false as boolean,
    currentTime: 0 as number,
    volume: 0.7 as number,
    searchQuery: '' as string,
    moodHistory: [] as MoodId[],
    audioElement: null as HTMLAudioElement | null,
    
    moods: [
      { id: 'happy', name: '快樂', emoji: '😊', color: 'from-yellow-400', bgColor: 'bg-yellow-400/20' },
      { id: 'sad', name: '悲傷', emoji: '😢', color: 'from-blue-400', bgColor: 'bg-blue-400/20' },
      { id: 'energetic', name: '活力', emoji: '⚡', color: 'from-orange-400', bgColor: 'bg-orange-400/20' },
      { id: 'relaxed', name: '放鬆', emoji: '😌', color: 'from-green-400', bgColor: 'bg-green-400/20' },
      { id: 'romantic', name: '浪漫', emoji: '❤️', color: 'from-red-400', bgColor: 'bg-red-400/20' },
      { id: 'focused', name: '專注', emoji: '🎯', color: 'from-purple-400', bgColor: 'bg-purple-400/20' }
    ] as Mood[],
    
    // ✅ 全部改用 SoundHelix 測試音檔
    musicLibrary: {
      happy: [
        { 
          id: 'h1', 
          title: 'Happy Song 1', 
          artist: 'SoundHelix', 
          cover: 'https://picsum.photos/200/200?random=1', 
          url: TEST_AUDIO_URLS[0],
          duration: 354 // SoundHelix Song 1 的長度
        },
        { 
          id: 'h2', 
          title: 'Happy Song 2', 
          artist: 'SoundHelix', 
          cover: 'https://picsum.photos/200/200?random=2', 
          url: TEST_AUDIO_URLS[1],
          duration: 419 // SoundHelix Song 2 的長度
        },
      ],
      sad: [
        { 
          id: 's1', 
          title: 'Melancholy Song 1', 
          artist: 'SoundHelix', 
          cover: 'https://picsum.photos/200/200?random=4', 
          url: TEST_AUDIO_URLS[2],
          duration: 389
        },
        { 
          id: 's2', 
          title: 'Melancholy Song 2', 
          artist: 'SoundHelix', 
          cover: 'https://picsum.photos/200/200?random=5', 
          url: TEST_AUDIO_URLS[3],
          duration: 414
        },
      ],
      energetic: [
        { 
          id: 'e1', 
          title: 'Energetic Rock', 
          artist: 'SoundHelix', 
          cover: 'https://picsum.photos/200/200?random=7', 
          url: TEST_AUDIO_URLS[4],
          duration: 347
        },
        { 
          id: 'e2', 
          title: 'Upbeat Track', 
          artist: 'SoundHelix', 
          cover: 'https://picsum.photos/200/200?random=8', 
          url: TEST_AUDIO_URLS[5],
          duration: 375
        },
      ],
      relaxed: [
        { 
          id: 'r1', 
          title: 'Relaxing Melody', 
          artist: 'SoundHelix', 
          cover: 'https://picsum.photos/200/200?random=10', 
          url: TEST_AUDIO_URLS[6],
          duration: 390
        },
        { 
          id: 'r2', 
          title: 'Calm Piano', 
          artist: 'SoundHelix', 
          cover: 'https://picsum.photos/200/200?random=11', 
          url: TEST_AUDIO_URLS[7],
          duration: 380
        },
      ],
      romantic: [
        { 
          id: 'ro1', 
          title: 'Romantic Ballad', 
          artist: 'SoundHelix', 
          cover: 'https://picsum.photos/200/200?random=13', 
          url: TEST_AUDIO_URLS[2], // 重複使用不同歌曲
          duration: 389
        },
        { 
          id: 'ro2', 
          title: 'Love Theme', 
          artist: 'SoundHelix', 
          cover: 'https://picsum.photos/200/200?random=14', 
          url: TEST_AUDIO_URLS[3],
          duration: 414
        },
      ],
      focused: [
        { 
          id: 'f1', 
          title: 'Deep Focus', 
          artist: 'SoundHelix', 
          cover: 'https://picsum.photos/200/200?random=16', 
          url: TEST_AUDIO_URLS[0], // 重複使用
          duration: 354
        },
        { 
          id: 'f2', 
          title: 'Concentration', 
          artist: 'SoundHelix', 
          cover: 'https://picsum.photos/200/200?random=17', 
          url: TEST_AUDIO_URLS[1],
          duration: 419
        },
      ]
    } as MusicLibrary
  }),
  
  getters: {
    currentMoodData: (state) => {
      return state.moods.find(m => m.id === state.currentMood)
    },
    
    moodPlaylist: (state): Track[] => {
      return state.musicLibrary[state.currentMood] || []
    },
    
    filteredTracks: (state): Track[] => {
      const playlist = state.musicLibrary[state.currentMood]
      if (!playlist) return []
      if (!state.searchQuery) return playlist
      return playlist.filter(track => 
        track.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
    },
    
    progress: (state): number => {
      if (!state.currentTrack) return 0
      return (state.currentTime / state.currentTrack.duration) * 100
    },
    
    formatTime: () => (seconds: number): string => {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
  },
  
  actions: {
    initAudio() {
      if (!this.audioElement) {
        this.audioElement = new Audio()
        this.audioElement.volume = this.volume
        
        this.audioElement.ontimeupdate = () => {
          this.currentTime = this.audioElement?.currentTime || 0
        }
        
        this.audioElement.onended = () => {
          this.playNext()
        }

        // 加入錯誤處理
        this.audioElement.onerror = (e) => {
          console.error('音頻載入錯誤:', e)
          // 如果當前歌曲載入失敗，嘗試下一首
          this.playNext()
        }
      }
    },
    
    setMood(moodId: MoodId) {
      this.currentMood = moodId
      this.moodHistory.push(moodId)
      if (this.moodHistory.length > 10) this.moodHistory.shift()
      
      const playlist = this.musicLibrary[moodId]
      if (playlist && playlist.length > 0) {
        const firstTrack = playlist[0]
        if (firstTrack) {
          this.playTrack(firstTrack)
        }
      }
    },
    
    playTrack(track: Track) {
      this.initAudio()
      
      if (this.currentTrack?.id === track.id) {
        this.togglePlay()
      } else {
        this.currentTrack = track
        this.currentTime = 0
        
        if (this.audioElement) {
          console.log('播放:', track.title, track.url) // 除錯用
          this.audioElement.src = track.url
          this.audioElement.load()
          this.audioElement.play().catch(e => {
            console.error('播放失敗:', e)
          })
          this.isPlaying = true
        }
      }
    },
    
    togglePlay() {
      if (!this.audioElement || !this.currentTrack) return
      
      if (this.isPlaying) {
        this.audioElement.pause()
      } else {
        this.audioElement.play().catch(e => {
          console.error('播放失敗:', e)
        })
      }
      this.isPlaying = !this.isPlaying
    },
    
    playNext() {
      const playlist = this.musicLibrary[this.currentMood]
      if (!playlist || !this.currentTrack) return
      
      const currentIndex = playlist.findIndex(t => t.id === this.currentTrack?.id)
      const nextIndex = (currentIndex + 1) % playlist.length
      const nextTrack = playlist[nextIndex]
      if (nextTrack) {
        this.playTrack(nextTrack)
      }
    },
    
    playPrevious() {
      const playlist = this.musicLibrary[this.currentMood]
      if (!playlist || !this.currentTrack) return
      
      const currentIndex = playlist.findIndex(t => t.id === this.currentTrack?.id)
      const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length
      const prevTrack = playlist[prevIndex]
      if (prevTrack) {
        this.playTrack(prevTrack)
      }
    },
    
    seekTo(percentage: number) {
      if (!this.audioElement || !this.currentTrack) return
      const time = (percentage / 100) * this.currentTrack.duration
      this.audioElement.currentTime = time
      this.currentTime = time
    },
    
    setVolume(value: number) {
      this.volume = Math.max(0, Math.min(1, value))
      if (this.audioElement) {
        this.audioElement.volume = this.volume
      }
    }
  }
})