(function() {
	var win = null;
	var time = null;
	var start = Date.now();
	var style = "";

	var close = function() {
		win.close();
		win = null;
	}

	var open = function() {
		win = window.open("", "_blank", "resizable=yes,scrollbars=yes");
		win.document.title = "Presenter's window";
		sync();
	}

	var toggle = function() {
		if (win && win.closed) { win = null; }
		win ? close() : open();
	}

	var scanComments = function(node, results) {
		for (var i=0;i<node.childNodes.length;i++) {
			var child = node.childNodes[i];
			if (child.nodeType == child.COMMENT_NODE) {
				results.push(child);
			} else if (child.nodeType == child.ELEMENT_NODE) {
				scanComments(child, results);
			}
		}
	}

	var buildCurrent = function() {
		var index = Slides.slides.indexOf(Slides.current) + 1;
		var str = "<li>Current slide: ";
		str += index + "/" + Slides.slides.length;
		str += "</li>";
		return str;
	}

	var buildTime = function() {
		if (!Slides.modules.time) { return ""; }
		return "<li>Remaining time: <span id='time'></span></li>";
	}

	var buildComments = function() {
		var comments = [];
		var node = Slides.current.getNode();
		scanComments(node, comments);
		if (!comments.length) { return ""; }
		var str =  "<li>Comments<ul>";
		for (var i=0;i<comments.length;i++) {
			str += "<li>" + comments[i].nodeValue + "</li>";
		}
		str += "</ul></li>";
		return str;
	}

	var buildNext = function() {
		var index = Slides.slides.indexOf(Slides.current);
		if (index+1 == Slides.slides.length) { return ""; }
		var str = "<li>Next slide: <em>";
		str += Slides.slides[index+1].getTitle();
		str += "</em></li>";
		return str;
	}

	var sync = function() {
		if (win && win.closed) { win = null; }
		if (!win) { return; }
		var body = win.document.body;
		var html = "";
		html += "<link rel='stylesheet' href='" + style + "' />";
		html += "<ul>";
		html += buildCurrent();
		html += buildTime();
		html += buildComments();
		html += buildNext();
		html += "</ul>"
		body.innerHTML = html;
		time = win.document.querySelector("#time");
	}

	var syncTime = function() {
		if (!time) { return; }
		var remaining = Slides.modules.time.remaining;

		remaining = Math.round(remaining/1000);
		var s = remaining % 60;
		remaining = Math.floor(remaining/60);
		var m = remaining % 60;
		remaining = Math.floor(remaining/60);
		var h = remaining;

		if (s < 10) { s = "0"+s; }
		if (m < 10) { m = "0"+m; }

		time.innerHTML = h+":"+m+":"+s;
	}
	
	Slides.addKeyListener(toggle, "P", "Presenter's window");
	Slides.addChangeListener(sync);
	setInterval(syncTime, 500);
	var node = Slides.addStylesheet("window/module.css");
	style = node.href;
	node.parentNode.removeChild(node);
})();
