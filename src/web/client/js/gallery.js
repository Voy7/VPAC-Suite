$(() => {
    const images = document.querySelectorAll("#main-gallery-container img")
    images.forEach(image => {
        image.addEventListener("click", () => {
            $(`[data-image="${image.src}"]`).fadeIn(150)
            const modal = document.querySelector(`[data-image="${image.src}"]`)
            modal.style.display = "flex"

        })
    })
})