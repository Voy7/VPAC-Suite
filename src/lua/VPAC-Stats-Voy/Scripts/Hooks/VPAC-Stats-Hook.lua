package.path  = package.path..";.\\LuaSocket\\?.lua" .. ";.\\Scripts\\?.lua"
package.cpath = package.cpath..";.\\LuaSocket\\?.dll"
local socket = require("socket")

local version = "1.0"
local host = "stats.vpac-dcs.com"
local port = 9000

-- Options from the special menu & often used variables.
local isEnabled = OptionsData.getPlugin("VPAC-Stats","statsEnabled")
local isServer = OptionsData.getPlugin("VPAC-Stats","statsServer")
local key = OptionsData.getPlugin("VPAC-Stats","statsKey")
local ucid = net.get_player_info(net.get_my_player_id()).ucid
local userStatus = "STATUS;"..ucid..";"..key..";"..version..";"

local c = socket.connect(host, port)
c:setoption("tcp-nodelay",true)

if isEnabled == true then
	socket.try(c:send(userStatus.."MENU;;"))

	local callbacks = {}

	-- Called when loads into mission or server.
	function callbacks.onMissionLoadEnd()
		t = os.time()

		local time = os.date("%Y-%m-%d %H:%M:%S")
		socket.try(c:send("LOADED;"..time..";;"))
	end

	-- Called when starting to load into mission or server.
	function callbacks.onMissionLoadBegin()
		socket.try(c:send(userStatus.."LOADING;;"))
	end

	-- Called every 3* seconds while in mission
	function callbacks.onSimulationFrame()
		if type(t) == "number" and os.time() > t + 3 then
			local aircraft = getOwnAircraft()
			socket.try(c:send(userStatus.."MISSION;"..net.get_server_id()..";"..DCS.getMissionName()..";"..getMap()..";"..aircraft..";;"))
			t = os.time()
		end
	end

	-- Called when leaves mission / server.
	function callbacks.onSimulationStop()
		socket.try(c:send(userStatus.."MENU;;"))
		t = "Stop the count!"
	end

	DCS.setUserCallbacks(callbacks)

	--
	-- Other functions not involving hooks export.
	--
	
	-- Get name of current map.
	function getMap()
		local msn = DCS.getCurrentMission()
		return msn.mission.theatre
	end

	-- Get info about your role, aircraft, etc.
	function getOwnAircraft()
		local own = {}
		if Export.LoIsOwnshipExportAllowed() == true then
			own = Export.LoGetSelfData()
		else
			own.Name = "y"
		end

		local id = nil
		local slot = nil
		local side = nil
		local role = nil
		local roleset = false

		if DCS.isMultiplayer() then
			id = net.get_my_player_id()
		end

		if id ~= nil and id ~= 0 then
			side, slot = net.get_slot(id)
			if string.find(slot, "_%d") and string.find(string.sub(slot, 1, 1), "%d") then
				slot = string.sub(slot, 1, string.find(slot, "_%d")-1)
			end
		end

		if slot ~= nil then
			role = DCS.getUnitType(slot)
			if role ~= nil and role ~= "" then
				roleset = true
			end
		end

		if side == 0 and id ~= 0 then
			role = "Spectator"
			roleset = true
		end

		local name = nil
		if own ~= nil and own.Name ~= nil then
			name = own.Name
		elseif roleset == true then
			name = role
		end
			
		return name
	end

	-- If arg is blank, then return the default.
	function setArg(arg, default)
		if arg.."" == "" then
			return default..";"
		else
			return arg..";"
		end
	end
end