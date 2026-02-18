<template>
    <div class="min-h-screen p-4 md:p-8" style="background: #0D1B2A;">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <NuxtLink to="/" class="text-white/60 hover:text-white transition-colors">
            ← 返回播放器
          </NuxtLink>
          <h1 class="text-3xl font-bold text-white">心情日記</h1>
          <div class="w-16"></div> 
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-1">
            <CalendarView />
          </div>
  
          <div class="md:col-span-2">
            <DiaryList />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import CalendarView from '~/components/diary/CalendarView.vue'
  import DiaryList from '~/components/diary/DiaryList.vue'
  </script>