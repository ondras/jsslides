		case "B".charCodeAt(0): this._fontChange(this._size+1); break;
		case "N".charCodeAt(0): this._fontNormal(); break;
		case "S".charCodeAt(0): this._fontChange(this._size-1); break;

	this._sizes = ["90%", "100%" ,"120%", "150%", "200%", "250%", "350%"];
	this._size = -1;

Presentation.prototype._fontNormal = function() {
	var size = 150;
	var r = location.search.match(/size=([0-9]+)/);
	if (r) { size = r[1]; }
	this._fontChange(this._sizes.indexOf(size+"%"));
}

Presentation.prototype._fontChange = function(index) {
	index = Math.max(index, 0);
	index = Math.min(index, this._sizes.length-1);
	if (index == this._size) { return; }
	this._size = index;
	document.body.style.fontSize = this._sizes[this._size];
}

