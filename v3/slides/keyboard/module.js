Slides.addKeyListener(function(e) { Slides.prev(false); }, [8, 37, 38], "Previous slide/section");
Slides.addKeyListener(function(e) { Slides.next(false); }, [32, 39, 40], "Next slide/section");
Slides.addKeyListener(function(e) { Slides.prev(true); }, 33, "Previous/next slide");
Slides.addKeyListener(function(e) { Slides.next(true); }, 34, "Previous/next slide");
Slides.addKeyListener(function(e) { Slides.show(Slides.slides[0]); }, 36, "First/last slide");
Slides.addKeyListener(function(e) { Slides.show(Slides.slides[Slides.slides.length-1]); }, 35, "First/last slide");
