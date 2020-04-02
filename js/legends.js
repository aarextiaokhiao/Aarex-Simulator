var data = {
	buttons: {},
	prestiges: {},
	prestigesUnlocked: [],
	mapLocations: [1, 1],
	mapParts: {},
	maxLocations: [1, 1, 1, 1]
}

function letter(value) {
	var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	var result = ""
	while (value > 0) {
		result = letters[(value - 1) % 26] + result
		value = Math.floor((value - 1) / 26)
	}
	return result
}

function prestige(table) {
	var str = locationToString(table)
	for (var i in data.prestiges) {
		var iTable = stringToLocation(i)
		if (i != str) {
			var canReset = true
			for (var j=0; j<4; j++) if (iTable[j] > table[j]) canReset = false
			if (canReset) {
				delete data.prestiges[i]
				updateButton(iTable)
			}
		}
	}
	if (data.prestiges[str]) data.prestiges[str]++
	else data.prestiges[str] = 1
	updateButton(table)

	unlockPrestige([table[0]+1, table[1], table[2], table[3]])
	unlockPrestige([table[0], table[1]+1, table[2], table[3]])
	unlockPrestige([table[0], table[1], table[2]+1, table[3]])
	unlockPrestige([table[0], table[1], table[2], table[3]+1])
	document.getElementById("adjuster").style.top = data.maxLocations[1] * 120 + "px"
	document.getElementById("adjuster").style.left = (data.maxLocations[0] - 1) * 120 + "px"
}

function locationToString(table) {
	var str = ""
	for (var i=0; i<table.length; i++) {
		if (i>0) str += ","
		str += table[i]
	}
	return str
}

function stringToLocation(str) {
	var table = str.split(",")
	for (var i=0; i<table.length; i++) table[i] = parseInt(table[i])
	return table
}

function unlockPrestige(table) {
	var str = locationToString(table)
	if (data.prestigesUnlocked.includes(str)) return
	data.prestigesUnlocked.push(str)
	for (var i=0; i<4; i++) data.maxLocations[i] = Math.max(data.maxLocations[i], table[i])

	var mapPartId = table[2] + "," + table[3]
	if (data.mapParts[mapPartId] === undefined) data.mapParts[mapPartId] = []
	data.mapParts[mapPartId].push(str)
	if (locationToString(data.mapLocations) == mapPartId) spawnButton(table)
}

function spawnButton(table) {
	var mapPartId = table[2] + "," + table[3]
	var str = locationToString(table)
	var btn = document.createElement("button")
	data.buttons[str] = btn

	btn.className = "prestige"
	btn.table = table
	btn.style.top = (table[1] - 1) * 120 + "px"
	btn.style.left = (table[0] - 1) * 120 + "px"
	btn.onclick = function() {
		prestige(btn.table)
	}
	document.getElementById("main").append(btn)
	updateButton(table)
}

function updateButton(table) {
	var str = locationToString(table)
	var btn = data.buttons[str]
	if (btn === undefined) return

	var desc = "Prestige " + letter(table[1]) + table[0]
	if (table[2] + table[3] > 2) desc = "Island " + letter(table[3]) + table[2] + "<br>" + desc
	desc += "<br>x" + (data.prestiges[str] || 0)
	btn.innerHTML = desc
}

function changeMapPart(table) {
	data.mapLocations = table
	var mapPart = data.mapParts[locationToString(table)]
	document.getElementById("main").innerHTML = ""
	document.getElementById("island").textContent = "Island " + letter(data.mapLocations[1]) + data.mapLocations[0]
	data.buttons = {}
	if (mapPart === undefined) return
	for (var i=0; i<mapPart.length; i++) spawnButton(stringToLocation(mapPart[i]))
}

function shiftMapPart(table) {
	var mapPart = data.mapLocations
	mapPart = [mapPart[0] + table[0], mapPart[1] + table[1]]
	if (mapPart[0] > data.maxLocations[2] || mapPart[1] > data.maxLocations[3] || mapPart[0] < 1 || mapPart[1] < 1) return
	changeMapPart(mapPart)
}