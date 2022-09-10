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

    // Decide which section to open based on link.
    const url = new URL(location.href)
    const params = new URLSearchParams(url.search)
    if (params.get("s")) openSection(params.get("s"))
    else openSection("squadrons") // Default
    if (params.get("i")) openList(params.get("s"), params.get("i"))

    // Missions section.
    document.querySelectorAll("[data-missions]").forEach(button => {
        button.addEventListener("click", event => {
            openList("missions", button.dataset.missions)
        })
    })

    // Squadrons Section.
    document.querySelectorAll("[data-squadrons]").forEach(button => {
        button.addEventListener("click", event => {
            openList("squadrons", button.dataset.squadrons)
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
    document.querySelectorAll("[data-resources]").forEach(button => {
        button.addEventListener("click", event => {
            openList("resources", button.dataset.resources)
        })
    })

    document.querySelector("#section-resources .create-new").addEventListener("click", event => {
        openList("resources", "create-new")
    })

    // Briefings section.
    document.querySelectorAll("[data-briefings]").forEach(button => {
        button.addEventListener("click", event => {
            openList("briefings", button.dataset.briefings)
        })
    })

    document.querySelector("#section-briefings .create-new").addEventListener("click", event => {
        openList("briefings", "create-new")
    })

    // DCS Modules section.
    document.querySelectorAll("[data-developers]").forEach(button => {
        button.addEventListener("click", event => {
            openList("developers", button.dataset.developers)
        })
    })

    document.querySelector("#section-developers .create-new").addEventListener("click", event => {
        openList("developers", "create-new")
    })
})

function openList(section, name) {
    $(`[data-${section}-sec]`).fadeOut(0)
    $(`[data-${section}-sec="${name}"]`).fadeIn(300)
    $(`[data-${section}]`).removeClass("list-selected")
    $(`[data-${section}="${name}"]`).addClass("list-selected")
}