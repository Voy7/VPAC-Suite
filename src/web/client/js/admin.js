$(() => {
    document.querySelectorAll("[data-section]").forEach(button => {
        button.addEventListener("click", event => {
            openSection(button.dataset.section)
        })
    })

    function openSection(name) {
        $(`[data-is-section]`).fadeOut(0)
        $(`#section-${name}`).fadeIn(300)
        $(`[data-section]`).css("color", "var(--text-color-1)")
        $(`[data-section]`).css("border", "none")
        $(`[data-section="${name}"]`).css("color", "white")
        $(`[data-section="${name}"]`).css("border-bottom", "1px inset white")
    }

    openSection("squadrons")

    // Missions section.
    document.querySelectorAll("[data-mission]").forEach(button => {
        button.addEventListener("click", event => {
            openList("mission", button.dataset.mission)
        })
    })

    // Squadrons Section.
    document.querySelectorAll("[data-squadron]").forEach(button => {
        button.addEventListener("click", event => {
            openList("squadron", button.dataset.squadron)
        })
    })

    // Mirror checkride info to preview div.
    let textareas = document.querySelectorAll(".checkride-container textarea")
    function checkrideUpdate(textarea) {
        let text = textarea.value.replaceAll(`>\n`, ">")
        document.querySelector(`#${textarea.id}-preview`).innerHTML = text
    }
    textareas.forEach(textarea => {
        checkrideUpdate(textarea)
        textarea.addEventListener("input", event => {
            checkrideUpdate(textarea)
        })
    })

    // Resources section.
    document.querySelectorAll("[data-resource]").forEach(button => {
        button.addEventListener("click", event => {
            openList("resource", button.dataset.resource)
        })
    })

    document.querySelector("#section-resources .create-new").addEventListener("click", event => {
        openList("resource", "create-new")
    })

    // Briefings section.
    document.querySelectorAll("[data-briefing]").forEach(button => {
        button.addEventListener("click", event => {
            openList("briefing", button.dataset.briefing)
        })
    })

    document.querySelector("#section-briefings .create-new").addEventListener("click", event => {
        openList("briefing", "create-new")
    })
})

function openList(section, name) {
    $(`[data-${section}-sec]`).fadeOut(0)
    $(`[data-${section}-sec="${name}"]`).fadeIn(300)
    $(`[data-${section}]`).removeClass("list-selected")
    $(`[data-${section}="${name}"]`).addClass("list-selected")
}