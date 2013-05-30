(function() {
	var active = false;
	
	var click = function(e) {
		var node = e.target;
		while (node) {
			if (node.classList.contains("slide")) {
				for (var i=0;i<Slides.slides.length;i++) {
					var slide = Slides.slides[i];
					if (slide.getNode() == node) {
						Slides.show(slide);
						close();
						return;
					}
				}
			}
			node = node.parentNode;
		}
	}
	
	var transform = function(node, value) {
		node.style.WebkitTransform = value;
		node.style.msTransform = value;
		node.style.transform = value;
	}
	
	var open = function() {
		if (active) { return; }
		active = true;
		document.body.classList.add("overview");
		document.body.addEventListener("click", click);

		var len = Slides.slides.length;
		var count = Math.ceil(Math.sqrt(len));
		var blanks = count+1;
		var padding = 0.2;
		var amount = count + blanks*padding;
		var scale = 1/amount;
		for (var i=0;i<Slides.slides.length;i++) {
			var node = Slides.slides[i].getNode();
			var x = i % count;
			var y = Math.floor(i / count);
			x = scale*(x + 0.5 + padding*(x+1)) - 0.5;
			y = scale*(y + 0.5 + padding*(y+1)) - 0.5;
			x = Math.round(x*100) + "%";
			y = Math.round(y*100) + "%";

			transform(node, "translate("+x+", "+y+") scale(" + scale + ")");
			
			var border = window.getComputedStyle(node).borderLeftWidth;
			border = parseInt(border) || 0;
			border = Math.round(border/scale);
			node.style.borderWidth = border+"px";
		}
	}
	
	var close = function() {
		if (!active) { return; }
		active = false;
		document.body.classList.remove("overview");
		document.body.removeEventListener("click", click);
		
		for (var i=0;i<Slides.slides.length;i++) {
			var node = Slides.slides[i].getNode();
			transform(node, "");
			node.style.borderWidth = "";
		}
	}

	var toggle = function(e) {
		if (e.ctrlKey) { return; }
		active ? close() : open();
	}
	
	
	Slides.addKeyListener(toggle, "O", "Toggle overview");
	Slides.addKeyListener(close, 27);
	Slides.addStylesheet("overview/module.css");
})();      
