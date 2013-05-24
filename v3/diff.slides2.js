diff -r 95122ee84049 js/slides2.js
--- a/js/slides2.js	Fri May 24 16:06:28 2013 +0200
+++ b/js/slides2.js	Fri May 24 16:07:55 2013 +0200
@@ -17,14 +17,19 @@
 	this._build();
 	this._cycleLanguage();
 	this._fontNormal();
-	this._swipe = {
-		ec: [],
-		pos: []
-	}
+
+	this._scale = 1;
+	this._touchStartTime = 0;
+	this._touchX = 0;
 	
 	OZ.Event.add(document, "keydown", this._keyDown.bind(this));
 	OZ.Event.add(window, "hashchange", this._hashChange.bind(this));
-	OZ.Event.add(document, "touchstart", this._swipeStart.bind(this));
+
+	OZ.Event.add(document, "gesturechange", this._gestureChange.bind(this));
+	OZ.Event.add(document, "gestureend", this._gestureEnd.bind(this));
+	OZ.Event.add(document, "touchstart", this._touchStart.bind(this));
+	OZ.Event.add(document, "touchend", this._touchEnd.bind(this));
+	OZ.Event.add(document, "touchmove", OZ.Event.prevent);
 
 	this._goTo(this._hashToIndex());
 }
@@ -110,7 +115,10 @@
 }
 
 Presentation.prototype._fontNormal = function() {
-	this._fontChange(this._sizes.indexOf("150%"));
+	var size = 150;
+	var r = location.search.match(/size=([0-9]+)/);
+	if (r) { size = r[1]; }
+	this._fontChange(this._sizes.indexOf(size+"%"));
 }
 
 Presentation.prototype._fontChange = function(index) {
@@ -123,6 +131,7 @@
 
 Presentation.prototype._keyDown = function(e) {	
 	switch (e.keyCode) {
+		case 9: OZ.Event.prevent(e); break;
 		case 8:
 		case 37:
 		case 33: this._goPrev(); break;
@@ -143,6 +152,7 @@
 			return; 
 		break;
 
+		case 173:
 		case 191: this._toggleHelp(); break;
 		
 		case "O".charCodeAt(0): this._toggleOverview(); break;
@@ -193,8 +203,8 @@
 		for (var i=0; i<this._slides.length;i++) {
 			var x = i % count;
 			var y = Math.floor(i / count);
-			x += (x+1)*padding;
-			y += (y+1)*padding;
+			x += (x+1)*padding + 0.5;
+			y += (y+1)*padding + 0.5;
 			this._slides[i].beginOverview(scale, x, y);
 		}
 	}
@@ -205,31 +215,39 @@
 	this._goTo(this._hashToIndex());
 }
 
-Presentation.prototype._swipeStart = function(e) {
-	this._swipe.pos = [e.touches[0].clientX, e.touches[0].clientY];
-	this._swipe.ec.push(OZ.Event.add(document, "touchmove", this._swipeMove.bind(this)));
-	this._swipe.ec.push(OZ.Event.add(document, "touchend", this._swipeEnd.bind(this)));
-}
-
-Presentation.prototype._swipeMove = function(e) {
-	if (e.touches.length > 1) { return; }
-	
-	OZ.Event.prevent(e);
-	var dx = e.touches[0].clientX - this._swipe.pos[0];
-	var dy = e.touches[0].clientY - this._swipe.pos[1];
-	var r = Math.abs(dx/dy);
-	if (r > 8 && Math.abs(dx) > 150) {
-		if (dx > 0) {
-			this._goTo(this._index-1, true);
-		} else if (dx < 0) {
-			this._goTo(this._index+1, false);
-		}
-		this._swipeEnd();
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
 
-Presentation.prototype._swipeEnd = function() {
-	while (this._swipe.ec.length) { OZ.Event.remove(this._swipe.ec.pop()); }
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
 }
 
 var Slide = OZ.Class();
@@ -340,7 +358,7 @@
 Slide.prototype.beginOverview = function(scale, x, y) {
 	x = Math.round(x*100) + "%";
 	y = Math.round(y*100) + "%";
-	this._css3prop("transform", "scale(" + scale + ") translate(" + x + ", " + y + ")");
+	this._css3prop("transform", "translate(-50%, -50%) scale(" + scale + ") translate(" + x + ", " + y + ")");
 	
 	var border = OZ.Style.get(this._elm, "borderLeftWidth");
 	border = parseInt(border) || 0;
