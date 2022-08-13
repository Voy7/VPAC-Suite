const unitList = [
    // Helicopters
    ["AH-64D", "AH-64D", "AH-64D Apache", "H"],
    ["AH-1W", "AH-1W", "AH-1W Viper", "H"],
    ["CH-47D", "CH-47D", "CH-47D Chinook", "H"],
    ["CH-57E", "CH-57E", "CH-53E Stallion", "H"],
    ["Ka-27", "Ka-27", "Ka-27 Helix", "H"],
    ["Ka-50", "Ka-50", "Ka-50 Blackshark", "H"],
    ["Mi-8", "Mi-8MTV", "Mi-8MTV Hip", "H"],
    ["Mi-24", "Mi-24P", "Mi-24P Hind", "H"],
    ["Mi-26", "Mi-26", "Mi-26 Halo", "H"],
    ["Mi-28", "Mi-28N", "Mi-28N Havoc", "H"],
    ["SA342L", "SA342L", "SA342L Gazelle", "H"],
    ["SA342M", "SA342M", "SA342M Gazelle", "H"],
    ["SH-60B", "SH-60B", "SH-60B Seahawk", "H"],
    ["UH-1H", "UH-1H", "UH-1H Huey", "H"],
    ["UH-60A", "UH-60A", "UH-60A Black Hawk", "H"],
    ["UH-60L", "UH-60L", "UH-60L Black Hawk", "H"],

    // Airplanes
    ["A-10A", "A-10A", "A-10A Warthog", "A", "A10-red"],
    ["A-10C", "A-10C", "A-10C Warthog", "A", "A10-red"],
    ["AV8", "AV-8B", "AV-8B Harrier", "A", "AV8B-red"],
    ["C-5", "C-5A", "C-5A Galaxy", "A", "KC130-red"],
    ["C-17", "C-17A", "C-17A Globemaster", "A", "KC130-red"],
    ["C-130", "C-130", "C-130 Hercules", "A", "KC130-red"],
    ["E-3A", "E-3A", "E-3A Sentry", "A", "E3A-red"],
    ["E-2C", "E-2C", "E-2C Hawkeye", "A", "E3A-red"],
    ["E-2D", "E-2D", "E-2D Hawkeye", "A", "E3A-red"],
    ["Hercules", "AC-130", "AC-130 Hercules", "A", "KC130-red"],
    ["F-4E", "F-4E", "F-4E Phantom II", "A", "F4-red"],
    ["F-5E", "F-5E", "F-5E Tiger II", "A", "F5-red"],
    ["F-14A", "F-14A", "F-14A Tomcat", "A", "F14-red"],
    ["F-14B", "F-14B", "F-14B Tomcat", "A", "F14-red"],
    ["F-15C", "F-15C", "F-15C Eagle", "A", "F15-red"],
    ["F-15E", "F-15E", "F-15E Mudhen", "A", "F15-red"],
    ["F-16C", "F-16C", "F-16C Viper", "A", "F15-red"],
    ["FA-18C", "F/A-18C", "F/A-18C Hornet", "A", "FA18-red"],
    ["F-117", "F-117A", "F-117A Nighthawk", "A"],
    ["KC130", "KC-130", "KC-130 Tanker", "A", "KC130-red"],
    ["KC135MPRS", "KC-135", "KC-135MPRS Tanker", "A", "KC130-red"],
    ["KC135", "KC-135", "KC-135 Tanker", "A", "KC130-red"],
    ["A-50", "A-50", "A-50 Mainstay", "A", "KC130-red"],
    ["An-30", "An-30M", "An-30M Clank", "A", "KC130-red"],
    ["IL-76", "IL-76", "IL-76 Candid", "A", "KC130-red"],
    ["IL-78", "IL-78", "IL-78 Midas", "A", "KC130-red"],
    ["Tu-22", "Tu-22", "Tu-22 Blinder", "A", "KC130-red"],
    ["Tu-95", "Tu-95", "Tu-95 Bear", "A", "KC130-red"],
    ["Tu-160", "Tu-160", "Tu-160 Blackjack", "A", "KC130-red"],
    ["MiG-15", "MiG-15Bis", "MiG-15Bis Fagot", "A", "MIG19-red"],
    ["MiG-19P", "MiG-19P", "MiG-19P Farmer", "A", "MIG19-red"],
    ["MiG-21", "MiG-21Bis", "MiG-21Bis Fishbed", "A", "MIG21-red"],
    ["MiG-23", "MiG-23M", "MiG-23M Flogger", "A", "MIG23-red"],
    ["MiG-25PD", "MiG-25PD", "MiG-25PD Foxbat", "A", "MIG31-red"],
    ["MiG-25RBT", "MiG-25RBT", "MiG-25RBT Foxbat", "A", "MIG31-red"],
    ["MiG-27K", "MiG-27K", "MiG-27K Flogger-D", "A", "MIG23-red"],
    ["MiG-29A", "MiG-29A", "MiG-29A Fulcrum", "A", "MIG29-red"],
    ["MiG-29G", "MiG-29G", "MiG-29G Fulcrum", "A", "MIG29-red"],
    ["MiG-29S", "MiG-29S", "MiG-29S Fulcrum", "A", "MIG29-red"],
    ["MiG-31", "MiG-31", "MiG-31 Foxhound", "A", "MIG31-red"],
    ["Su-17M", "Su-17M", "Su-17M Fitter", "A"],
    ["Su-24MR", "Su-24MR", "Su-24MR Fencer", "A", "SU24-red"],
    ["Su-24M", "Su-24M", "Su-24M Fencer", "A", "SU24-red"],
    ["Su-25T", "Su-25T", "Su-25T Frogfoot", "A", "SU25-red"],
    ["Su-25", "Su-25A", "Su-25A Frogfoot", "A", "SU25-red"],
    ["Su-27", "Su-27", "Su-27 Flanker-A", "A", "SU27-red"],
    ["Su-30", "Su-30", "Su-30 Flanker-H", "A", "SU27-red"],
    ["Su-33", "Su-33", "Su-33 Flanker-D", "A", "SU33-red"],
    ["Su-34", "Su-34", "Su-34 Fullback", "A", "SU27-red"],

    // SAM Site Vehicles
    ["p-19 s-125 sr", "P-19", "SA-2/3 P-19 SR", "EW"],
    ["SNR_75V", "SA-2", "SA-2 Track Radar", "EW"],
    ["S_75M_Volhov", "SA-2", "SA-2 Launcher", "LS; 20"],
    ["snr s-125 tr", "SA-3", "SA-3 Track Radar", "EW"],
    ["5p73 s-125 ln", "SA-3", "SA-3 Launcher", "LS; 11"],
    ["RLS_19J6", "SA-5", "SA-5 Search Radar", "EW"],
    ["RLS_19J6", "SA-5", "SA-5 Track Radar", "EW"],
    ["S-200_Launcher", "SA-5", "SA-5 Launcher", "LS; 80"],
    ["Kub 1S91", "SA-6 STR", "SA-6 Kub ST Radar", "EW"],
    ["Kub 2P25", "SA-6 LN", "SA-6 Kub LN", "MS; 8"],
    ["Osa 9A33", "SA-8", "SA-8 Osa", "MS; 7"],
    ["S-300PS 64H6E", "SA-10 BB Radar", "SA-10 Grumble BB Radar", "EW"],
    ["S-300PS 40B6MD", "SA-10 CS Radar", "SA-10 Grumble CS Radar", "EW"],
    ["S-300PS 40B6M", "SA-10 Track Radar", "SA-10 Grumble Track Radar", "EW"],
    ["S-300PS 54K6", "SA-10 CP", "SA-10 Grumble Cmd Post", "LS"],
    ["S-300PS 5P85C", "SA-10 LN C", "SA-10 Grumble LN-C", "LS"],
    ["S-300PS 5P85D", "SA-10 LN D", "SA-10 Grumble LN-D", "LS"],
    ["SA-11 Buk SR", "SA-11", "SA-11 Buk SD Radar", "EW"],
    ["SA-11 Buk CC", "SA-11", "SA-11 Buk Cmd Post", "LS"],
    ["SA-11 Buk LN", "SA-11", "SA-11 Buk TEL-R Launcher", "LS; 17"],
    ["S-300PMU1 64N6E sr", "SA-20", "SA-20 Grumble BB SR", "EW"],
    ["S-300PMU1 40B6MD sr", "SA-20", "SA-20 Grumble CS SR", "EW"],
    ["S-300PMU1 30N6E tr", "SA-20", "SA-20 Grumble Track Radar", "EW"],
    ["S-300PMU1 54K6 cp", "SA-20", "SA-20 Grumble Cmd Post", "LS"],
    ["S-300PMU1 5P85CE ln", "SA-20", "SA-20 Grumble Launcher-C", "LS; 50"],
    ["S-300PMU1 5P85DE", "SA-20", "SA-20 Grumble Launcher-D", "LS; 50"],
    ["Strela-1", "SA-13", "SA-13 Strela", "MS; 5"],
    ["Tor", "SA-15", "SA-15 Tor", "MS; 7"],
    ["2S6", "SA-19", "SA-19 Tunguska", "MS; 5"],
    ["rapier_fsa_blindfire", "Rapier LN", "Rapier ST Radar", "EW"],
    ["rapier_fsa_optical", "Rapier LN", "Rapier Optical TR", "EW"],
    ["rapier_fsa_launcher", "Rapier LN", "Rapier LN", "MS"],
    ["Hawk sr", "Hawk", "MIN-23 Hawk Search Radar", "EW"],
    ["Hawk tr", "Hawk", "MIN-23 Hawk Track Radar", "EW"],
    ["Hawk cwar", "Hawk", "MIN-23 Hawk CWAR", "LS"],
    ["Hawk pcp", "Hawk", "MIN-23 Hawk Cmd Post", "LS"],
    ["Hawk ln", "Hawk", "MIN-23 Hawk Launcher", "LS; 20"],
    ["Patriot str", "Patriot", "Patriot S/T Radar", "EW"],
    ["Patriot EPP", "Patriot", "Patriot EPP", "LS"],
    ["Patriot ECS", "Patriot", "Patriot ECS", "LS"],
    ["Patriot AMG", "Patriot", "Patriot AMS", "LS"],
    ["Patriot cp", "Patriot", "Patriot Cmd Post", "LS"],
    ["Patriot ln", "Patriot", "Patriot Launcher", "LS; 25"],

    // AAA Guns
    ["ZSU-23-4", "AAA", "ZSU-23-4 23mm Shilka", "AAA"],
    ["ZU-23 Closed", "AAA", "ZU-23 23mm Closed AAA", "AAA"],
    ["S-60", "S-60 57mm", "S-60 57mm AAA", "AAA"],
    
    // EW Radars
    ["EWR 1L119", "EWR", "EWR 1L119", "EW"],
    ["55G6", "EWR", "EWR 55G6", "EW"],

    // Infantry
    ["Infantry AK-47", "Infantry", "Infantry AK-47", "IF"],
    ["Infantry AK-74", "Infantry", "Infantry AK-74", "IF"],
    ["Infantry AK Ins", "Infantry", "Infantry AK-47", "IF"],
    ["Soldier RPG", "Infantry", "Infantry RPG", "IF"],

    // Sea/Land Missiles
    ["Silkworm_SR", "Silkworm", "HY-2 Silkworm Radar", "ARL"],
    ["hy_launcher", "Silkworm", "HY-2 Silkworm LN", "ARL"],

    // Support Utlity
    ["Ural-375 PBU", "Ural-375", "Ural-375 PBU Truck", "ARW"],
    ["Ural-375", "Ural-375", "Ural-375 Truck", "ARW"],
    ["Ural-4320T", "Ural-4320T", "Ural-4320T Truck", "ARW"],
    ["ZIL-135", "ZIL-135", "ZIL-135 Truck", "ARW"],
    ["ERO_Tent", "Tent", "Tent", "S"],

    // Munition Weapons
    ["AIM-120B", "AIM-120B", "AIM-120B AMRAAM", "W"],
    ["AIM-120C", "AIM-120C", "AIM-120C AMRAAM", "W"],
    ["BLU-108", "CBU-97/105", "CBU-97/105 BLU-108", "W"],
    ["AGM-88C", "AGM-88C", "AGM-88C HARM", "W"],
    ["AGM-65D", "AGM-65D", "AGM-65D Maverick", "W"],
    ["AGM-65H", "AGM-65H", "AGM-65H Maverick", "W"],
    ["AGM-65K", "AGM-65K", "AGM-65K Maverick", "W"],
    ["AGM-65L", "AGM-65L", "AGM-65L Maverick", "W"],
]

function parseShort(name) {
    let res = name.split(" ")[0]
    unitList.forEach(unit => {
        if (name.startsWith(unit[0])) res = unit[1]
    })
    return res
}

function parseLong(name) {
    let res = name
    unitList.forEach(unit => {
        if (name.startsWith(unit[0])) res = unit[2]
    })
    return res
}

function unitIcon(name) {
    let icon = `/assets/armor-tracked-icon-red.png`
    unitList.forEach(unit => {
        if (!name.startsWith(unit[0])) return
        let type = unit[3].split("; ")[0]
        if (unit[4]) icon = `/assets/${unit[4]}.png`
        else if (type == "A") icon = `/assets/MIG29-red.png` // Aircraft
        else if (type == "H") icon = `/assets/MI8-red.png` // Helicopters
        else if (type == "ARM") icon = `/assets/armor-icon-red.png` // Armor
        else if (type == "ART") icon = `/assets/armor-tracked-icon-red.png` // Armor Tracked
        else if (type == "ARW") icon = `/assets/armor-wheeled-icon-red.png` // Armor Wheeled
        else if (type == "ARL") icon = `/assets/artillery-icon-red.png` // Artillery
        else if (type == "AAA") icon = `/assets/aaa-icon-red.png` // AAA Guns
        else if (type == "MAN") icon = `/assets/manpad-icon-red.png` // MANPAD SAM
        else if (type == "MS") icon = `/assets/motorized-sam-icon-red.png` // Motorized SAM
        else if (type == "LS") icon = `/assets/motorized-sam-icon-red.png` // Long Range SAM
        else if (type == "EW") icon = `/assets/radar-icon-red.png` // Radar
        else if (type == "IF") icon = `/assets/infantry-icon-red.png` // Infantry
        else if (type == "S") icon = `/assets/armor-tracked-icon-red.png` // Support Utility
    })
    return icon
}

function unitType(name) {
    let type = "U"
    unitList.forEach(unit => {
        if (!name.startsWith(unit[0])) return
        type = unit[3].split("; ")[0]
    })
    return type
}

function unitThreatRing(name) {
    let size = null
    unitList.forEach(unit => {
        if (!name.startsWith(unit[0])) return
        if(unit[3].split("; ")[1]) size = unit[3].split("; ")[1]
    })
    return size
}

function parseTimeShort(time) {
    if (time) return `${time.split(" ")[1]}`
    else return "-/-"
}

module.exports = { parseShort, parseLong, unitIcon, unitType, unitThreatRing, parseTimeShort }