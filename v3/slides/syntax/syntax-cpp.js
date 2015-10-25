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
		re: /(\b([1-9]+)(\.)?[0-9]*(llu|lu|ll|l|f|u|e[+-]?[0-9]*)?\b)/ig,
		index: 1
	});

	patterns.push({
		token: "number",
		re: /\b(0x[0-9a-f]+(llu|lu|ll|l|u)?)\b/ig,
		index: 1
	});

	patterns.push({
		token: "number",
		re: /\b(0[0-7]+(llu|lu|ll|l|u)?)\b/ig,
		index: 1
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

        var keywords = [ "alignas", "alignof", "and", "and_eq", "asm", "auto",
            "bitand", "bitor", "bool", "break", "case", "catch", "char",
            "char16_t", "char32_t", "class", "compl", "const", "constexpr",
            "const_cast", "continue", "decltype", "default", "delete", "do",
            "double", "dynamic_cast", "else", "enum", "explicit", "export",
            "extern", "false", "float", "for", "friend", "goto", "if",
            "inline", "int", "long", "mutable", "namespace", "new", "noexcept",
            "not", "not_eq", "nullptr", "operator", "or", "or_eq", "private",
            "protected", "public", "register", "reinterpret_cast", "return",
            "short", "signed", "sizeof", "static", "static_assert",
            "static_cast", "struct", "switch", "template", "this",
            "thread_local", "throw", "true", "try", "typedef", "typeid",
            "typename", "union", "unsigned", "using", "virtual", "void",
            "volatile", "wchar_t", "while", "xor", "xor_eq", "final", "override"];

	var kw = new RegExp("(^|\\s|:|\\.|\\(|!)("+keywords.join("|")+")(?=[\\s\\.\\(\\)\\[\\]:;$,{}])","gm");
	patterns.push({
		token: "keyword",
		re: kw,
		index: 2
	});

        var macro = [ "#include", "#define", "#undef", "#if", "#ifdef",
            "#ifndef", "#error", "#warning", "__FILE__", "__LINE__",
            "__DATE__", "__TIME__", "__TIMESTAMP__", "pragma",
            "FILE", "NULL", "__PRETTY_FUNCTION__"];

	var mc = new RegExp("(^|\\s|:|\\.|\\(|!)("+macro.join("|")+")(?=[\\s\\.\\(\\)\\[\\];$,{}])","gm");
	patterns.push({
		token: "macro",
		re: mc,
		index: 2
	});

	Syntax.register("cpp", patterns);
})();

