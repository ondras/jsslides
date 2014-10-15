(function() {
	var name = "data-sound";
	var all = document.querySelectorAll("[" + name + "]");
	var cache = {};

	for (var i=0;i<all.length;i++) {
		var src = all[i].getAttribute(name);
		if (src in cache) { continue; }
		var audio = new Audio(src);
		audio.load();
		cache[src] = audio;
	}

	var previouslyActive = [];

	var listener = function() {
		var active = [].slice.call(document.querySelectorAll(".slide.current[" + name + "], .slide.current .current[" + name + "]"));
		var start = [];
		var stop = previouslyActive.slice();

		for (var i=0;i<active.length;i++) {
			var node = active[i];
			var index = stop.indexOf(node);
			if (index > -1) { /* still playing */
				stop.splice(index, 1);
			} else {
				start.push(node);
			}
		}

		stop.forEach(function(node) {
			cache[node.getAttribute(name)].pause();
		});

		start.forEach(function(node) {
			cache[node.getAttribute(name)].play();
		});

		previouslyActive = active;
	}
	Slides.addChangeListener(listener);
	listener();
})();
