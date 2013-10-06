(function() {
	var r = location.search.match(/[\?&]remote/);
	if (!r) { return; }

	var parent = document.createElement("div");
	parent.id = "remote";
	
	var next = document.createElement("button");
	var prev = document.createElement("button");
	next.innerHTML = "Next";
	prev.innerHTML = "Back";
	
	var event = ("ontouchstart" in prev ? "touchstart" : "click");
	var handler = function(e) {
		e.stopPropagation();
		Slides[e.target == prev ? "prev" : "next"]();
	}
	next.addEventListener(event, handler);
	prev.addEventListener(event, handler);
	
	document.body.appendChild(parent);
	parent.appendChild(next);
	parent.appendChild(prev);
	
	var sync = function() {
		var slide = Slides.current;
		var all = Slides.slides;
		next.disabled = (all.indexOf(slide)+1 == all.length && slide.index+1 == slide.sections.length);
		prev.disabled = (all.indexOf(slide) == 0 && slide.index < 1);
	}
	sync();
	
	Slides.addStylesheet("remote/module.css");
	Slides.addChangeListener(sync);
})();
