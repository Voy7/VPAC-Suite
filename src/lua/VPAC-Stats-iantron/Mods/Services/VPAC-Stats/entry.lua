declare_plugin("VPAC-Stats", {
	installed     = true,
	dirName       = current_mod_path,
	version       = "1.0",
	state         = "installed",
	developerName = "Voy",
	developerLink = "",
	info          = _("Custom VPAC Stats Mod."),
	binaries      = {},
	load_immediately = true,
	Skins = {
		{
			name = "* VPAC-Stats *",
			dir  = "Theme"
		},
	},
	Options = {
		{name = "VPAC-Stats", nameId = "VPAC-Stats", dir = "Options"},
	},
})

plugin_done()
