;(function(){
	var patterns = [];
	
	patterns.push({
		token: "string",
		re: /('.*?')/g,
		index: 1
	});
	
	patterns.push({
		token: "string",
		re: /(".*?")/g,
		index: 1
	});
	
	patterns.push({
		token: "number",
		re: /([^0-9#a-z])(-?[0-9]+(\.[0-9]+)?)/ig,
		index: 2
	});

	patterns.push({
		token: "comment",
		re: /(\/\*[\s\S]*?\*\/)/g,
		index: 1
	});

	patterns.push({
		token: "comment",
		re: /([^:]|^)(\/\/.*)/g,
		index: 2
	});

	patterns.push({
		token: "keyword",
		re: /(\$[\w\$]+)/g,
		index: 1
	});

	Syntax.register("php", patterns);
})();
