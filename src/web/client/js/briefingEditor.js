let dragLast = null

const displayName = {
    map: "Map, #00ff37",
    header: "Header, #003180",
    text: "Text Block, #0062ff",
    waypointChart: "Waypoint Chart, #f6ff00",
    radioChart: "Radio Chart, #ff6a00",
    weatherChart: "Weather Chart, #fff",
    image: "Image, #d400ff",
    rawHtml: "Raw HTML, #ff0000"
}

$(() => {
    updateEditor()
    selectElement(1)

    // Static header briefing options.
    const name = document.querySelector("#briefing-name")
    name.addEventListener("input", () => {
        briefing.name = parseIn(name.value.replaceAll(" ", "_"))
        updateEditor()
    })

    const public = document.querySelector("#briefing-public")
    public.addEventListener("input", () => {
        briefing.public = public.checked
        updateEditor()
    })

    // New miz file JSON data.
    socket.on("miz-data", ({ data }) => {
        miz = data
        updateEditor()
    })

    socket.on("miz-upload-failed", () => {
        $("#upload-failed").fadeIn(100)
    })

    document.querySelectorAll(".error-modal button").forEach(button => {
        button.addEventListener("click", closeModals)
    })

    // New element button & modal list select.
    document.querySelector("#new-element-button").addEventListener("click", event => {
        $("#new-element-overlay").fadeIn(100)
    })
    const newElements = document.querySelectorAll("#new-element-modal .element")
    newElements.forEach(element => {
        element.addEventListener("click", event => {
            newElement(element.dataset.newElement)
            closeModals()
        })
    })
})

// Upload miz file via socket.
function uploadMiz(files) {
    socket.emit("upload-miz", { id: briefing.id, file: files[0] })
}

// Creating new briefing element.
function newElement(type) {
    const order = briefing.elements.length + 1
    const args = {}

    // --------------------------------
    // Elements types & their defaults.
    // --------------------------------
    if (type == "map") { // Mission map
        args.a = 1
    }
    else if (type == "header") { // Headers
        args.text = "New Header Name"
    }
    else if (type == "text")  { // Text block
        args.text = "New text block"
    }
    else if (type == "waypointChart") { // Waypoint chart
        args.groupName = null
        args.chartName = "Waypoints - All Flights"
        args.labels = "1 | Airport | Takeoff & land.\n2 | Bullseye | -"
    }
    else if (type == "radioChart") { // Radio chart
        args.unitName = null
        args.chartName = "Radio Channels & Presets"
        args.labels = "245 | Mission Common\n264 | CTAF"
    }
    else if (type == "weatherChart") { // Weather Chart
        args.wind = "090&deg; 10 kts"
        args.clouds = "Scattered at 9,000"
        args.qnh = "760 / 29.92"
        args.temp = "75&deg; F"
    }
    else if (type == "rawHtml") { // Raw HTML
        args.html = `<div>Raw HTML</div>`
    }

    briefing.elements.push({ type, order, args })
    updateEditor()
    selectElement(order)
}

// Select which element to see options.
function selectElement(order) {
    document.querySelectorAll("#elements .element").forEach(element => {
        element.classList.remove("selected")
    })
    const section = document.querySelector(`[data-element-order="${order}"]`)
    if (section) section.classList.add("selected")

    document.querySelector("#options").innerHTML = ""
    const element = briefing.elements.find(e => e.order == order)
    if (!element) return

    // --------------------------------------------
    // Options for all different types of elements.
    // --------------------------------------------
    if (element.type == "header") { // Header
        addOption(element, "text", "Header Text", "text")
        addOption(element, "delete")
    }
    else if (element.type == "text") { // Text block
        addOption(element, "text", "Text Block", "textarea")
        addOption(element, "centered", "Centered", "checkbox")
        addOption(element, "delete")
    }
    else if (element.type == "waypointChart") { // Waypoint chart
        let groups = []
        miz.groups["blue"].forEach(group => {
            if (group.type != "aircraft") return
            groups.push({ value: group.name, label: `${group.name} (${group.units[0].short})` })
        })
        addOption(element, "chartName", "Chart Name", "text")
        addOption(element, "groupName", "Group", "dropdown", groups)
        addOption(element, "labels", "Waypoint Labels", "textarea")
        addOption(element, "delete")
    }
    else if (element.type == "radioChart") { // Radio chart
        let units = [{ value: `None`, label: `No unit selected` }]
        miz.groups["blue"].forEach(group => {
            if (group.type != "aircraft") return
            group.units.forEach(unit => {
                units.push({ value: unit.name, label: `${unit.name} (${unit.short})` })
            })
        })
        addOption(element, "chartName", "Chart Name", "text")
        addOption(element, "unitName", "Unit", "dropdown", units)
        addOption(element, "labels", "Freq Labels", "textarea")
        addOption(element, "delete")
    }
    else if (element.type == "weatherChart") { // Weather chart
        addOption(element, "wind", "Wind", "text")
        addOption(element, "clouds", "Clouds", "text")
        addOption(element, "qnh", "QNH", "text")
        addOption(element, "temp", "Tempature", "text")
        addOption(element, "delete")
    }
    else if (element.type == "image") { // Image
        addOption(element, "delete")
    }
    else if (element.type == "rawHtml") { // RAW HTML
        addOption(element, "html", "Raw HTML", "textarea")
        addOption(element, "delete")
    }
}

// Add option to current selected editor.
function addOption(element, arg, label, input, extra) {
    let optionsHTML = ''
    if (arg == "delete") { // Delete button
        optionsHTML = `
            <button id="options-${arg}" data-editor="${element.order}" class="delete-element">Delete Element</textarea>`
    }
    else if (input == "text") { // Small text input
        optionsHTML = `
            <label for="options-${arg}">${label}</label>
            <input type="text" id="options-${arg}" data-editor="${element.order}" value="${parseOut(element.args[arg])}">`
    }
    else if (input == "textarea") { // Big text block
        optionsHTML = `
            <label for="options-${arg}">${label}</label>
            <textarea id="options-${arg}" data-editor="${element.order}">${parseOut(element.args[arg])}</textarea>`
    }
    else if (input == "checkbox") { // Checkbox toggle
        let checked = ''
        if (element.args[arg]) checked = ` checked`
        optionsHTML = `
            <input type="checkbox" id="options-${arg}" data-editor="${element.order}" value="${element.args[arg]}"${checked}>
            <label for="options-${arg}">${label}</label>`
    }
    else if (input == "dropdown") { // Select dropdown
        let valuesHTML = ''
        extra.forEach(value => {
            if (value.value == element.args[arg]) valuesHTML += `<option value="${value.value}" selected>${value.label}</option>`
            else valuesHTML += `<option value="${value.value}">${value.label}</option>`
        })
        optionsHTML = `
            <label for="options-${arg}">${label}</label>
            <select id="options-${arg}" data-editor="${element.order}">
                ${valuesHTML}
            </select>`
    }

    // Adding option to HTML & stuff.
    const container = document.querySelector("#options")
    const template = document.createElement("div")
    template.innerHTML = optionsHTML
    container.append(template)
    const option = document.querySelector(`#options-${arg}`)
    const briefElement = briefing.elements.find(e => e.order == element.order)

    // All event listeners for different input types.
    if (arg == "delete") { // Delete button
        option.addEventListener("click", () => {
            briefing.elements.splice(element.order - 1, 1)
            for(let i = 1; i <= briefing.elements.length; i++) {
                briefing.elements[i - 1].order = i
            }
            updateEditor()
            selectElement(1)
        })
    }
    else if (input == "text") { // Input texts
        option.addEventListener("input", event => {
            briefElement.args[option.id.split("-")[1]] = parseIn(option.value)
            updateEditor()
        })
    }
    else if (input == "textarea") { // Textareas
        option.addEventListener("input", event => {
            briefElement.args[option.id.split("-")[1]] = parseIn(option.value)
            updateEditor()
        })
    }
    else if (input == "checkbox") { // Checkbox toggle
        option.addEventListener("input", event => {
            briefElement.args[option.id.split("-")[1]] = option.checked
            updateEditor()
        })
    }
    else if (input == "dropdown") { // Dropdown select
        option.addEventListener("input", event => {
            briefElement.args[option.id.split("-")[1]] = option.value
            updateEditor()
        })
    }
}

// Update editor section & all it's components.
function updateEditor() {
    updateBriefing(briefing)
    // console.log(briefing)

    // Add map element as first one.
    if (briefing.elements.length <= 0) newElement("map")

    socket.emit("briefing-update", briefing)

    document.querySelector("#elements").innerHTML = ``
    let elementsHTML = ``
    for(let i = 1; i <= briefing.elements.length; i++) {
        briefing.elements.forEach(element => {
            if (element.order != i) return
            elementsHTML += `
                <div class="element" data-element-order="${element.order}" draggable="true">
                    <div class="element-icon" style="background-color: ${displayName[element.type].split(", ")[1]};"></div>
                    <div class="element-label">${displayName[element.type].split(", ")[0]}</div>
                </div>`
            document.querySelector("#elements").innerHTML = elementsHTML
            document.querySelectorAll("#elements .element").forEach(element => {
                element.addEventListener("click", event => {
                    selectElement(element.dataset.elementOrder)
                })

                // Add & remove dragging styles.
                element.addEventListener("dragstart", () => {
                    element.classList.add("dragging")
                })
                element.addEventListener("dragend", () => {
                    element.classList.remove("dragging")
                        
                    // Change the order of elements JSON and re-render.
                    const newOrder = []
                    const current = element.dataset.elementOrder
                    for(let i = 1; i <= briefing.elements.length; i++) {
                        if (i != current) {
                            const item = briefing.elements.find(e => e.order == i)
                            newOrder.push(item)
                        }
                    }
                    for(let i = 1; i <= briefing.elements.length + 1; i++) {
                        if (i == dragLast) {
                            const item = briefing.elements.find(e => e.order == current)
                            newOrder.splice(dragLast - 1, 0, item)
                        }
                    }
                    for(let i = 1; i <= briefing.elements.length; i++) {
                        newOrder[i - 1].order = i
                    }
                    briefing.elements = newOrder
                    updateEditor()
                })
            })
        })
    }
    
    // Add & remove dragging blue lines, & get cursor order position.
    const container = document.querySelector("#elements")
    container.addEventListener("dragover", event => {
        event.preventDefault()
        const afterElement = getDragAfterElement(container, event.clientY)
        const elements = document.querySelectorAll("#elements .element")
        elements.forEach(element => {
            element.classList.remove("drag-above")
            element.classList.remove("drag-below")
        })
        if (afterElement) {
            afterElement.classList.add("drag-above")
            dragLast = afterElement.dataset.elementOrder
        }
        else {
            const lastElement = document.querySelector(`[data-element-order="${briefing.elements.length}"]`)
            lastElement.classList.add("drag-below")
            dragLast = briefing.elements.length + 1
        }
    })
}

// Get element at cursor position for dragging.
function getDragAfterElement(container, y) {
    const draggables = [...document.querySelectorAll(".element:not(.dragging)")]
    return draggables.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > closest.offset) {
            return { offset, element: child }
        }
        else return closest
    }, { offset: Number.NEGATIVE_INFINITY }).element
}

// Parsing before going into database functions.
function parseIn(text) {
    return text.replaceAll(`'`, `@1;`)
}

function parseOut(text) {
    return text.replaceAll(`@1;`, `'`)
}