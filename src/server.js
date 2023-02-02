import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import dotenv from 'dotenv'
import 'colors'


// Load .env file.
dotenv.config()

// Clean up console.
console.clear()

// Next.js settings.
const dev = process.env.PROJECT_MODE !== 'production'
const hostname = process.env.WEB_HOST
const port = process.env.WEB_PORT
const app = next({ dev, hostname, port, dir: './src/web' })
const handle = app.getRequestHandler()

// Create Next.js server.
app.prepare().then(async () => {
  const getLoginInfo = (await import('./web/functions/getLoginInfo.js')).default
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      const { url, query } = parsedUrl

      // Fetch user's login info.
      res.login = await getLoginInfo(req)

      if (url === '/login' || url === '/admin') {
        if (res.login?.isAdmin) await app.render(req, res, '/admin', query)
        else await app.render(req, res, '/login', query)
      }

      else await handle(req, res, parsedUrl)
    }
    catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error!')
    }
  })
  
  server.listen(port, err => {
    if (err) throw err
    console.log(`Next.js web server listening on http://${hostname}:${port}`.green)
    
  })

  // Load other modules after next.js is started,
  // this is mainly to allow .env to load correctly.
  import('./bot/main.js').then(module => module.default())
  import('./socket/main.js').then(module => module.default())
})