(function() {
	var conf = Slides.modules.fontsize;

	var set = function(index) {
		document.body.style.fontSize = conf.sizes[index];
	}
	
	var change = function(delta) {
		var index = conf.sizes.indexOf(document.body.style.fontSize);
		if (index == -1) { index = conf.sizes.indexOf(conf.normal); }
		if (index == -1) { return; }
		index += delta;
		index = Math.max(index, 0);
		index = Math.min(index, conf.sizes.length-1);
		set(index);
	}
	
	var normal = function() {
		set(conf.sizes.indexOf(conf.normal));
	}
	
	var plus = function() {
		change(+1);
	}
	
	var minus = function() {
		change(-1);
	}
	
	Slides.addKeyListener(plus, "B".charCodeAt(0), "Change font size");
	Slides.addKeyListener(minus, "S".charCodeAt(0), "Change font size");
	Slides.addKeyListener(normal, "N".charCodeAt(0), "Change font size");
	
	var r = location.search.match(/[\?&]size=([0-9]+)/);
	if (r) { 
		var size = r[1] + "%"; 
		if (conf.sizes.indexOf(size) != -1) { conf.normal = size; }
	}
	normal();

	if (!conf.fit) { return; }

	var current = null;
	var onchange = function() {
		if (Slides.current == current) { return; }
		current = Slides.current;
		var node = current.getNode();
		
		node.style.visibility = "hidden";

		var i = conf.sizes.length;
		while (i --> 0) {
			set(i);
			if (node.scrollHeight == node.offsetHeight) { break; }
		}

		node.style.visibility = "";
	}
	Slides.addChangeListener(onchange);
	onchange();
})();
