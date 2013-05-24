	this._progress = OZ.DOM.elm("div", {id:"progress"});
	document.body.appendChild(this._progress);
		this._progress.style.width = (100 * (this._index+1) / this._slides.length) + "%";
