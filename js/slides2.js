var Presentation = OZ.Class();
Presentation.prototype.init = function() {
	this._help = null;
	this._slides = [];
	this._index = -1;
	this._progress = OZ.DOM.elm("div", {id:"progress"});
	document.body.appendChild(this._progress);

	this._sizes = ["90%", "100%" ,"120%", "150%", "200%", "250%", "350%"];
	this._size = -1;

	this._languages = [];

	this._title = document.title;
	this._overviewActive = false;
	
	this._build();
	this._cycleLanguage();
	this._fontNormal();
	this._swipe = {
		ec: [],
		pos: []
	}
	
	OZ.Event.add(document, "keydown", this._keyDown.bind(this));
	OZ.Event.add(window, "hashchange", this._hashChange.bind(this));
	OZ.Event.add(document, "touchstart", this._swipeStart.bind(this));

	this._goTo(this._hashToIndex());
}

Presentation.prototype.goSlide = function(slide) {
	this._toggleOverview();
	var index = this._slides.indexOf(slide);
	this._goTo(index);
}

Presentation.prototype._hashToIndex = function() {
	var index = 0;
	var re = location.hash.match(/#?([0-9]+)$/)
	if (re) { index = parseInt(re[1])-1; }
	return index;
}

Presentation.prototype._build = function() {
	var all = document.getElementsByTagName("*");
	for (var i=0;i<all.length;i++) {
		var elm = all[i];
		if (elm.lang) {
			var index = this._languages.indexOf(elm.lang);
			if (index == -1) { this._languages.push(elm.lang); }
		}
		if (OZ.DOM.hasClass(elm, "slide")) { 
			var slide = new Slide(this, elm);
			this._slides.push(slide); 
		}
	}
	
	this._help = OZ.DOM.elm("div", {id:"help"});
	var url = location.href;
	var hash = url.lastIndexOf("#");
	if (hash > -1) { url = url.substring(0, hash); }
	this._help.innerHTML = "<h2>" + url + "</h2>" + 
	"<table><tbody>" +
	"<tr><td>Toggle help</td><td>?</td></tr>" + 
	"<tr><td>Change font size</td><td>B/S/N</td></tr>" + 
	"<tr><td>Previous slide</td><td>Left/PgUp/Backspace</td></tr>" + 
	"<tr><td>Next slide</td><td>Right/PgDown/Space</td></tr>" + 
	"<tr><td>First slide</td><td>Home</td></tr>" + 
	"<tr><td>Last slide</td><td>End</td></tr>" + 
	"<tr><td>Toggle overview</td><td>O</td></tr>" + 
	"<tr><td>Cycle language</td><td>L</td></tr>" + 
	"</tbody></table>" + 
	"<p>This is <a href='http://ondras.zarovi.cz/slides/'>Slides v2</a>, © 2008&ndash;" + (new Date().getFullYear()) + " <a href='http://ondras.zarovi.cz/'>Ondřej Žára</a></p>";
	this._help.style.display = "none";
	document.body.appendChild(this._help);
}

Presentation.prototype._goTo = function(index, expandAll) {
	index = Math.max(index, 0);
	index = Math.min(index, this._slides.length-1);
	if (index == this._index) { return; }
	this._index = index;
	
	for (var i=0;i<this._slides.length;i++) {
		if (i == this._index) { continue; }
		this._slides[i].hide(i < this._index ? "before" : "after");
	}
	
	document.title = this._title + " #"+(this._index+1); /* update title */
	location.hash = (this._index ? "#"+(this._index+1) : ""); /* update url */
	this._slides[this._index].show(expandAll); /* show new */

	this._progress.style.width = (100 * (this._index+1) / this._slides.length) + "%";
}


Presentation.prototype._goNext = function() {
	var result = this._slides[this._index].next();
	if (!result) { this._goTo(this._index+1, false); }
}

Presentation.prototype._goPrev = function() {
	var result = this._slides[this._index].prev();
	if (!result) { this._goTo(this._index-1, true); }
}

Presentation.prototype._toggleHelp = function() {
	this._help.style.display = (this._help.style.display ? "" : "none");
}

Presentation.prototype._fontNormal = function() {
	this._fontChange(this._sizes.indexOf("150%"));
}

Presentation.prototype._fontChange = function(index) {
	index = Math.max(index, 0);
	index = Math.min(index, this._sizes.length-1);
	if (index == this._size) { return; }
	this._size = index;
	document.body.style.fontSize = this._sizes[this._size];
}

Presentation.prototype._keyDown = function(e) {	
	switch (e.keyCode) {
		case 8:
		case 37:
		case 33: this._goPrev(); break;
		
		case 32:
		case 39:
		case 34: this._goNext(); break;
		
		case 36: this._goTo(0, false); break;
		case 35: this._goTo(this._slides.length-1, false); break;
		
		case "B".charCodeAt(0): this._fontChange(this._size+1); break;
		case "N".charCodeAt(0): this._fontNormal(); break;
		case "S".charCodeAt(0): this._fontChange(this._size-1); break;
		
		case "L".charCodeAt(0): 
			if (!e.ctrlKey) { this._cycleLanguage(); }
			return; 
		break;

		case 191: this._toggleHelp(); break;
		
		case "O".charCodeAt(0): this._toggleOverview(); break;
      
    case 27:
      if (!this._help.style.display) {
        this._help.style.display = "none";
      } else if (this._overviewActive) {
        this._toggleOverview();
      }
      break;
		
		default: return; break;
	}

	OZ.Event.prevent(e);
}

Presentation.prototype._cycleLanguage = function() {
	if (this._languages.length < 2) { return; }
	var lang = this._languages.shift();
	this._languages.push(lang);
	
	var all = document.getElementsByTagName("*");
	for (var i=0;i<all.length;i++) {
		var node = all[i];
		if (!node.lang) { continue; }
		node.style.display = (node.lang == lang ? "" : "none");
	}
}

Presentation.prototype._toggleOverview = function() {
	if (this._overviewActive) {
		this._overviewActive = false;
		OZ.DOM.removeClass(document.body, "overview");
		for (var i=0; i<this._slides.length;i++) {
			this._slides[i].endOverview();
		}
	} else {
		this._overviewActive = true;
		OZ.DOM.addClass(document.body, "overview");
		var count = Math.ceil(Math.sqrt(this._slides.length));
		var blanks = count+1;
		var padding = 0.2;
		var amount = count + blanks*padding;
		var scale = 1/amount;
		
		for (var i=0; i<this._slides.length;i++) {
			var x = i % count;
			var y = Math.floor(i / count);
			x += (x+1)*padding;
			y += (y+1)*padding;
			this._slides[i].beginOverview(scale, x, y);
		}
	}
	
}

Presentation.prototype._hashChange = function(e) {
	this._goTo(this._hashToIndex());
}

Presentation.prototype._swipeStart = function(e) {
	this._swipe.pos = [e.touches[0].clientX, e.touches[0].clientY];
	this._swipe.ec.push(OZ.Event.add(document, "touchmove", this._swipeMove.bind(this)));
	this._swipe.ec.push(OZ.Event.add(document, "touchend", this._swipeEnd.bind(this)));
}

Presentation.prototype._swipeMove = function(e) {
	if (e.touches.length > 1) { return; }
	
	OZ.Event.prevent(e);
	var dx = e.touches[0].clientX - this._swipe.pos[0];
	var dy = e.touches[0].clientY - this._swipe.pos[1];
	var r = Math.abs(dx/dy);
	if (r > 8 && Math.abs(dx) > 150) {
		if (dx > 0) {
			this._goTo(this._index-1, true);
		} else if (dx < 0) {
			this._goTo(this._index+1, false);
		}
		this._swipeEnd();
	}
}

Presentation.prototype._swipeEnd = function() {
	while (this._swipe.ec.length) { OZ.Event.remove(this._swipe.ec.pop()); }
}

var Slide = OZ.Class();
Slide.prototype._prefixes = ["", "Moz", "Webkit", "O", "ms"];

Slide.prototype.init = function(presentation, elm) {
	this._presentation = presentation;
	this._elm = elm;
	this._hiddenClass = "";

	this._sections = []; /* podcasti */
	this._index = -1; /* kolikata podcast je aktualni */
	
	this._findSections(elm);
}

Slide.prototype.getContainer = function() {
	return this._elm;
}

Slide.prototype._findSections = function(node) {
	var hasSections = OZ.DOM.hasClass(node, "sections");
	OZ.DOM.removeClass(node, "sections");
	
	var children = node.childNodes;
	var childElements = [];
	for (var i=0;i<children.length;i++) {
		var child = children[i];
		if (child.nodeType == 1) { 
			childElements.push(child);
			if (hasSections) { OZ.DOM.addClass(child, "section"); }
		}
	}
	
	if (OZ.DOM.hasClass(node, "section")) { 
		this._sections.push(node); 
		OZ.DOM.addClass(node, "after");
	}
	for (var i=0;i<childElements.length;i++) {
		this._findSections(childElements[i]);
	}
}

Slide.prototype.hide = function(className) {
	if (className == this._hiddenClass) { return; }
	if (this._hiddenClass) { OZ.DOM.removeClass(this._elm, this._hiddenClass); }
	
	this._hiddenClass = className;

	OZ.DOM.removeClass(this._elm, "current");
	OZ.DOM.addClass(this._elm, this._hiddenClass);

	this.dispatch("slide-hide");
}

Slide.prototype.show = function(expandAll) {
	OZ.DOM.removeClass(this._elm, this._hiddenClass);
	this._hiddenClass = "";
	OZ.DOM.addClass(this._elm, "current");

	this._index = (expandAll ? this._sections.length-1 : 0);

	for (var i=0;i<this._sections.length;i++) {
		var node = this._sections[i];
		if (i == this._index) { 
			OZ.DOM.addClass(node, "current"); 
			OZ.DOM.removeClass(node, "after"); 
			OZ.DOM.removeClass(node, "before"); 
		} else {
			OZ.DOM.removeClass(node, "current"); 
			if (i < this._index) {
				OZ.DOM.removeClass(node, "after");
				OZ.DOM.addClass(node, "before");
			} else {
				OZ.DOM.removeClass(node, "before");
				OZ.DOM.addClass(node, "after");
			}
		}
	}
	
	this.dispatch("slide-show");
}

Slide.prototype.next = function() {
	if (this._index+1 >= this._sections.length) { return false; }

	OZ.DOM.removeClass(this._sections[this._index], "current");
	OZ.DOM.addClass(this._sections[this._index], "before");
	this._index++;
	OZ.DOM.removeClass(this._sections[this._index], "after");
	OZ.DOM.addClass(this._sections[this._index], "current");
	
	return true;
}

Slide.prototype.prev = function() {
	if (this._index <= 0) { return false; }

	OZ.DOM.removeClass(this._sections[this._index], "current");
	OZ.DOM.addClass(this._sections[this._index], "after");
	this._index--;
	OZ.DOM.removeClass(this._sections[this._index], "before");
	OZ.DOM.addClass(this._sections[this._index], "current");
	
	return true;
}

Slide.prototype.beginOverview = function(scale, x, y) {
	x = Math.round(x*100) + "%";
	y = Math.round(y*100) + "%";
	this._css3prop("transform", "scale(" + scale + ") translate(" + x + ", " + y + ")");
	
	var border = OZ.Style.get(this._elm, "borderLeftWidth");
	border = parseInt(border) || 0;
	border = Math.round(border/scale);
	this._elm.style.borderWidth = border+"px";
	
	this._event = OZ.Event.add(this._elm, "click", this._click.bind(this));
}

Slide.prototype.endOverview = function(scale, x, y) {
	this._css3prop("transform", "");
	this._elm.style.borderWidth = "";
	OZ.Event.remove(this._event);
}

Slide.prototype._css3prop = function(name, value) {
	for (var i=0;i<this._prefixes.length;i++) {
		var n = this._prefixes[i];
		if (n) {
			n += name.charAt(0).toUpperCase() + name.substring(1);
		} else {
			n += name;
		}
		this._elm.style[n] = value;
	}
}

Slide.prototype._click = function(e) {
	this._presentation.goSlide(this);
}
