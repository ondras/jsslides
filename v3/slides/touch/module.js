+
+	this._scale = 1;
+	this._touchStartTime = 0;
+	this._touchX = 0;

+
+	OZ.Event.add(document, "gesturechange", this._gestureChange.bind(this));
+	OZ.Event.add(document, "gestureend", this._gestureEnd.bind(this));
+	OZ.Event.add(document, "touchstart", this._touchStart.bind(this));
+	OZ.Event.add(document, "touchend", this._touchEnd.bind(this));
+	OZ.Event.add(document, "touchmove", OZ.Event.prevent);

+Presentation.prototype._gestureChange = function(e) {
+	this._touchStartTime = 0;
+	var s = e.scale;
+	var diff = 0.2;
+	if (s > this._scale + diff) {
+		this._scale += diff;
+		this._fontChange(this._size+1);
+	} else if (s < this._scale - diff) {
+		this._scale -= diff;
+		this._fontChange(this._size-1);
 	}
 }

+Presentation.prototype._gestureEnd = function(e) {
+	this._scale = 1;
+}
+
+Presentation.prototype._touchStart = function(e) {
+	this._touchStartTime = Date.now();
+	this._touchX = e.touches[0].clientX;
+}
+
+Presentation.prototype._touchEnd = function(e) {
+	var t2 = Date.now();
+	var diff = t2-this._touchStartTime;
+	this._touchStartTime = 0;
+	if (diff < 200) {
+		if (this._touchX > OZ.DOM.win()[0]/2) { 
+			this._goNext();
+		} else {
+			this._goPrev();
+		}
+	}
