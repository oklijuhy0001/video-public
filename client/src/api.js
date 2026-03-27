const apiFetch = async (url, options = {}) => {
  const res = await fetch(url, options)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const getVideos = (seed, offset = 0, limit = 10) =>
  apiFetch(`/api/public/videos?seed=${seed}&offset=${offset}&limit=${limit}`)

export const getVideoById = (id) =>
  apiFetch(`/api/public/videos/${id}`)

export const getNames = () =>
  apiFetch('/api/public/names')

export const getNameVideos = (slug, page = 1, limit = 20) =>
  apiFetch(`/api/public/names/${slug}/videos?page=${page}&limit=${limit}`)
