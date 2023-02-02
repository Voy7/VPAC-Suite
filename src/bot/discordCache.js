import setGuild from '../web/functions/setGuild.js'

// Every 5 minutes fetch members, roles, etc from Discord.
export default async function discordCacheLoop(guild) {
  const members = []
  const roles = []
  const galleryImages = []

  // Fetch members.
  guild.members.cache.forEach(member => {
    members.push({
      id: member.user.id,
      name: member.user.username,
      nickname: member.nickname ? member.nickname : member.user.name,
      avatar: member.user.avatarURL() ? member.user.avatarURL() : '/discord.png',
      roles: member._roles
    })
  })

  // Fetch roles.
  guild.roles.cache.forEach(role => {
    roles.push({
      id: role.id,
      name: role.name,
      color: role.color,
      icon: role.iconURL() ? role.iconURL() : '/logo.png'
    })
  })

  // Fetch image links from Gallery channel.
  const galleryChannel = await guild.channels.fetch(process.env.BOT_GALLERY_CHANNEL)
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
  setGuild({ members, roles,  galleryImages })
  
  // Loop this function every 5 minutes.
  setTimeout(() => { discordCacheLoop(guild) }, 300000)
}