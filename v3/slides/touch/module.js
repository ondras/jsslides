(function() {
	var touch1 = [0, 0];
	var touch2 = [0, 0];
	var time = 0;
	var conf = Slides.modules.touch;

	document.addEventListener("touchstart", function(e) {
		time = Date.now();
		touch1 = [e.touches[0].clientX, e.touches[0].clientY];
	});

	document.addEventListener("touchmove", function(e) {
		e.preventDefault();
		if (e.touches.length > 1) { time = 0; }
		
		touch2 = [e.touches[0].clientX, e.touches[0].clientY];
		if (!conf.swipe) { return; }
		
		var limit = 150;
		var dx = touch2[0]-touch1[0];
		var dy = touch2[1]-touch1[1];
		var diff = (Math.abs(dx) > Math.abs(dy) ? dx : dy);
		if (Math.abs(diff) < limit) { return; }
		
		diff > 0 ? Slides.prev() : Slides.next();
		touch1 = touch2;
	});
	
	document.addEventListener("touchend", function(e) {
		if (!conf.tap) { return; }
	
		if (Date.now()-time > 200) { return; }
		if (touch1[0] > window.innerWidth/2) { 
			Slides.next();
		} else {
			Slides.prev();
		}
	});

	var sizeconf = Slides.modules.fontsize;
	if (!sizeconf || !conf.pinch) { return; }

	var scale = 1;

	var change = function(diff) {
		var index = sizeconf.sizes.indexOf(document.documentElement.style.fontSize);
		if (index == -1) { return; }
		index += diff;
		index = Math.max(index, 0);
		index = Math.min(index, sizeconf.sizes.length-1);
		document.documentElement.style.fontSize = sizeconf.sizes[index];
	}

	document.addEventListener("gesturechange", function(e) {
		var s = e.scale;
		var diff = 0.2;
		if (s > scale + diff) {
			scale += diff;
			change(+1);
		} else if (s < scale - diff) {
			scale -= diff;
			change(-1);
		}
	});

	document.addEventListener("gestureend", function(e) {
		scale = 1;
	});
})();

