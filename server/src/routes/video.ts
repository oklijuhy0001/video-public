import { Hono } from 'hono'

const videoPage = new Hono()

// Catch all /v/* and redirect to home
videoPage.get('/*', async (c) => {
  return c.redirect('/')
})

export default videoPage
