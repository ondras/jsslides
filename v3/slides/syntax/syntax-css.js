;(function(){
	var patterns = [];
	
	patterns.push({
		token: "comment",
		re: /(\/\*[\s\S]*?\*\/)/g,
		index: 1
	});

	patterns.push({
		token: "keyword",
		re: /^([^{\n]+)(?=\s*{)/gm,
		index: 1
	});

	patterns.push({
		token: "string",
		re: /(: \s*)([^;\n]+)/g,
		index: 2
	});

	Syntax.register("css", patterns);
})();
