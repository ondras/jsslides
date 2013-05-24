		case "L".charCodeAt(0): 
			if (!e.ctrlKey) { this._cycleLanguage(); }
			return; 
		break;

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

