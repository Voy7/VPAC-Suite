const db = require("../database")

// Every 12 hours change the banner image.
function bannerLoop(g) {
    setTimeout(async () => {
        const guild = await db.get("guild")
        if (!guild.galleryImages?.length > 0) {
            // Try again in 1 minute.
            setTimeout(() => { bannerLoop(g) }, 60000)
        }
        else {
            const image = guild.galleryImages[Math.floor(Math.random() * guild.galleryImages.length)]
            g.guild.setBanner(image)

            // Loop this function every 12 hours.
            setTimeout(() => { bannerLoop(g) }, 43200000) // 12 hours
        }
    }, 2000) // Seems to fix some fetching issues.
}

// Export module.
module.exports = bannerLoop