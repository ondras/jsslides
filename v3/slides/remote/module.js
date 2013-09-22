(function() {
	var r = location.search.match(/[\?&]remote/);
	if (!r) { return; }

	var parent = document.createElement("div");
	parent.id = "remote";
	
	var next = document.createElement("button");
	var prev = document.createElement("button");
	parent.appendChild(next);
	parent.appendChild(prev);
	
	var event = ("ontouchstart" in prev ? "touchstart" : "click");
	next.addEventListener(event, Slides.next.bind(Slides, false));
	prev.addEventListener(event, Slides.prev.bind(Slides, false));
	
	document.body.appendChild(parent);
	
	var format = function(before, what, a, b) {
		return before + " " + what + " <span>(" + a + "/" + b + ")</span>";
	}
	
	var sync = function() {
		var slide = Slides.current;
		var what, a, b;

		if (slide.sections.length < 2 || slide.index+1 == slide.sections.length) {
			what = "slide";
			a = Slides.slides.indexOf(slide) + 2;
			b = Slides.slides.length;
			next.disabled = (a>b);
		} else {
			what = "section";
			a = slide.index+1;
			b = slide.sections.length;
			next.disabled = false;
		}
		next.innerHTML = format("Next", what, a, b);

		if (slide.sections.length < 2 || slide.index == 0) {
			what = "slide";
			a = Slides.slides.indexOf(slide);
			b = Slides.slides.length;
			prev.disabled = (a < 1);
		} else {
			what = "section";
			a = slide.index;
			b = slide.sections.length;
			prev.disabled = false;
		}
		prev.innerHTML = format("Previous", what, a, b);
	}
	sync();
	
	Slides.addStylesheet("remote/module.css");
	Slides.addChangeListener(sync);
})();      
