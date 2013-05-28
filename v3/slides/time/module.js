(function() {
	var start = Date.now();
	
	var time = document.createElement("div");
	time.id = "time";
	document.querySelector(Slides.modules.time.parent).appendChild(time);
	setInterval(function() {
		var elapsed = Date.now()-start;
		var frac = elapsed / Slides.modules.time.length;
		frac = Math.min(frac, 1);
		time.style.width = 100*(1-frac)+"%";
	}, 1000);
})();
