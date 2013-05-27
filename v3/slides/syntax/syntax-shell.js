;(function(){
	var patterns = [];
	
	patterns.push({
		token: "comment",
		re: /^(\s*#.*)/gm,
		index: 1
	});

	Syntax.register("shell", patterns);
})();
