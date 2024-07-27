// NOTICE: THIS IMPORT SYSTEM IS NOW DEPRECATED!
// Use Jinja2's {% include '' %} to import HTML templates instead.

// This file can be used as a standalone for basic pages.
// or it can be used as a dependency in pages with js buildscripts.

// Use <div data-include="THE HTML FILE'S NAME"></div> to import an html element.
import * as jquery from 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js';

// The import function can be used in a build script for more complex pages.
// callback is the function to call after this is completed. EVERYTHING that
// depends on Imported HTML must be executed in the callback function.
export function ImportHTML(callback) {
  // Get all the 'stubs' in the src html which are asking to include something.
  var includes = $('[data-include]');
  // Store all ajax promises in an array. This will be used for sync stuff.
  var promises = [];
  $.each(includes, function () {
    const currObj = this;
    // Imports HTML files from static/Global/html/ folder.
    var file = '/static/Global/html/' + $(currObj).data('include') + '.html'
    // Add the request promise to the array.
    promises.push(
      // Get a Promise object from the Load Request, which doesn't return one by itself.
      $.Deferred(function(promise){
        // Request the specified file thru an AJAX load request.
        $(currObj).load(file, function (responseText, textStatus, req) {
          // If load request successfully completed.
          if(textStatus === "success"){
            console.log("[import.js] Imported \"" + file + "\".");
          }
          // if load request failed.
          else{
            console.log("[import.js] Failed to import \"" + file + "\".");
          }
          // mark the promise as resolved.
          promise.resolve();
        })
      }).promise()
    );
  });
  console.log("[import.js] Queued all included HTML files.");

  // Execute the callback function provided ONLY AFTER all load requests have finished.
  // The '...' is an ES6 feature which tells the when() to treat promises as a varargs of functs.
  $.when(...promises).done(function(){
    console.log("[import.js] Executing afterInclude function.");
    callback();
  });
}
