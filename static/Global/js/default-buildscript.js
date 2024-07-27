// NOTICE: THIS IMPORT SYSTEM IS NOW DEPRECATED!
// Use Jinja2's {% include '' %} to import HTML templates instead.

// This script can be used for default pages with simple JS, which doesn't require a custom buildscript.
import { GetAuthClaims } from '/static/Accounts/js/libs/services/api/auth-api.js';
import { ImportHTML } from '/static/Global/js/import.js';
import { SetupAccountsHeader } from '/static/Accounts/js/accounts_header.js';

// Get auth token claims
const claims = GetAuthClaims();

// Import HTML when page 'ready', with the afterInclude() function as a callback.
// afterInclude() will only be executed after ALL HTML elements are guaranteed to be loaded.
$(ImportHTML(afterInclude));

// Code in this function will only be executed after ALL HTML elements are guaranteed to be loaded.
function afterInclude(){
  // setup account header
  SetupAccountsHeader(claims);
}
