var Syntax = {
	base: (document.currentScript || [].slice.call(document.querySelectorAll("script")).pop()).src.split("/").slice(0, -1).join("/"), /* base path */
	tab: "    ",
	selector: "[data-syntax]",
	
	_registry: {},
	_todo: {},

	/* apply to all elements */
	all: function() { 
		var todo = [].slice.call(document.querySelectorAll(this.selector));
		while (todo.length) { this.apply(todo.shift()); }
	},
	
	/* apply to one element */
	apply: function(node) {
		var syntax = node.getAttribute("data-syntax");
		if (syntax in this._registry) { /* apply */
			this._processSyntaxNode(node, syntax);
		} else { /* defer */
			if (!(this._todo[syntax])) { /* append syntax script */
				this._todo[syntax] = [];
				this._append(syntax);
			}
			this._todo[syntax].push(node);
		}
	},

	/* register new patterns */
	register: function(name, patterns) {
		this._registry[name] = patterns;
	},
	
	/* apply a set of patterns to a root node */
	_processSyntaxNode: function(node, syntax) {
		node.className += " syntax-"+syntax;
		this._processNode(node, syntax);

		var lines = (node.innerHTML.match(/\n/g) || []).length+1;
		if (node.nodeName.toLowerCase() == "pre" && node.innerHTML.charAt(0) == "\n") { lines--; } /* first newline in <pre> is stripped by spec */
		if (node.innerHTML.charAt(node.innerHTML.length-1) == "\n") { lines--; } /* last newline is ignored */

		if (lines > 1) { this._insertLineCounter(node, lines); }
	},

	/* apply a set of patterns to a generic node */
	_processNode: function(node, syntax) {
		var children = [].slice.call(node.childNodes);
		for (var i=0;i<children.length;i++) {
			var child = children[i];
			switch (child.nodeType) {
				case 1: /* element node */
					this._processNode(child, syntax);
				break;

				case 3: /* text node */
					var tmp = document.createElement("div");
					tmp.innerHTML = this._processString(child.nodeValue, syntax);

					var fragment = document.createDocumentFragment();
					while (tmp.firstChild) { fragment.appendChild(tmp.firstChild); }

					child.parentNode.replaceChild(fragment, child);
				break;
			}
		}
	},

	/* apply a set of patterns to a text node contents */
	_processString: function(str, syntax) {
		var patterns = this._registry[syntax];

		str = str.replace(/</g, "&lt;").replace(/>/g, "&gt;");

		for (var i=0;i<patterns.length;i++) {
			var pattern = patterns[i];
			var index = pattern.index;
			var replacement = "";
			if (index > 1) { 
				for (var j=1;j<index;j++) { replacement += "$"+j; }
			}
			replacement += "<span class='"+pattern.token+"'>$"+index+"</span>";
			
			str = str.replace(pattern.re, replacement);
		}
		
		str = str.replace(/\t/g, this.tab);
		return str;
	},

	_insertLineCounter: function(node, count) {
		var parent = document.createElement("div");
		parent.className = "line-counter";

		for (var i=0;i<count;i++) {
			var num = document.createElement("div");
			num.innerHTML = i+1;
			parent.appendChild(num);
		}

		node.insertBefore(parent, node.firstChild);
	},
	
	_append: function(syntax) {
		var s = document.createElement("script");
		s.src = this.base + "/syntax-"+syntax+".js";
		
		if (s.addEventListener) {
			s.addEventListener("load", this._loaded.bind(this));
		} else {
			s.attachEvent("onreadystatechange", this._loaded.bind(this));
		}

		var parent = document.querySelector("head, body");
		parent.insertBefore(s, parent.firstChild);
	},
	
	_loaded: function() {
		for (var syntax in this._registry) {
			if (!(syntax in this._todo)) { continue; }
			while (this._todo[syntax].length) {
				this._processSyntaxNode(this._todo[syntax].shift(), syntax);
			}
			delete this._todo[syntax];
		}
	}
};
