(function() {
	var scale = 0;
	var touch1 = 0;
	var touch2 = 0;
	var time = 0;
	
	document.addEventListener("touchstart", function(e) {
		time = Date.now();
		touch1 = e.touches[0].clientX;
	});

	document.addEventListener("touchend", function(e) {
		var diff = Date.now()-time;
		time = 0;
		if (diff > 600) { return; }
		if (touch1 > touch2) { 
			Slides.next();
		} else {
			Slides.prev();
		}
	});

	document.addEventListener("touchmove", function(e) {
		touch2 = e.touches[0].clientX;
		e.preventDefault();
	});
	
	var conf = Slides.modules.fontsize;
	if (!conf) { return; }

	document.addEventListener("gesturechange", function(e) {
		time = 0;
		var s = e.scale;
		var diff = 0.2;
		if (s > scale + diff) {
			scale += diff;
			//...
		} else if (s < scale - diff) {
			scale -= diff;
			//...
		}
	});

	document.addEventListener("gestureend", function(e) {
		scale = 1;
	});
})();

