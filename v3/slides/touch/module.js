(function() {
	var scale = 1;
	var touch1 = 0;
	var touch2 = 0;
	var time = 0;
	var meta = document.querySelector("meta[name=viewport]");
	if (!meta) {
		var meta = document.createElement("meta");
		meta.name = "viewport";
		document.querySelector("head, body").appendChild(meta);
	}
	meta.content = "user-scalable=0,initial-scale=1";

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

	var change = function(diff) {
		var index = conf.sizes.indexOf(document.documentElement.style.fontSize);
		if (index == -1) { return; }
		index += diff;
		index = Math.max(index, 0);
		index = Math.min(index, conf.sizes.length-1);
		document.documentElement.style.fontSize = conf.sizes[index];
	}

	document.addEventListener("gesturechange", function(e) {
		time = 0;
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

