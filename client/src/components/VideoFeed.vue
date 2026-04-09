<template>
  <div class="feed-wrapper">
  <!-- Site name top left -->
  <div class="site-name">🎬 VideoSite</div>

  <div class="feed" ref="feedEl">
    <VideoItem
      v-for="(video, i) in videos"
      :key="`${video.id}-${i}`"
      :video="video"
      :active="i === activeIndex"
      :preload="i === activeIndex + 1"
      :ref="(el) => setItemRef(el, i)"
    />
    <div v-if="loading" class="loading-spinner">⏳</div>
    <div v-if="videos.length === 0 && !loading" class="empty">Không có video nào.</div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import VideoItem from './VideoItem.vue'
import { useVideoFeed } from '../composables/useVideoFeed.js'

const { videos, loading, fetchMore } = useVideoFeed()
const feedEl      = ref(null)
const activeIndex = ref(0)
const itemRefs    = []

const setItemRef = (el, i) => { if (el) itemRefs[i] = el }

let observer = null

const setupObserver = () => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.dataset.index || '0')
          activeIndex.value = idx

          // Fetch more when near end
          if (idx >= videos.value.length - 2) fetchMore()
        }
      }
    },
    { threshold: 0.6 }
  )
}

const observeItems = () => {
  if (!observer || !feedEl.value) return
  const items = feedEl.value.querySelectorAll('.video-item')
  items.forEach((el, i) => {
    el.dataset.index = i
    observer.observe(el)
  })
}

// Re-observe when videos list grows
let prevLen = 0
const checkNewItems = () => {
  if (videos.value.length > prevLen) {
    prevLen = videos.value.length
    setTimeout(observeItems, 100)
  }
}

// Handle URL path /v/:slug
const handleUrlRoute = async () => {
  const path = location.pathname
  if (path.startsWith('/v/')) {
    const parts = path.split('/')
    const slug = parts[parts.length - 1]
    const id = parseInt(slug.split('-')[0])
    
    if (!isNaN(id)) {
      // Max 5 fetches to avoid infinite loop
      let fetches = 0
      while (!videos.value.find(v => v.id === id) && offset.value < total.value && fetches < 5) {
        await fetchMore()
        fetches++
      }
      
      const idx = videos.value.findIndex(v => v.id === id)
      if (idx !== -1) {
        activeIndex.value = idx
        // Scroll to this video
        const items = feedEl.value?.querySelectorAll('.video-item')
        if (items && items[idx]) {
          items[idx].scrollIntoView({ behavior: 'auto' })
        }
      }
    }
  }
}

let watchTimer = null
onMounted(async () => {
  setupObserver()
  await fetchMore()
  await handleUrlRoute()
  observeItems()
  watchTimer = setInterval(checkNewItems, 500)
})

onUnmounted(() => {
  observer?.disconnect()
  clearInterval(watchTimer)
})
</script>

<style scoped>
.feed-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
}
.site-name {
  position: fixed;
  top: 14px;
  left: 16px;
  z-index: 100;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-shadow: 0 1px 6px rgba(0,0,0,0.6);
  pointer-events: none;
  user-select: none;
}
.feed {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
.loading-spinner {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28px;
  scroll-snap-align: start;
}
.empty {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
}
</style>
