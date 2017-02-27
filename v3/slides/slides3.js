document.documentElement.style.visibility = "hidden";
var Slides = {
	modules: {},
	slides: [],
	current: null,

	_title: document.querySelector("h1, title").innerText,
	_path: [].slice.call(document.querySelectorAll("script")).pop().src.split("/").slice(0, -1).join("/"),
	_listeners: {
		key: [],
		change: []
	},

	next: function(skipSections) {
		var index = this.slides.indexOf(this.current);
		var section = 0;

		if (skipSections) {
			index++;
		} else {
			section = this.current.index+1;
			if (section == this.current.sections.length) {
				index++;
				section = 0;
			}
		}

		if (index < this.slides.length) { this.show(this.slides[index], section); }
	},

	prev: function(skipSections) {
		var index = this.slides.indexOf(this.current);
		var section = 0;

		if (skipSections) {
			index--;
		} else {
			section = this.current.index-1;
			if (section < 0) {
				index--;
				if (index > -1) { section = this.slides[index].sections.length-1; }
			}
		}

		if (index > -1) { this.show(this.slides[index], section); }
	},

	show: function(slide, section) {
		this.current = slide;

		for (var i=0;i<this.slides.length;i++) {
			var slide = this.slides[i];
			if (this.current == slide) {
				slide.show(section);
			} else {
				slide.hide();
			}
		}

		var event = {type:"change"};
		for (var i=0;i<this._listeners.change.length;i++) { this._listeners.change[i](event); }
	},

	addScript: function(path) {
		var script = document.createElement("script");
		if (path.charAt(0) != "." && path.indexOf("http") != 0) { path = this._path + "/" + path; }
		script.src = path;
		document.body.appendChild(script);
		return script;
	},

	addStylesheet: function(path) {
		var link = document.createElement("link");
		link.rel = "stylesheet";
		if (path.charAt(0) != ".") { path = this._path + "/" + path; }
		link.href = path;
		document.body.appendChild(link);
		return link;
	},

	addKeyListener: function(listener, keys, label) {
		this._listeners.key.push({
			listener: listener,
			keys: [].concat(keys),
			label: label
		});
	},

	addChangeListener: function(listener) {
		this._listeners.change.push(listener);
	},

	getKeyListeners: function() {
		return this._listeners.key;
	},
	
	format: function(template) {
		var scope = {
			"s": this.current.getTitle(),
			"t": this._title,
			"n": this.slides.indexOf(Slides.current) + 1,
			"c": this.slides.length
		};
		return template.replace(/%([a-z]|{(.*?)})/g, function(match, letter, expr) {
			if (expr) {
				with (scope) { return eval(expr); }
			} else if (letter) {
				return scope[letter];
			} else {
				return match;
			}
		});
	},

	handleEvent: function(e) {
		switch (e.type) {
			case "load":
				var meta = document.querySelector("meta[name=viewport]");
				if (!meta) {
					var meta = document.createElement("meta");
					meta.name = "viewport";
					document.querySelector("head, body").appendChild(meta);
				}
				meta.content = "width=device-width,user-scalable=0,initial-scale=1";

				this.addStylesheet("slides3.css");

				var nodes = document.querySelectorAll(".slide");
				for (var i=0;i<nodes.length;i++) {
					this.slides.push(new Slide(nodes[i]));
				}

				this.show(this.slides[0]);

				var count = 0;
				for (var id in this.modules) {
					if (!this.modules[id]) { continue; }
					count++;
					this.addScript(id + "/module.js").onload = function() {
						count--;
						if (!count) { document.documentElement.style.visibility = ""; }
					}
				}
			break;

			case "keydown":
			case "keypress":
				if (e.type == "keypress" && e.charCode && !e.ctrlKey && !e.altKey && !("value" in e.target)) { e.preventDefault(); }

				for (var i=0;i<this._listeners.key.length;i++) {
					var item = this._listeners.key[i];
					var code = e.keyCode;
					if (e.type == "keypress") { code = String.fromCharCode(e.charCode).toUpperCase(); }
					if (item.keys.indexOf(code) != -1) { item.listener(e); }
				}
			break;
		} /* switch */
	} /* handleEvent */
};
window.addEventListener("load", Slides);
document.addEventListener("keydown", Slides);
document.addEventListener("keypress", Slides);

var Slide = function(node) {
	this._node = node;

	this.sections = [];
	this._findSections(node);
	this.index = (this.sections.length ? 0 : -1); /* last open section */

	this._syncSections(); /* show first section */
}

Slide.prototype.getNode = function() {
	return this._node;
}

Slide.prototype.getTitle = function() {
	var node = this._node.querySelector("h2, h3, strong, em");
	return (node ? node.innerText : "");
}

Slide.prototype.hide = function() {
	this._node.classList.remove("current");
	return this;
}

Slide.prototype.show = function(section) {
	this._node.classList.add("current");

	this.index = (section || 0);
	this.index = Math.max(this.index, 0);
	this.index = Math.min(this.index, this.sections.length-1);
	this._syncSections();

	return this;
}

Slide.prototype._findSections = function(node) {
	if (node.classList.contains("section")) { 
		this.sections.push(node);
	}

	var hasSections = node.classList.contains("sections");
	node.classList.remove("sections");
	
	for (var i=0;i<node.children.length;i++) {
		var child = node.children[i];
		if (hasSections) { child.classList.add("section"); }
		this._findSections(child);
	}
}

Slide.prototype._syncSections = function() {
	for (var i=0;i<this.sections.length;i++) {
		var section = this.sections[i];
		if (i == this.index) {
			section.classList.add("current");
			section.classList.remove("after");
		} else {
			section.classList.remove("current");
			if (i < this.index) {
				section.classList.remove("after");
			} else {
				section.classList.add("after");
			}
		}
	}
}

/* default module configuration */
Slides.modules.keyboard = true;
Slides.modules.url = true;
Slides.modules.title = "(%n) %t"; /* %t %s %n %c" */
Slides.modules.progress = {
	template: "%n/%c",
	parent: "footer"
};
Slides.modules.time = {
	remaining: 10*60*1000,
	parent: "footer"
};
Slides.modules.skin = "default";
Slides.modules.language = ["en"];
Slides.modules.transition = "horizontal"; /* none vertical horizontal blend corner */
Slides.modules.overview = true;
Slides.modules.help = true;
Slides.modules.fontsize = {
	sizes: ["100%" ,"120%", "150%", "200%", "250%", "350%"],
	normal: "150%",
	fit: false
};
Slides.modules.syntax = true;
Slides.modules.window = true;
Slides.modules.touch = {
	tap: true,
	swipe: true,
	pinch: true
};
Slides.modules.auto = {
	limit: 0
}
Slides.modules.remote = true;
Slides.modules.sound = true;
Slides.modules.mouse = ""; /* "x", "y", "button" */
/*
	Slides.modules.firebase = {
		url: "https://ondras.firebaseio.com/slides",
		write: true,
		auth: "github"
	}
*/
Slides.modules.numbering = true;
