// This file can be used as a standalone for basic pages.
// or it can be used as a dependency in pages with js buildscripts.

// Use <div data-include="THE HTML FILE'S NAME"></div> to import an html element.
import * as jquery from 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js';

// The import function can be used in a build script for more complex pages.
export function ImportHTML() {
  var includes = $('[data-include]')
  $.each(includes, function () {
    // Imports HTML files from static/Global/html/ folder.
    var file = '/static/Global/html/' + $(this).data('include') + '.html'
    console.log("Imported \"" + file + "\".");
    $(this).load(file)
  })
}
