const fs = require("fs-extra")
const zip = require("zip-lib")
const db = require("../../database")

// Generate custom mods key and database entry.
async function commandStats(g, message) {
    message.react("✅")

    let user = await db.getUser(message.author.id)
    let key = "Unknown"
    let name = message.author.username.replace(/[/\\?%*:|"<>]/g, '-')

    // Set key to user's key, else create new user.
    if (user && user.key != undefined) key = user.key
    else {
        key = createKey()
        db.setUser(message.author.id, "None", key, [])
    }

    // Create copy of mod with custom key in it and zip it.
    let p = new Promise((resolve, reject) => {
        fs.copy(`./src/lua/VPAC-Stats/`, `./src/lua/VPAC-Stats-${name}/`, err => {
            fs.readFile(`./src/lua/VPAC-Stats-${name}/Mods/Services/VPAC-Stats/Options/optionsDb.lua`, (err, data) => {
                let newData = data.toString().replace("YOUR_KEY", key)
                fs.writeFile(`./src/lua/VPAC-Stats-${name}/Mods/Services/VPAC-Stats/Options/optionsDb.lua`, newData, err => {
                    zip.archiveFolder(`./src/lua/VPAC-Stats-${name}/`, `./src/lua/VPAC-Stats-${name}.zip`).then(() => {
                        resolve()
                    }, err => console.log(err))
                })
            })
        })
    }).then(p => {
        let fileStream = fs.createReadStream(`./src/lua/VPAC-Stats-${name}.zip`)

        // Send them message with all the info.
        message.author.send({
            embeds: [{
                title: "VPAC Stats Mod",
                description: "Download the mod above and place the `Mods` and `Scripts` folders into your DCS saved games folder. Once you've done this, all your VPAC stats will be associated with your account [on our website](https://vpac-dcs.com).",
                thumbnail: { url: "https://cdn.discordapp.com/attachments/692211326503616594/966893877988581396/logo.png" },
                color: "00b3ad",
                // fields: [{
                //     name: "Your Secret Key:",
                //     value: "`" + key + "`"
                // }]
            }],
            files: [{
                attachment: fileStream,
                name: "VPAC-Stats-Mod.zip"
            }]})
        })
}

// Generate a secret key.
function createKey() {
    return `${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`
}

// Export module.
module.exports = commandStats