	this._swipe = {
		ec: [],
		pos: []
	}

	OZ.Event.add(document, "touchstart", this._swipeStart.bind(this));

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
