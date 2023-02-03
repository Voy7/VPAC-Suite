import fs from 'fs'

// Upload image to Next.js public/img/ folder, and return URL.
export default function uploadImage(base64) {
  return new Promise(resolve => {
    const base64Data = base64.replace(/^data:image\/png;base64,/, '');
    const fileName = `${Date.now().toString()}.png`

    fs.writeFile(`src/web/public/img/${fileName}`, base64Data, 'base64', err => {
      if (err) resolve({ url: null, err })
      resolve({ url: `/img/${fileName}`, err: null })
    })
  })
}