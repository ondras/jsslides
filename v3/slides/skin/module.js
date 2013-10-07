(function() {
	var dir = Slides.modules.skin;
	if (dir.charAt(0) != ".") { dir = "skin/" + dir; }
	Slides.addStylesheet(dir + "/skin.css");
})();
