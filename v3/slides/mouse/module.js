(function() {
	var dir = Slides.modules.mouse;
	if (dir == "button") {
		document.addEventListener("contextmenu", function(e) { e.preventDefault(); });
	}

	document.addEventListener("mousedown", function(e) {
		var next = true;
		switch (dir) {
			case "x":
				if (e.clientX < window.innerWidth/2) { next = false; }
				if (e.button) { return; }
			break;

			case "y":
				if (e.clientY < window.innerHeight/2) { next = false; }
				if (e.button) { return; }
			break;

			case "button":
				if (e.button) { next = false; }
			break;

			default:
				return;
			break;
		}

		if (next) {
			Slides.next(false);
		} else {
			Slides.prev(false);
		}
	});
})();
