;(function(){
	var patterns = [];
	
	patterns.push({
		token: "comment",
		re: /^(\s*#.*)/gm,
		index: 1
	});

	patterns.push({
		token: "keyword",
		re: /^(\$)/gm,
		index: 1
	});

	Syntax.register("shell", patterns);
})();
