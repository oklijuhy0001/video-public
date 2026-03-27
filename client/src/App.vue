<template>
  <VideoFeed />
</template>

<script setup>
import { onMounted } from 'vue'
import VideoFeed from './components/VideoFeed.vue'

// Keep-alive: ping every 14 minutes so Render free tier doesn't sleep
onMounted(() => {
  setInterval(() => fetch('/health').catch(() => {}), 14 * 60 * 1000)
})
</script>
