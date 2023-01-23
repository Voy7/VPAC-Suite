import getGuild from '../web/functions/getGuild.js'

// Every 12 hours change the banner image.
export default function bannerLoop(guild) {
  setTimeout(async () => {
    const data = await getGuild()
    if (!data.galleryImages?.length > 0) {
      // Try again in 1 minute.
      setTimeout(() => { bannerLoop(guild) }, 60000)
    }
    else {
      const image = data.galleryImages[Math.floor(Math.random() * data.galleryImages.length)]
      guild.setBanner(image)

      // Loop this function every 12 hours.
      setTimeout(() => { bannerLoop(guild) }, 43200000) // 12 hours
    }
  }, 2000) // Seems to fix some fetching issues.
}