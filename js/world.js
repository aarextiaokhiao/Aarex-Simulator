var prestigesUnlocked=["1,1,1"]
var layersOfPrestiges={1:["1,1"]}
var prestiged={}
var firstLayers=[,{name:"Normal",color:[25.6,25.6,25.6]},{name:"Red",color:[230.4,0,0]},{name:"Orange",color:[230.4,115.2,0]},{name:"Yellow",color:[230.4,230.4,0]},{name:"Green",color:[0,230.4,0]},{name:"Cyan",color:[0,230.4,230.4]},{name:"Blue",color:[0,0,230.4]},{name:"Purple",color:[115.2,0,230.4]},{name:"Pink",color:[230.4,0,230.4]},{name:"Beryl",color:[230.4,0,115.2]}]
var maxXYZ=[0,0,0]
var layerNum=1

function prestige(array) {
	for (var id in prestiged) {
		var idArray = id.split(",")
		if (idArray[0] <= array[0] && idArray[1] <= array[1] && idArray[2] <= array[2] && id !== array[0]+","+array[1]+","+array[2]) {
			document.getElementById(id).textContent = 0
			delete prestiged[id]
		}
	}
	if (prestiged[array[0]+","+array[1]+","+array[2]]) prestiged[array[0]+","+array[1]+","+array[2]]++
	else prestiged[array[0]+","+array[1]+","+array[2]] = 1
	document.getElementById(array[0]+","+array[1]+","+array[2]).textContent = prestiged[array[0]+","+array[1]+","+array[2]]
	unlockPrestige([array[0]+1,array[1],array[2]])
	unlockPrestige([array[0],array[1]+1,array[2]])
	unlockPrestige([array[0],array[1],array[2]+1])
	maxXYZ=[Math.max(maxXYZ[0],array[0]),Math.max(maxXYZ[1],array[1]),Math.max(maxXYZ[2],array[2])]
	document.getElementById("adjuster").style.left = maxXYZ[0] * 100 + "px"
	document.getElementById("adjuster").style.top = (maxXYZ[1] * 100 + 20) + "px"
}

function unlockPrestige(array) {
	if (prestigesUnlocked.includes(array[0]+","+array[1]+","+array[2])) return
	prestigesUnlocked.push(array[0]+","+array[1]+","+array[2])
	if (layersOfPrestiges[array[2]] == undefined) layersOfPrestiges[array[2]] = []
	layersOfPrestiges[array[2]].push(array[0]+","+array[1])
	var btn = document.createElement("button")
	btn.innerHTML = "<b>"+getPrestigeLayer(array[2])+" "+letter(array[1])+array[0]+"</b><div id='"+array[0]+","+array[1]+","+array[2]+"'>0</div>"
	btn.onclick = function() {
		eval("prestige(["+array[0]+","+array[1]+","+array[2]+"])")
	}
	btn.className = "prestige"
	btn.style.display = layerNum == array[2] ? "" : "none"
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

function getPrestigeLayer(value) {
	if (value == 1) return "Prestige"
	if (value > 10) return getLayerData(value).name + " Prestige"
	return firstLayers[value].name + " Prestige"
}

function switchLayer(value) {
	for (var p=0;p<layersOfPrestiges[layerNum].length;p++) document.getElementById(layersOfPrestiges[layerNum][p]+","+layerNum).parentElement.style.display = "none"
	for (var p=0;p<layersOfPrestiges[value].length;p++) document.getElementById(layersOfPrestiges[value][p]+","+value).parentElement.style.display = ""
	layerNum = value
	if (layerNum < 11) {
		document.getElementById("layer").textContent = "The " + firstLayers[layerNum].name + " Layer"
		document.body.style["background-color"] = "rgb(" + firstLayers[layerNum].color[0] + "," + firstLayers[layerNum].color[1] + "," + firstLayers[layerNum].color[2] + ")"
	} else {
		var data = getLayerData(layerNum)
		document.getElementById("layer").textContent = "The " + data.name + " Layer"
		document.body.style["background-color"] = "rgb(" + data.color[0] + "," + data.color[1] + "," + data.color[2] + ")"
	}
}

function getLayerData(value) {
	var hue = ((value - 11) / 100) % 1
	var light = (50 - Math.floor((value - 11) / 100)) / 100
	if (value > 5010) light = Math.floor((value + 89) / 100) / 100
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
	return {name: "#" + getHexadecimal(red) + getHexadecimal(green) + getHexadecimal(blue), color: [red, green, blue]}
}

function getHexadecimal(value) {
	var digits = "0123456789ABCDEF"
	value = Math.round(value)
	return digits[Math.floor(value / 16)] + digits[value % 16]
}

function prevLayer() {
	if (layerNum > 1) switchLayer(layerNum - 1)
}

function nextLayer() {
	if (layerNum <= maxXYZ[2]) switchLayer(layerNum + 1)
}