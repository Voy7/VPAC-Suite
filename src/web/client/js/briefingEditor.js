$(() => {
    setInterval(() => {
        let name = document.querySelector("#briefing-name")
        if (briefing.name == name.value) return
        briefing.name = name.value
        socket.emit("briefing-update", briefing)
    }, 1000)

    socket.on("briefing-data", data => {
        console.log("data!")
        // Update briefing loop here
    })
})