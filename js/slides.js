/* OBSOLETE; use slides2.js */

var Presentation = OZ.Class();
Presentation.init = function() {
	Presentation.presentation = new Presentation();
}

Presentation.prototype.init = function() {
	this._slides = [];
	this._index = -1;
	this._select = OZ.$("slide-select");
	this._counter = OZ.$("slide-counter");
	this._sizes = ["50%" ,"75%", "90%", "100%" ,"120%", "150%", "200%", "250%", "350%"];
	this._size = -1;
	this._title = document.title;
	
	this._build();
	this.normal();
	
	if (this._select) { OZ.Event.add(this._select, "change", this._selectChange.bind(this)); }
	if (this._counter) { OZ.Event.add(this._counter, "click", this._counterClick.bind(this)); }
	OZ.Event.add(document, "keydown", this._keyDown.bind(this));
	
	var index = 0;
	var re = location.hash.match(/#?([0-9]+)$/)
	if (re) { index = parseInt(re[1])-1; }
	this.goTo(index, false);
}

Presentation.prototype._build = function() {
	var all = document.getElementsByTagName("*");
	for (var i=0;i<all.length;i++) {
		var elm = all[i];
		if (OZ.DOM.hasClass(elm, "slide")) {
			var s = new Slide(this, elm);
			this._slides.push(s);
		}
	}
	
	if (this._select) { this._buildSelect(); }
	this._slides.forEach(function($){ $.hide(); });
	
	var links = document.getElementsByTagName("a");
	for (var i=0;i<links.length;i++) {
		OZ.Event.add(links[i], "click", this._anchorClick);
	}
}

Presentation.prototype._buildSelect = function() {
	OZ.DOM.clear(this._select);
	var groups = [];
	var ch = OZ.$("slide-chapters");
	if (ch) {
		var lis = ch.getElementsByTagName("li");
		for (var i=0;i<lis.length;i++) { groups.push(lis[i].innerHTML); }
	}
	
	var parent = this._select;
	var currentChapter = false;
	
	for (var i=0;i<this._slides.length;i++) {
		var slide = this._slides[i];
		var ch = slide.getChapter();
		
		if (ch) {
			if (ch != currentChapter) {
				currentChapter = ch;
				parent = OZ.DOM.elm("optgroup");
				this._select.appendChild(parent);
				parent.label = groups[ch-1];
			}
		} else {
			parent = this._select;
		}
		
		var o = OZ.DOM.elm("option");
		var t = (i+1) + ". " + slide.getTitle();
		o.innerHTML = t;
		o.value = i;
		parent.appendChild(o);
	}
}

Presentation.prototype.goTo = function(index, expandAll) {
	if (index < 0 || index >= this._slides.length) { return; }
	if (this._index != -1) { this._slides[this._index].hide(); } /* hide current */
	this._index = index;
	
	if (this._select) { /* update selectbox */
		this._select.selectedIndex = this._index; 
		/* ie hack... */
		this._select.getElementsByTagName("option")[index].setAttribute("selected","selected");
	}
	
	if (this._counter) { this._counter.innerHTML = (this._index+1) + "/" + this._slides.length; } /* update slide counter */
	document.title = this._title + " #"+(this._index+1); /* update title */
	location.hash = "#"+(this._index+1); /* update url */
	this._slides[this._index].show(expandAll); /* show new */
}

Presentation.prototype._selectChange = function(e) {
	this.goTo(this._select.selectedIndex, false);
	OZ.Event.target(e).blur();
}

Presentation.prototype._counterClick = function(e) {
	if (e.which && e.which != 1) { return; }
	if (OZ.ie && e.button) { return; }
	this.next();
}

Presentation.prototype._keyDown = function(e) {	
	switch (e.keyCode) {
		case 37:
		case 33: this.prev(); break;
		
		case 32:
		case 39:
		case 34: this.next(); break;
		
		case 36: this.goTo(0, false); break;
		case 35: this.goTo(this._slides.length-1, false); break;
		
		case 66: this.bigger(); break;
		case 78: this.normal(); break;
		case 83: this.smaller(); break;
		case 191: this.help();	break;
	}
}

Presentation.prototype.next = function() {
	var result = this._slides[this._index].next();
	if (!result) { this.goTo(this._index+1, false); }
}

Presentation.prototype.prev = function() {
	var result = this._slides[this._index].prev();
	if (!result) { this.goTo(this._index-1, true); }
}

Presentation.prototype.help = function() {
	var arr = [];
	arr.push("Font size - B/S/N");
	arr.push("Previous - Left/PgUp");
	arr.push("Next - Right/PgDown/Space");
	arr.push("First - Home");
	arr.push("Last - End");
	arr.push(""); 
	arr.push("Slides: http://ondras.zarovi.cz/slides/");
	arr.push("© 2008 - " + (new Date().getFullYear()) + " Ondřej Žára");
	alert(arr.join("\n"));
}

Presentation.prototype.smaller = function() {
	if (this._size > 0) {
		this._size--;
		document.body.style.fontSize = this._sizes[this._size];
	}
}

Presentation.prototype.bigger = function() {
	if (this._size+1 < this._sizes.length) {
		this._size++;
		document.body.style.fontSize = this._sizes[this._size];
	}
}

Presentation.prototype.normal = function() {
	this._size = this._sizes.indexOf("100%");
	document.body.style.fontSize = this._sizes[this._size];
}

Presentation.prototype._anchorClick = function(e) {
	var elm = OZ.Event.target(e);
	if (!elm.href) { return; }
	var re = elm.href.toString().match(/#([0-9])+/);
	if (re) {
		var num = parseInt(re[1]) - 1;
		this.goTo(num, false);
	}
}

var Slide = OZ.Class();

Slide.prototype.init = function(presentation, elm) {
	this._presentation = presentation;
	this._elm = elm;
	this._hiddens = []; /* schovane casti */
	this._index = -1; /* kolikata schovana cast je zobrazena */
	
	this._findHiddens(elm);
	if (this._hiddens.length) { this._hiddens.shift(); } /* odebrat prvni, ten bude videt vzdy */
}

Slide.prototype.getContainer = function() {
	return this._elm;
}

Slide.prototype._findHiddens = function(node) {
	var children = node.childNodes;
	var hasClass = OZ.DOM.hasClass(node, "slide-hide");
	
	var childElements = [];
	for (var i=0;i<children.length;i++) {
		var child = children[i];
		if (child.nodeType == 1) { childElements.push(child); }
	}
	if (hasClass && !childElements.length) { this._hiddens.push(node); }
	
	for (var i=0;i<childElements.length;i++) {
		var child = childElements[i];
		if (hasClass) { this._hiddens.push(child); }
		this._findHiddens(child);
	}
}

Slide.prototype.hide = function() {
	OZ.DOM.addClass(this._elm, "slide-none");
	this.dispatch("slide-hide");
}

Slide.prototype.show = function(expand) {
	OZ.DOM.removeClass(this._elm, "slide-none");

	for (var i=0;i<this._hiddens.length;i++) {
		var node = this._hiddens[i];
		OZ.DOM.removeClass(node, "slide-hidden");
		if (!expand) { OZ.DOM.addClass(node, "slide-hidden"); }
	}
	
	this._index = (expand ? this._hiddens.length-1 : -1);
	this.dispatch("slide-show");
}

Slide.prototype.next = function() {
	if (this._index+1 < this._hiddens.length) {
		this._index++;
		OZ.DOM.removeClass(this._hiddens[this._index],"slide-hidden");
		return true;
	} else { return false; }
}

Slide.prototype.prev = function() {
	if (this._index > -1) {
		OZ.DOM.addClass(this._hiddens[this._index],"slide-hidden");
		this._index--;
		return true;
	} else { return false; }
}

Slide.prototype.getTitle = function() {
	var list = ["h1","h2","h3"];
	for (var i=0;i<list.length;i++) {
		var all = this._elm.getElementsByTagName(list[i]);
		if (all.length) { return all[0].innerText || all[0].textContent; }
	}
	return "";
}

Slide.prototype.getChapter = function() {
	var cn = this._elm.className;
	var r = cn.match(/slide-chapter-([0-9]+)/);
	if (!r) return false;
	return r[1];
}

OZ.Event.add(window, "load", Presentation.init);
