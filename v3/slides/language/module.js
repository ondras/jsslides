(function() {
	var languages = Slides.modules.language;
	if (languages.length < 2) { return; }
	
	var toggle = function() {
		var lang = languages.shift();
		languages.push(lang);
		var all = document.querySelectorAll("[lang]");
		for (var i=0;i<all.length;i++) {
			var node = all[i];
			node.style.display = (node.lang == lang ? "" : "none");
		}
	}

	var listener = function(e) {
		if (e.ctrlKey) { return; }
		toggle();
	}
	Slides.addKeyListener(listener, ["L".charCodeAt(0)], "Cycle language");
	
	toggle();
})();
