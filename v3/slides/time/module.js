(function() {
	var start = Date.now();
	var total = Slides.modules.time.remaining;
	
	var time = document.createElement("div");
	time.id = "time";
	document.querySelector(Slides.modules.time.parent).appendChild(time);
	setInterval(function() {
		var elapsed = Date.now()-start;
		var remaining = total - elapsed;
		Slides.modules.time.remaining = Math.max(remaining, 0);

		time.style.width = (100*remaining/total)+"%";
	}, 500);
})();
