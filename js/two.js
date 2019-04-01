var prestigesUnlocked=["1,1"]
var prestiged={}

function prestige(array) {
	for (var id in prestiged) {
		var idArray = id.split(",")
		if (idArray[0] <= array[0] && idArray[1] <= array[1] && id !== array[0]+","+array[1]) {
			document.getElementById(id).textContent = 0
			delete prestiged[id]
		}
	}
	if (prestiged[array[0]+","+array[1]]) prestiged[array[0]+","+array[1]]++
	else prestiged[array[0]+","+array[1]] = 1
	document.getElementById(array[0]+","+array[1]).textContent = prestiged[array[0]+","+array[1]]
	unlockPrestige([array[0]+1,array[1]])
	unlockPrestige([array[0],array[1]+1])
}

function unlockPrestige(array) {
	if (prestigesUnlocked.includes(array[0]+","+array[1])) return
	prestigesUnlocked.push(array[0]+","+array[1])
	var btn = document.createElement("button")
	btn.innerHTML = "<b>Prestige "+letter(array[1])+array[0]+"</b><div id='"+array[0]+","+array[1]+"'>0</div>"
	btn.onclick = function() {
		eval("prestige(["+array[0]+","+array[1]+"])")
	}
	btn.className = "prestige"
	btn.style.left = (array[0] - 1) * 100 + "px"
	btn.style.top = (array[1] - 1) * 100 + "px"

	var hue = ((array[0] - 1) / 100) % 1
	var light = 1 - (array[1] - 1) / 100 % 2
	if (light < 0) light = -light
	var red = 0
	var green = 0
	var blue = 0
	if (hue > 2/3) {
		blue = Math.min(6 - hue * 6, 1) * 230.4
		red = Math.min(hue * 6 - 4, 1) * 230.4
	} else if (hue > 1/3) {
		green = Math.min(4 - hue * 6, 1) * 230.4
		blue = Math.min(hue * 6 - 2, 1) * 230.4
	} else {
		red = Math.min(2 - hue * 6, 1) * 230.4
		green = Math.min(hue * 6, 1) * 230.4
	}
	if (light > 0.5) {
		red = red * (2 - light * 2) + 230.4 * (light * 2 - 1)
		green = green * (2 - light * 2) + 230.4 * (light * 2 - 1)
		blue = blue * (2 - light * 2) + 230.4 * (light * 2 - 1)
	} else {
		red = red * light * 2 + 25.6 * (1 - light * 2)
		green = green * light * 2 + 25.6 * (1 - light * 2)
		blue = blue * light * 2 + 25.6 * (1 - light * 2)
	}
	if (light > 0.25) btn.style["color"] = "rgb(25.6, 25.6, 25.6)"
	else btn.style["color"] = "rgb(230.4, 230.4, 230.4)"
	btn.style["background-color"] = "rgb("+red+","+green+","+blue+")"

	document.body.appendChild(btn)
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