// Updates all instances of the class to contain newText.
export function UpdateSpans(className, newText){
  const toUpdate = document.getElementsByClassName(className);
  for(var i = 0; i < toUpdate.length; i++){
    toUpdate[i].textContent = newText;
  }
}

// Updates all instances of the class to contain newText.
export function UpdateLinks(className, newText){
  const toUpdate = document.getElementsByClassName(className);
  for(var i = 0; i < toUpdate.length; i++){
    toUpdate[i].href = newText;
    toUpdate[i].textContent = newText;
  }
}

// Updates all instances of the class to the visibility mode. Use "block" or "none"
export function UpdateSpansVisibility(className, display){
  const toUpdate = document.getElementsByClassName(className);
  for(var i = 0; i < toUpdate.length; i++){
    toUpdate[i].style.display = display;
  }
}
