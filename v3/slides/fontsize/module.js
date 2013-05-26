(function() {
	var sizes = ["90%", "100%" ,"120%", "150%", "200%", "250%", "350%"];
	var index = -1;
	
	var change = function(i) {
		i = Math.max(i, 0);
		i = Math.min(i, sizes.length-1);
		if (i == index) { return; }
		index = i;
		document.body.style.fontSize = sizes[index];
	}
	
	var normal = function() {
		var size = 150;
		var r = location.search.match(/size=([0-9]+)/);
		if (r) { size = r[1]; }
		change(sizes.indexOf(size+"%"));
	}
	
	var plus = function() {
		change(index+1);
	}
	
	var minus = function() {
		change(index-1);
	}
	
	Slides.addKeyListener(plus, "B".charCodeAt(0), "Change font size");
	Slides.addKeyListener(minus, "S".charCodeAt(0), "Change font size");
	Slides.addKeyListener(normal, "N".charCodeAt(0), "Change font size");
	
	normal();
})();
