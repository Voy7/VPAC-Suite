const socket = io.connect()

let loginModalOpen = false

$(() => {
    // Open/close login modal.
    $("#login-button").attr("href", `/login?r=${window.location.pathname}`)
    $("#logout-button").attr("href", `/logout?r=${window.location.pathname}`)
    let userLogin = document.querySelector("#header-login-user")
    if (userLogin) userLogin.addEventListener("click", event => {
        if (loginModalOpen) {
            $("#header-login-modal").fadeOut(0)
            loginModalOpen = false
        } else {
            $("#header-login-modal").fadeIn(0)
            loginModalOpen = true
        }
    })
})

// Close all modals function.
function closeModals() {
    $(".modal").fadeOut(100)
    loginModalOpen = false
}

// Close modals if clicked outside.
$(document).click(event => {
    if ($(event.target).is(".modal")) {
        closeModals()
    }
})

// Close modals is ESCAPE is pressed.
document.addEventListener("keydown", event => {
    if (event.key == "Escape") closeModals()
})

// Background loading image until page loads.
$(window).on("load", function() {
    $("#loading-container").fadeOut(100)
})