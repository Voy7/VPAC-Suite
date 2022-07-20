// Import node modules & initialize express app.
require("colors")

// Main global variable.
const g = {}

// Require config & package files.
g.config = require("../config.json")
g.package = require("../package.json")

// Clean up console.
console.clear()

// Import & execute modules
require("./bot/main.js") (g)
require("./web/main.js") (g)
require("./socket/main.js") (g)