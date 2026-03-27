import { ref } from 'vue'
import { getVideos } from '../api.js'

const newSeed = () => (Date.now() / 1000) % 2 - 1

export const useVideoFeed = () => {
  const videos  = ref([])
  const loading = ref(false)
  const seed    = ref(newSeed())
  const offset  = ref(0)
  const total   = ref(Infinity)

  const fetchMore = async () => {
    if (loading.value) return
    loading.value = true

    // Infinite loop: reset when all videos seen
    if (offset.value >= total.value && total.value !== Infinity) {
      seed.value   = newSeed()
      offset.value = 0
    }

    try {
      const res = await getVideos(seed.value, offset.value, 10)
      total.value   = res.total
      offset.value += res.videos.length
      videos.value.push(...res.videos)
    } catch (e) {
      console.error('fetchMore error:', e)
    } finally {
      loading.value = false
    }
  }

  return { videos, loading, fetchMore }
}
