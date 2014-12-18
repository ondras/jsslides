Slides.addScript("markdown/commonmark.js").addEventListener("load", function() {
	var reader = new commonmark.DocParser();
	var writer = new commonmark.HtmlRenderer();

	var process = function(node) {
		var parsed = reader.parse(node.innerHTML);
		node.innerHTML = writer.render(parsed);
	};
	[].slice.call(document.querySelectorAll("[data-format=markdown]")).forEach(process);
});
