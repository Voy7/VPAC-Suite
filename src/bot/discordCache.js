const db = require("../database")

// Every 5 minutes fetch members, roles, etc from Discord.
function discordCacheLoop(g) {
    const members = []
    const roles = []

    // Fetch members.
    g.guild.members.cache.forEach(member => {
        members.push({
            id: member.user.id,
            name: member.user.username.replace(/'/g, ""),
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
    
    // Update database with new info.
    db.set("guild", { members, roles })
    
    // Loop this function every 5 minutes.
    setTimeout(() => { discordCacheLoop(g) }, 300000)
}

// Export module.
module.exports = discordCacheLoop