    	case 27:
			if (!this._help.style.display) {
				this._help.style.display = "none";
			} else if (this._overviewActive) {
				this._toggleOverview();
			}
		break;

		case 191: this._toggleHelp(); break;

Presentation.prototype._toggleHelp = function() {
	this._help.style.display = (this._help.style.display ? "" : "none");
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
