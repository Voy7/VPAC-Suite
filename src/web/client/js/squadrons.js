$(() => {
    $(".user").slideUp(0)
    // Expanding squadron members on click.
    let open = []
    let expandables = document.querySelectorAll(".expandable-container")
    expandables.forEach(expandable => {
        expandable.addEventListener("click", event => {
            let id = expandable.dataset.squadron
            let arrowClicked = document.querySelector(`[data-arrow="${id}"]`)
            // Collapse the active members when it's clicked.
            if (open.includes(id)) {
                open = open.filter(item => item !== id)
                arrowClicked.style.transform = "rotate(0deg)"
                $(`[data-group="${id}"]`).slideUp(300)
                $(`[data-preview="${id}"]`).slideDown(300)
            }
            // Open the clicked members.
            else {
                open.push(id)
                arrowClicked.style.transform = "rotate(90deg)"
                $(`[data-group="${id}"]`).slideDown(300)
                $(`[data-preview="${id}"]`).slideUp(300)
            }
        })
    })


    // Open/close checkride info modals.
    let buttons = document.querySelectorAll(".checkride-button")
    buttons.forEach(button => {
        button.addEventListener("click", event => {
            $(`[data-checkride-modal="${button.dataset.checkride}"]`).fadeIn(300)
        })
    })
    let closes = document.querySelectorAll(".checkride-close")
    closes.forEach(button => {
        button.addEventListener("click", event => {
            closeModals(0)
        })
    })
})