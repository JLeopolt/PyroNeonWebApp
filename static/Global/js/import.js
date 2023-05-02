// Import this file as a script alongside jQuery,
// then use <div data-include="THE HTML FILE'S NAME"></div> to import an html element.

import * as jquery from 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js';

$(function () {
  var includes = $('[data-include]')
  $.each(includes, function () {
    // Imports HTML files from static/Global/html/ folder.
    var file = '/static/Global/html/' + $(this).data('include') + '.html'
    $(this).load(file)
  })
})
