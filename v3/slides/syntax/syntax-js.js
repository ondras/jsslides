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
		token: "string",
		re: /(`[\s\S]*?`)/g,
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

	var keywords = ["as", "break", "case", "catch", "class", "continue", "default", "delete", "do", "else",
		"export", "finally", "for", "from", "function", "if", "in", "instanceof", "import", "new", "return",
		"switch", "this", "throw", "try", "typeof", "var", "void", "while", "with", "__proto__",
		"true", "false", "null", "NaN", "prototype", "call", "apply", "constructor",
		"let", "const", "class", "extends", "=&gt;"];

	var kw = new RegExp("(^|\\s|:|\\.|\\()("+keywords.join("|")+")(?=[\\s\\.\\(\\)\\[\\];$,{}])","gm");
	patterns.push({
		token: "keyword",
		re: kw,
		index: 2
	});

	Syntax.register("js", patterns);
})();
