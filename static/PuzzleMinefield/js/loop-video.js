document.getElementsByTagName('backgroundVideo')[0].onended = function () {
  this.load();
  this.play();
};
