const db = require("../database")

// Every 5 minutes fetch members, roles, etc from Discord.
async function discordCacheLoop(g) {
    const members = []
    const roles = []

    // Fetch members.
    g.guild.members.cache.forEach(member => {
        members.push({
            id: member.user.id,
            name: member.user.username,
            nickname: member.nickname,
            avatar: member.user.avatarURL(),
            roles: member._roles
        })
    })

    // Fetch roles.
    g.guild.roles.cache.forEach(role => {
        if (role.icon != null) role.icon = `https://cdn.discordapp.com/emojis/${role.icon}`

        roles.push({
            id: role.id,
            name: role.name,
            color: role.color,
            icon: role.icon
        })
    })

    // Gallery
    let galleryImages = []
    const galleryChannel = g.guild.channels.cache.find(f => f.id == g.config.bot.galleryChannel)
    if (galleryChannel) {
        const messages = await galleryChannel.messages.fetch({ limit: 100 })
        messages.forEach(message => {
            if (message.attachments.size <= 0) return
            message.attachments.forEach(img => {
                galleryImages.push(img.url)
            })
            message.react("✅")
        })
    }
    
    // Update database with new info.
    db.set("guild", { members, roles,  galleryImages })
    
    // Loop this function every 5 minutes.
    setTimeout(() => { discordCacheLoop(g) }, 300000)
}

// Export module.
module.exports = discordCacheLoop