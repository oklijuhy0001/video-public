<template>
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

let watchTimer = null
onMounted(async () => {
  setupObserver()
  await fetchMore()
  observeItems()
  watchTimer = setInterval(checkNewItems, 500)
})

onUnmounted(() => {
  observer?.disconnect()
  clearInterval(watchTimer)
})
</script>

<style scoped>
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
