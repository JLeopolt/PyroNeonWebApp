// Check if the client has a dark mode setting set, if so copy it. Otherwise set a new setting for Light Mode by default.
// Notice that browsers save booleans as Strings, so treat them as Strings rather than booleans.
const mode = localStorage.getItem("pn-light-mode");

// If no dark mode setting yet, set a default value.
if(mode == null){
  console.log("[toggledarkmode.js] No saved dark mode preference detected. Defaulting to dark mode.");
  localStorage.setItem("pn-light-mode", false);
  mode = 'false';
}

// Otherwise, if the setting is light mode, enable light mode.
if(mode === 'true'){
  // Set the page to dark mode for the client
  let element = document.body;
  // Result is true if dark mode is enabled
  let result = element.classList.toggle("light-mode");
}
