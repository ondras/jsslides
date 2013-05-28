(function() {
	var progress = document.createElement("div");
	progress.id = "progress";
	document.querySelector(Slides.modules.progress.parent).appendChild(progress);
	var listener = function() {
		var index = Slides.slides.indexOf(Slides.current);
		progress.style.width = (100 * (index+1) / Slides.slides.length) + "%";
		progress.innerHTML = Slides.format(Slides.modules.progress.template);
	}
	Slides.addChangeListener(listener);
	listener();
})();
