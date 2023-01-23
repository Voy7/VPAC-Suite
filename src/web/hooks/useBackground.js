// Set the main background image with fancy transition.
export default function useBackground(src, darkness) {
  try { // Client-side only.
    const background = window.document.querySelector('#bg')
    background.style.opacity = '0'
  
    const image = new Image()
    image.src = src
  
    let timed = false
    let ready = false
  
    image.addEventListener('load', () => {
      ready = true
      if (!timed) return
      background.style.backgroundImage = `url(${src})`
      background.style.backgroundColor = `rgba(0, 0, 0, ${darkness})`
      background.style.opacity = '1'
    })
  
    setTimeout(() => {
      timed = true
      if (!ready)return
      background.style.backgroundImage = `url(${src})`
      background.style.backgroundColor = `rgba(0, 0, 0, ${darkness})`
      background.style.opacity = '1'
    }, 500) // Min time it takes to transition.
  } catch {}
}