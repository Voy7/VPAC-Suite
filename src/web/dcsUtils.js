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
    ["C5_Galaxy", "C-5A", "C-5A Galaxy", "A", "KC130-red"],
    ["C-17", "C-17A", "C-17A Globemaster", "A", "KC130-red"],
    ["C-130", "C-130", "C-130 Hercules", "A", "KC130-red"],
    ["E-3A", "E-3A", "E-3A Sentry", "A", "E3A-red"],
    ["E-2C", "E-2C", "E-2C Hawkeye", "A", "E3A-red"],
    ["E-2D", "E-2D", "E-2D Hawkeye", "A", "E3A-red"],
    ["Hercules", "C-130", "C-130 Hercules", "A", "KC130-red"],
    ["F-4E", "F-4E", "F-4E Phantom II", "A", "F4-red"],
    ["F-5E", "F-5E", "F-5E Tiger II", "A", "F5-red"],
    ["F-14A", "F-14A", "F-14A Tomcat", "A", "F14-red"],
    ["F-14B", "F-14B", "F-14B Tomcat", "A", "F14-red"],
    ["F-15C", "F-15C", "F-15C Eagle", "A", "F15-red"],
    ["F-15E", "F-15E", "F-15E Mudhen", "A", "F15-red"],
    ["F-16C", "F-16C", "F-16C Viper", "A", "JF17-red"],
    ["FA-18C", "F/A-18C", "F/A-18C Hornet", "A", "FA18-red"],
    ["F-117", "F-117A", "F-117A Nighthawk", "A"],
    ["KC130", "KC-130", "KC-130 Tanker", "A", "KC130-red"],
    ["KC-135", "KC-135", "KC-135 Tanker", "A", "KC130-red"],
    ["KC135MPRS", "KC-135MPRS", "KC-135MPRS Tanker", "A", "KC130-red"],
    ["KC_10_Extender_D", "KC-10", "KC-10 Extender-D", "A", "KC130-red"],
    ["KC_10_Extender", "KC-10", "KC-10 Extender", "A", "KC130-red"],
    ["MQ-9", "MQ-9", "MQ-9 Reaper", "A", "TF51-red"],
    ["Mirage-F1", "F1", "Mirage F1", "A", "MIG21-red"],
    ["M-2000", "M-2000C", "Mirage 2000C", "A", "MIG21-red"],
    ["A-50", "A-50", "A-50 Mainstay", "A", "KC130-red"],
    ["An-30", "An-30M", "An-30M Clank", "A", "KC130-red"],
    ["Yak-40", "Yak-40", "Yak-40", "A", "A10-red"],
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
    ["J-11", "J-11A", "J-11A Flanker-L", "A", "SU27-red"],
    ["JF-17", "JF-17", "JF-17 Thunder", "A", "JF17-red"],
    ["KJ-2000", "KJ-2000", "KJ-2000 Mainring", "A", "E3A-red"],
    ["P-47", "P-47D", "P-47D Thunderbolt", "A", "TF51-red"],
    ["P-51", "P-51D", "P-51D Mustang", "A", "TF51-red"],
    ["Mosquito", "Mosquito FB", "Mosquito FB", "A", "TF51-red"],
    ["FW-190A8", "PFW-190", "FW-190 A8", "A", "TF51-red"],

    // SAM Site Vehicles
    ["p-19 s-125 sr", "P-19", "SA-2/3 P-19 SR", "EW"],
    ["SNR_75V", "SA-2", "SA-2 Track Radar", "EW"],
    ["S_75M_Volhov", "SA-2", "SA-2 Launcher", "LS; 20"],
    ["snr s-125 tr", "SA-3", "SA-3 Track Radar", "EW"],
    ["5p73 s-125 ln", "SA-3", "SA-3 Launcher", "LS; 11"],
    ["RLS_19J6", "SA-5", "SA-5 Search Radar", "EW"],
    ["RPC_5N62V", "SA-5", "SA-5 Track Radar", "EW"],
    ["S-200_Launcher", "SA-5", "SA-5 Launcher", "LS; 80"],
    ["Kub 1S91", "SA-6", "SA-6 Kub S/T Radar", "EW"],
    ["Kub 2P25", "SA-6", "SA-6 Kub Launcher", "MS; 8"],
    ["Osa 9A33", "SA-8", "SA-8 Osa", "MS; 7"],
    ["S-300PS 64H6E", "SA-10", "SA-10 Grumble BB Radar", "EW"],
    ["S-300PS 40B6MD", "SA-10", "SA-10 Grumble CS Radar", "EW"],
    ["S-300PS 40B6M", "SA-10", "SA-10 Grumble Track Radar", "EW"],
    ["S-300PS 54K6", "SA-10", "SA-10 Grumble Cmd Post", "LS"],
    ["S-300PS 5P85C", "SA-10", "SA-10 Grumble Launcher-C", "LS"],
    ["S-300PS 5P85D", "SA-10", "SA-10 Grumble Launcher-D", "LS"],
    ["SA-11 Buk SR", "SA-11", "SA-11 Buk SD Radar", "EW"],
    ["SA-11 Buk CC", "SA-11", "SA-11 Buk Cmd Post", "LS"],
    ["SA-11 Buk LN", "SA-11", "SA-11 Buk TEL-R Launcher", "LS; 17"],
	["SA-17 Buk", "SA-17", "SA-17 Buk TEL-R Launcher", "LS; 23"],
    ["S-300PMU1 64N6E sr", "SA-20", "SA-20 Grumble BB Radar", "EW"],
    ["S-300PMU1 40B6MD sr", "SA-20", "SA-20 Grumble CS Radar", "EW"],
    ["S-300PMU1 30N6E tr", "SA-20", "SA-20 Grumble Track Radar", "EW"],
    ["S-300PMU1 54K6 cp", "SA-20", "SA-20 Grumble Cmd Post", "LS"],
    ["S-300PMU1 5P85CE ln", "SA-20", "SA-20 Grumble Launcher-C", "LS; 60"],
    ["S-300PMU1 5P85DE", "SA-20", "SA-20 Grumble Launcher-D", "LS; 65"],
    ["Strela-1", "SA-13", "SA-13 Strela", "MS; 5"],
    ["SA-14", "SA-14", "SA-14 Strela-3", "MS; 3"],
    ["Tor", "SA-15", "SA-15 Tor", "MS; 7"],
    ["SA-18", "SA-18", "SA-18 Igla", "MS; 3"],
    ["Igla manpad", "SA-18", "SA-18 Igla", "MS; 3"],
    ["2S6", "SA-19", "SA-19 Tunguska", "MS; 5"],
    ["rapier_fsa_blindfire", "Rapier", "Rapier ST Radar", "EW"],
    ["rapier_fsa_optical", "Rapier", "Rapier Optical TR", "EW"],
    ["rapier_fsa_launcher", "Rapier", "Rapier Launcher", "MS"],
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
    ["Roland", "Roland", "Roland ADS", "MS; 3.5"],
    ["HQ-7_LN_SP", "HQ-7", "HQ-7 Banner", "MS; 8"],
    ["Soldier stinger", "Stinger", "FIM-92 Stinger", "MS; 3"],
    ["Stringer comm", "Stinger", "FIM-92 Stinger", "MS; 3"],

    // AAA Guns
    ["ZSU-23-4", "AAA", "ZSU-23-4 23mm Shilka", "AAA"],
    ["ZU-23 Closed", "AAA", "ZU-23 23mm AAA Closed", "AAA"],
    ["ZU-23 Emplacement", "AAA", "ZU-23 23mm AAA Emplacement", "AAA"],
    ["S-60", "AAA", "S-60 57mm AAA", "AAA"],
    ["ZSU_57", "AAA", "ZSU-57 57mm AAA", "AAA"],
    ["M1097", "AAA", "M1097 Avenger AAA", "AAA"],
    ["M48 ", "AAA", "M48 Chaparral AAA", "AAA"],
    
    // EW Radars
    ["EWR 1L119", "EWR", "EWR 1L119", "EW"],
    ["1L13", "EWR", "EWR 1L13", "EW"],
    ["55G6", "EWR", "EWR 55G6", "EW"],

    // Infantry
    ["Infantry", "Infantry", "Infantry", "IF"],
    ["Soldier", "Infantry", "Infantry", "IF"],
    ["Paratrooper", "Infantry", "Paratrooper", "IF"],
    ["Infantry AK", "Infantry", "Infantry AK-47", "IF"],
    ["Infantry AK-47", "Infantry", "Infantry AK-47", "IF"],
    ["Infantry AK-74", "Infantry", "Infantry AK-74", "IF"],
    ["Soldier RPG", "Infantry", "Infantry RPG", "IF"],
    ["Soldier M4", "Infantry", "Infantry M4", "IF"],
    ["Soldier M249", "Infantry", "Infantry M249", "IF"],
    ["Paratrooper RPG", "Infantry", "Paratrooper RPG", "IF"],

    // Sea/Land Missiles
    ["Silkworm_SR", "Silkworm", "HY-2 Silkworm Radar", "ARL"],
    ["hy_launcher", "Silkworm", "HY-2 Silkworm Launcher", "ARL"],
    ["Scud_B", "Scud", "SS-1C Scud-B", "ARL"],

    // Armor
    ["BMP-1", "BMP-1", "BMP-1 IFV", "ART"],
    ["BMP-2", "BMP-2", "BMP-2 IFV", "ART"],
    ["BMP-3", "BMP-3", "BMP-3 IFV", "ART"],
    ["M-113", "APC", "M113 APC", "ART"],
    ["BTR_D", "APC", "APC BTR-D", "ART"],
    ["BTR-80", "APC", "APC BTR-80", "ART"],
    ["BTR-82", "APC", "APC BTR-82A", "ART"],
    ["tt_DSHK", "Scout LC", "Scout LC 12.7mm MG", "ARW"],
    ["tt_KORD", "Scout LC", "Scout LC 12.7mm MG", "ARW"],
    ["HL_DSHK", "Scout HL", "Scout HL 12.7mm MG", "ARW"],
    ["HL_KORD", "Scout HL", "Scout HL 12.7mm MG", "ARW"],
    ["ZBD04", "ZBD-04", "ZBD-04 LAV", "ARW"],
    ["ZTZ96", "ZTZ-96B", "ZTZ-96B MBT", "ART"],
    ["T-55", "T-55", "T-55 MBT", "ART"],
    ["T-72B", "T-72B", "T-72B MBT", "ART"],
    ["T-72B3", "T-72B3", "T-72B3 MBT", "ART"],
    ["T-80U", "T-80U", "T-80U MBT", "ART"],
    ["T-90", "T-90", "T-90 MBT", "ART"],
    ["Chieftain_mk3", "MBT", "Chieftain Mk.3 MBT", "ART"],
    ["Smerch_HE", "Artillery", "Smerch 300mm Artillery", "ARL"],
    ["Grad-URAL", "Artillery", "MLRS Grad 122mm", "ARL"],
    ["PLZ05", "Artillery", "PLZ-05 155mm Artillery", "ARL"],
    ["M-109", "Artillery", "M109 155mm Artillery", "ARL"],
    ["Leopard-2", "MBT", "Leopard 2 MBT", "ART"],
    ["M-1 Abrams", "MBT", "M1 Abrams MBT", "ART"],
    ["M-2 Bradley", "IFV", "M2 Bradley IFV", "ART"],
    ["M2A1_halftrack", "APC", "M2A1 Halftrack APC", "ARW"],
    ["M1134", "ATGM", "M1134 Stryker ATGM", "ART"],
    ["Marder", "IFV", "Marder IFV", "ART"],
    ["VAB_Mephisto", "ATGM", "VAB Mephisto ATGM", "ART"],
    ["M1045 HMMWV TOW", "ATGM", "M1045 HMMWV ATGM", "ARW"],
    ["M1043 HMMWV Armament", "HMMWV", "M1043 HMMWV", "ARW"],


    // Support Utlity
    ["Ural-375 PBU", "Truck", "Ural-375 PBU Truck", "S"],
    ["Ural-375", "Truck", "Ural-375 Truck", "S"],
    ["Ural-4320T", "Truck", "Ural-4320T Truck", "S"],
	["Ural-4320", "Truck", "Ural-4320 Truck", "S"],
    ["ZIL-131", "Truck", "ZIL-131 Truck", "S"],
    ["ZiL-131", "Truck", "ZIL-131 Truck", "S"],
    ["ZIL-135", "Truck", "ZIL-135 Truck", "S"],
    ["GAZ-66", "Truck", "GAZ-66 Truck", "S"],
    ["ATZ-5", "Truck", "ATZ-5 Truck", "S"],
    ["ATZ-10", "Truck", "ATZ-10 Truck", "S"],
    ["ATZ-60", "Truck", "ATZ-60 Truck", "S"],
    ["ATMZ-5", "Truck", "ATMZ-5 Truck", "S"],
    ["M 818", "Truck", "M818 Heavy Truck", "S"],
    ["KAMAZ", "Truck", "KAMAZ Truck", "S"],
    ["UAZ-469", "Truck", "UAZ-469 Jeep", "S"],
    ["M978 HEMT", "Truck", "M978 HEMT Tanker", "S"],
    ["Tigr", "Truck", "LUV Tigr Truck", "S"],
    ["Hummer", "HMMWV", "LUV HMMWV Jeep", "S"],
    ["ERO_Tent", "Tent", "Tent", "S"],
    ["Small Warehouse", "Warehouse", "Warehouse", "S"],
    ["generator_5i57", "Power Station", "Diesel Power Station 5i57A", "S"],

    // Ships
    ["CVN_59", "CVN-59", "CVN-59", "CV; 16"],
    ["CVN_70", "CVN-70", "CVN-70", "CV; 8"],
    ["CVN_71", "CVN-71", "CVN-71", "CV; 8"],
    ["CVN_72", "CVN-72", "CVN-72", "CV; 8"],
    ["CVN_73", "CVN-73", "CVN-73", "CV; 8"],
    ["CVN_74", "CVN-74", "CVN-74", "CV; 8"],
    ["CVN_75", "CVN-75", "CVN-75", "CV; 8"],
    ["LHA_Tarawa", "LHA-1", "LHA-1", "CV; 16"],
    ["USS_Arleigh", "Arleigh Burke", "Arleigh Burke", "DD; 54"],
    ["PERRY", "Oliver Hazard Perry", "Oliver Hazard Perry", "FF; 54"],
    ["CV_1143", "CV-1143", "CV-1143", "CV; 7"],
    ["Type_052B", "Type 052B", "Type 052B", "DD; 82"],
    ["Type_052C", "Type 052C", "Type 052C", "DD; 54"],
    ["Type_054A", "Type 054A", "Type 054A", "FF; 24"],
    ["Type_071", "Type 071", "Type 071", "CC"],
    ["Type_093", "Type 093", "Type 093", "SB"],
    ["IMPROVED_KILO", "Improved Kilo", "636 Improved Kilo", "SB"],
    ["BDK-775", "LS Ropucha", "LS Ropucha", "FF"],
    ["PIOTR", "Pyotr Velikiy", "1144.2 Pyotr Velikiy", "CC; 64"],
    ["ALBATROS", "Grisha", "1124.4 Grisha", "FF; 5"],
    ["MOLNIYA", "Molniya", "1241.1 Molniya", "FF; 1"],
    ["REZKY", "Rezky", "1135M Rezky", "DD; 5"],
    ["NEUSTRASH", "Neustrashimy", "11540 Neustrashimy", "DD; 6"],
    ["La_Combattante_II", "Ship", "La Combattante II F.A.C", "SH"],

    // Munition Weapons
    ["AIM-120B", "AIM-120B", "AIM-120B AMRAAM", "W"],
    ["AIM-120C", "AIM-120C", "AIM-120C AMRAAM", "W"],
    ["BLU-108", "CBU-97/105", "CBU-97/105 BLU-108", "W"],
    ["AGM-88C", "AGM-88C", "AGM-88C HARM", "W"],
    ["AGM-65D", "AGM-65D", "AGM-65D Maverick", "W"],
    ["AGM-65H", "AGM-65H", "AGM-65H Maverick", "W"],
    ["AGM-65K", "AGM-65K", "AGM-65K Maverick", "W"],
    ["AGM-65L", "AGM-65L", "AGM-65L Maverick", "W"],

    // Misc
    ["Unknown", "Unknown", "Unknown", "S"],
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
    let icon = `/assets/default-icon-red.png`
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
        else if (type == "S") icon = `/assets/truck-icon-red.png` // Support Utility
        else if (type == "SH") icon = `/assets/truck-icon-red.png` // Generic Ships
        else if (type == "CV") icon = `/assets/carrier-icon-red.svg` // Carrier Ships
        else if (type == "CC") icon = `/assets/cruiser-icon-red.svg` // Cruiser Ships
        else if (type == "DD") icon = `/assets/destroyer-icon-red.svg` // Destroyer Ships
        else if (type == "FF") icon = `/assets/frigate-icon-red.svg` // Frigate Ships
        else if (type == "SB") icon = `/assets/truck-icon-red.png` // Submarines
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

function unitCode(name) {
    let code = null
    unitList.forEach(unit => {
        if (!name.startsWith(unit[0])) return
        code = unit[3].split("; ")[0]
    })
    return code
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

module.exports = { parseShort, parseLong, unitIcon, unitType, unitCode, unitThreatRing, parseTimeShort }