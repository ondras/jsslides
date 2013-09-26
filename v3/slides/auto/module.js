(function() {
	var limit = Slides.modules.auto.limit;
	if (!limit) { return; }

	var lastIndex = -1;
	var timeout = null;

	var autochange = function() {
		timeout = null;
		var nextSlide = Slides.slides[lastIndex+1];
		if (nextSlide) { Slides.show(nextSlide); }
	}

	var onchange = function() {
		var index = Slides.slides.indexOf(Slides.current);
		if (index == lastIndex) { return; } /* slide not changed */
		lastIndex = index;

		if (timeout) { clearTimeout(timeout); }
		timeout = setTimeout(autochange, limit);
	}

	Slides.addChangeListener(onchange);
	onchange();
})();
