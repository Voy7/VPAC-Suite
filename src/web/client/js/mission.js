$(() => {
    // Expanding entries on click.
    let infoEntry = null
    let killEntries = document.querySelectorAll(".kill-entry")
    killEntries.forEach(entry => {
        entry.addEventListener("click", event => {
            if (!entry.dataset.entryId) return
            let id = entry.dataset.entryId
            let arrowClicked = document.querySelector(`[data-arrow-id="${id}"]`)
            // Collapse other open entries.
            if (infoEntry != null) {
                let arrow = document.querySelector(`[data-arrow-id="${infoEntry}"]`)
                arrow.style.transform = "rotate(0deg)"
                $(`[data-info-id="${infoEntry}"]`).slideUp(300)
            }
            // Collapse the active entry when it's clicked.
            if (infoEntry == id) {
                infoEntry = null
                arrowClicked.style.transform = "rotate(0deg)"
                $(`[data-info-id="${infoEntry}"]`).slideUp(300)
            }
            // Open the clicked entry.
            else {
                infoEntry = id
                arrowClicked.style.transform = "rotate(90deg)"
                $(`[data-info-id="${id}"]`).slideDown(300)
            }
        })
    })

    // Toggle all events slider.
    $("#toggle-events").change(() => {
        let option = document.querySelector("#toggle-events").checked
        if (option) {
            $(".simple-entry").fadeIn(200)
            $(".no-kills").fadeOut(0)
        }
        else {
            $(".simple-entry").fadeOut(200)
            setTimeout(() => {
                $(".no-kills").fadeIn(100)
            }, 250)
        }
    })

    // On page load, if slider is off, hide the events.
    if (document.querySelector("#toggle-events").checked == false) {
        $(".simple-entry").fadeOut(0)
    }
    else {
        $(".no-kills").fadeOut(0)
    }
})