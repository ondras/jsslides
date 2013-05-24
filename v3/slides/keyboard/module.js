Slides.addKeyListener(function(e) { e.preventDefault(); Slides.prev(); }, [8, 37, 33], "Previous slide");
Slides.addKeyListener(function(e) { e.preventDefault(); Slides.next(); }, [32, 39, 34], "Next slide");
Slides.addKeyListener(function(e) { e.preventDefault(); Slide.show(Slides.slides[0]); }, 36, "First slide");
Slides.addKeyListener(function(e) { e.preventDefault(); Slide.show(Slides.slides[Slides.slides.length-1]); }, 35, "Last slide");
