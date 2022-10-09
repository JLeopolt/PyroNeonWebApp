function toggleDisplay(id) {
  var el = document.getElementsByClassName(id)[0];
  if (el && el.style) {
    if(el.style.display === 'none' || el.style.display === ''){
      el.style.display = 'inline-block';
    }
    else{
      el.style.display = 'none';
    }
  }
}
