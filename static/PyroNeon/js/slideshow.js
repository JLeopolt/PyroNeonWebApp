let slideIndex = 1;
let slideInterval;
showSlides(slideIndex);
scheduleSlideshow();

// Restarts the slideshow at an interval of 3 Seconds.
function scheduleSlideshow(){
  if(slideInterval != null){
    clearInterval(slideInterval);
  }
  slideInterval = setInterval(forwardSlide, 4000);
}

// Next/previous controls, also resets the slideshow timer.
function plusSlides(n) {
  showSlides(slideIndex += n);
  scheduleSlideshow();
}

function showSlides(n) {
  let i;
  // Get slides/dots
  let slides = document.getElementsByClassName("slide");
  let dots = document.getElementsByClassName("dot");

  // Keep everything w/in bounds
  if (n > slides.length) {
    slideIndex = 1
  }
  if (n < 1) {
    slideIndex = slides.length
  }

  // Reset slides
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  // Reset dots
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  // Set the correct slides/dots
  dots[slideIndex-1].className += " active";
  slides[slideIndex-1].style.display = "block";
}

function forwardSlide() {
  slideIndex++;
  showSlides(slideIndex);
}
