(function() {
	var active = false;
	var node = document.createElement("div");
	node.id = "help";
	node.className = "hidden";
	document.body.appendChild(node);
	
	var keyMap = {
		8: "Backspace",
		32: "Space",
		33: "PgUp",
		34: "PgDown",
		35: "End",
		36: "Home",
		
		37: "←",
		38: "↑",
		39: "→",
		40: "↓"
	};
	
	var build = function() {
		var str = "";
		var listeners = Slides.getKeyListeners();
		var rows = [];

		for (var i=0;i<listeners.length;i++) {
			var listener = listeners[i];
			var label = listener.label;
			if (!label) { continue; }
			var index = -1;
			for (var j=0;j<rows.length;j++) {
				if (rows[j].label == label) { index = j; }
			}
			if (index == -1) {
				index = rows.length;
				rows.push({label:label, keys:[]});
			}
			rows[index].keys = rows[index].keys.concat(listener.keys);
		}
		
		for (var i=0;i<rows.length;i++) {
			str += "<tr><td>" + rows[i].label + "</td><td>";
			var keys = rows[i].keys;
			for (var j=0;j<keys.length;j++) {
				var key = keys[j];
				if (typeof(key) == "string") { continue; }
				keys[j] = keyMap[key] || String.fromCharCode(key);
			}
			str += keys.join(" / ");
			str += "</td></tr>";
		}

		return str;
	}
	
	var open = function() {
		if (active) { return; }
		active = true;
		
		var url = location.href;
		var hash = url.lastIndexOf("#");
		if (hash > -1) { url = url.substring(0, hash); }
		
		var str = "<h3>" + url + "</h3><table>" + build();
		str += "</table><p>This is <a href='http://ondras.zarovi.cz/slides/'>Slides v3</a>, © 2013&ndash;" + (new Date().getFullYear()) + " <a href='http://ondras.zarovi.cz/'>Ondřej Žára</a></p>";

		node.innerHTML = str;
		node.classList.toggle("hidden");
	}
	
	var close = function() {
		if (!active) { return; }
		active = false;
		node.classList.toggle("hidden");
	}

	var toggle = function() {
		active ? close() : open();
	}
	
	Slides.addKeyListener(toggle, "?", "Toggle help");
	Slides.addKeyListener(close, 27);
	Slides.addStylesheet("help/module.css");
})();
