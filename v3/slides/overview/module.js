      
    	case 27:
			if (!this._help.style.display) {
				this._help.style.display = "none";
			} else if (this._overviewActive) {
				this._toggleOverview();
			}
		break;
		
		case "O".charCodeAt(0): this._toggleOverview(); break;

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
