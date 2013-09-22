(function() {
	var remote = null;
	var auth = null;

	var state = {
		slide: -1,
		section: -1
	}
	
	var changeLocal = function() {
		var slide = Slides.slides.indexOf(Slides.current);
		var section = Slides.current.index;
		
		if (slide != state.slide || section != state.section) {
			state.slide = slide;
			state.section = section;
			remote.set(state);
		}
	}
	
	var changeRemote = function(snap) {
		var val = snap.val() || {};
		var slide = val.slide || 0;
		var section = val.section || 0;
		if (slide != state.slide || section != state.section) {
			state.slide = slide;
			state.section = section;
			Slides.show(Slides.slides[slide], section);
		}
	}
	
	Slides.addScript("https://cdn.firebase.com/v0/firebase.js").onload = function() {
		remote = new Firebase(Slides.modules.firebase.url);
		remote.on("value", changeRemote);
	}
	
	if (Slides.modules.firebase.write) {
		Slides.addChangeListener(changeLocal);
	}
	
	if (Slides.modules.firebase.auth) {
		Slides.addScript("https://cdn.firebase.com/v0/firebase-simple-login.js").onload = function() {
			var auth = new FirebaseSimpleLogin(remote, function(){});
			auth.login(Slides.modules.firebase.auth, {rememberMe:true});
		}
	}
})();
