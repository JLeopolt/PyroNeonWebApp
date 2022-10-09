
var video = document.getElementById('backgroundVideo');
video.onended = (event) => {
  // video.currentTime = 0;
  video.load();
  video.play();
};
