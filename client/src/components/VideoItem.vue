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
      <div class="info">
        <a :href="`/v/${video.id}-${video.slug}`" class="video-title">{{ video.name }}</a>
        <NamePageLink :name="video.name" :slug="video.slug" />
      </div>
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
  display: block;
}
.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px 16px 32px;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
}
.info { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
.video-title {
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
  line-height: 1.3;
}
.video-title:hover { text-decoration: underline; }
</style>
