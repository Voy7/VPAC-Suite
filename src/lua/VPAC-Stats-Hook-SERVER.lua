package.path  = package.path..";.\\LuaSocket\\?.lua" .. ";.\\Scripts\\?.lua"
package.cpath = package.cpath..";.\\LuaSocket\\?.dll"
local socket = require("socket")

local version = "1.0"
local host = "stats.vpac-dcs.com"
local port = 9000

local c = socket.connect(host, port)
c:setoption("tcp-nodelay",true)

local callbacks = {}

-- All in-game events handler.
function callbacks.onGameEvent(event, arg1, arg2, arg3, arg4, arg5, arg6, arg7)
	local time = os.date("%Y-%m-%d %H:%M:%S")
	local mission = DCS.getMissionName()..";"
	if event == "kill" then
		local player = net.get_player_info(arg1)
		local playerUnit = setArg(arg2, "Unknown")
		local playerSide = setArg(arg3, "Unknown")
		local killedID = setArg(arg4, "Unknown")
		local killedUnit = setArg(arg5, "Unknown")
		local killedSide = setArg(arg6, "Unknown")
		local weapon = setArg(arg7, "Unknown")
		socket.try(c:send("KILL;"..mission..player.ucid..";"..player.name..";"..playerUnit..playerSide..killedID..killedUnit..killedSide..weapon..time..";;"))
		
	elseif event == "takeoff" then
		local player = net.get_player_info(arg1)
		local unit = setArg(DCS.getUnitType(player.slot), "Unknown")
		local side = setArg(arg2, "Unknown")
		local airfield = setArg(arg3, "Unknown")
		socket.try(c:send("TAKEOFF;"..mission..player.ucid..";"..player.name..";"..unit..side..airfield..time..";;"))
		
	elseif event == "landing" then
		local player = net.get_player_info(arg1)
		local unit = setArg(DCS.getUnitType(player.slot), "Unknown")
		local side = setArg(arg2, "Unknown")
		local airfield = setArg(arg3, "Unknown")
		socket.try(c:send("LANDING;"..mission..player.ucid..";"..player.name..";"..unit..side..airfield..time..";;"))
		
	elseif event == "eject" then
		local player = net.get_player_info(arg1)
		local unit = setArg(DCS.getUnitType(player.slot), "Unknown")
		socket.try(c:send("EJECT;"..mission..player.ucid..";"..player.name..unit..time..";;"))
		
	elseif event == "crash" then
		local player = net.get_player_info(arg1)
		local unit = setArg(DCS.getUnitType(player.slot), "Unknown")
		socket.try(c:send("CRASH;"..mission..player.ucid..";"..player.name..unit..time..";;"))
		
	elseif event == "pilot_death" then
		local player = net.get_player_info(arg1)
		local unit = setArg(DCS.getUnitType(player.slot), "Unknown")
		socket.try(c:send("DEATH;"..mission..player.ucid..";"..player.name..unit..time..";;"))
		
	elseif event == "mission_end" then
		socket.try(c:send("END;"..mission..time..";;"))
		
	else
		socket.try(c:send("EVENT;"..event..";"..time..";;"))
	end
end

DCS.setUserCallbacks(callbacks)

--
-- Other functions not involving hooks export.
--

-- If arg is blank, then return the default.
function setArg(arg, default)
	if arg.."" == "" then
		return default..";"
	else
		return arg..";"
	end
end