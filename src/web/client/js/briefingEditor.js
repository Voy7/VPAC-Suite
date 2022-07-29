$(() => {
    console.log(briefing)

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

    socket.on("miz-upload-failed", () => {
        $("#upload-failed").fadeIn(100)
    })

    document.querySelectorAll(".error-modal button").forEach(button => {
        button.addEventListener("click", closeModals)
    })
})

function uploadMiz(files) {
    socket.emit("upload-miz", { id: briefing.id, file: files[0] })
}

