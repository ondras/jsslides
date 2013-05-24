Slides.addChangeListener(function(e) {
	var index = Slides.slides.indexOf(Slides.current);
	location.hash = (index ? "#"+(index+1) : "");
});

(function() {
	var load = function() {
		var index = 0;
		var re = location.hash.match(/#?([0-9]+)$/)
		if (re) { index = parseInt(re[1])-1; }
		var slide = Slides.slides[index];
		if (slide == Slides.current) { return; }
		if (slide) { Slides.show(slide); }
	}
	window.addEventListener("hashchange", load);
	load();
})();
