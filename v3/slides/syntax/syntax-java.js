;(function(){
	var patterns = [];
	
	patterns.push({
		token: "string",
		re: /(".*?")/g,
		index: 1
	});
	
	patterns.push({
		token: "string",
		re: /('.')/g,
		index: 1
	});
	
	patterns.push({
		token: "number",
		re: /(^|\s|[-+*\/()])((-|0x|0b)?[0-9]+L?(\.[0-9]+)?[fd]?)/ig,
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

	var keywords = ["abstract", "assert", "boolean", "break", "byte", "case",
		"catch", "char", "class", "const", "continue", "default", "do", "double",
		"else", "enum", "extends", "final", "finally", "float", "for", "goto",
		"if", "implements", "import", "instanceof", "int", "interface", "long",
		"native", "new", "package", "private", "protected", "public", "return",
		"short", "static", "strictfp", "super", "switch", "synchronized", "this",
		"throw", "throws", "transient", "try", "void", "volatile", "while"];

	var kw = new RegExp("(^|\\s|\\.|\\()(" + keywords.join("|") + ")(?=\\s|\\.|\\(|\\)|\\[|\\]|;|$|,)", "gm");
	patterns.push({
		token: "keyword",
		re: kw,
		index: 2
	});
	
	patterns.push({
		token: "classname",
		re: /(^|\s|\()([A-Z][a-zA-Z]*)/g,
		index: 2
	});

	Syntax.register("java", patterns);
})();
