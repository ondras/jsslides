Slides.addKeyListener(function(e) { e.preventDefault(); Slides.prev(); }, [8, 33, 37, 38], "Previous slide");
Slides.addKeyListener(function(e) { e.preventDefault(); Slides.next(); }, [32, 34, 39, 40], "Next slide");
Slides.addKeyListener(function(e) { e.preventDefault(); Slides.show(Slides.slides[0]); }, 36, "First slide");
Slides.addKeyListener(function(e) { e.preventDefault(); Slides.show(Slides.slides[Slides.slides.length-1]); }, 35, "Last slide");
