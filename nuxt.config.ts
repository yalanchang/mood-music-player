export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  devtools: { enabled: true },
  ssr: false, 
  
  srcDir: 'app/', 
  nitro: {
      serverDir: 'server'  
    }as any,
  app: {
    head: {
      title: '心情播放器',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})