<template>
  <div class="video-item">
    <video
      ref="videoEl"
      :src="video.cf_url"
      loop
      playsinline
      muted
      :preload="preload ? 'auto' : 'metadata'"
      class="video-el"
    />
    <div class="overlay">
      <!-- Bottom right: share button -->
      <button class="share-btn" @click="share" :title="copied ? 'Đã copy!' : 'Chia sẻ'">
        <span v-if="copied" class="share-icon">✅</span>
        <span v-else class="share-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2.2"
            stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import NamePageLink from './NamePageLink.vue'

const props = defineProps({
  video:   { type: Object, required: true },
  active:  { type: Boolean, default: false },
  preload: { type: Boolean, default: false },
})

const videoEl = ref(null)
const copied  = ref(false)

watch(() => props.active, (isActive) => {
  const el = videoEl.value
  if (!el) return
  if (isActive) {
    el.muted = false
    el.play().catch(() => { el.muted = true; el.play().catch(() => {}) })
  } else {
    el.pause()
    el.muted = true
  }
}, { immediate: true })

onUnmounted(() => {
  if (videoEl.value) videoEl.value.pause()
})

const share = async () => {
  const url = `${location.origin}/v/${props.video.id}-${props.video.slug}`
  try {
    if (navigator.share) {
      await navigator.share({ title: props.video.name, url })
    } else {
      await navigator.clipboard.writeText(url)
      copied.value = true
      setTimeout(() => { copied.value = false }, 2000)
    }
  } catch {
    // user cancelled — do nothing
  }
}
</script>

<style scoped>
.video-item {
  position: relative;
  height: 100vh;
  width: 100%;
  scroll-snap-align: start;
  background: #000;
  flex-shrink: 0;
}
.video-el {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
  max-width: 100vw;
  max-height: 100vh;
}
.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 16px 36px;
  background: linear-gradient(transparent, rgba(0,0,0,0.3));
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
}
.info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  flex: 1;
  min-width: 0;
}
.video-title {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.video-title:hover { text-decoration: underline; }

/* Share button — bottom right */
.share-btn {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background .2s, transform .15s;
  padding: 0;
}
.share-btn:hover  { background: rgba(255,255,255,0.28); }
.share-btn:active { transform: scale(0.92); }
.share-icon { display: flex; align-items: center; justify-content: center; line-height: 1; }
</style>
