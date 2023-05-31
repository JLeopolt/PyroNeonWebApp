import { UpdateSpans } from '/static/Accounts/js/libs/utils/update-elements.js';

// The main function which performs all setup for the page.
export function GeneratePage(claims){
  // if not logged in, redirect.
  if(claims == null){
    // No JWT was found, so redirect them to the login page.
    window.location.href = "/accounts/login";
    return;
  }
  // perform any remaining setup for the page using claims.
  generateAccountDashboard(claims);
}

// Called when the JWT has been verified and the dashboard must be generated.
function generateAccountDashboard(claims){
  UpdateSpans("set-to-username", claims.username);
  // set the profile to redirect to profile page of this user.
  document.getElementById("myProfileButton").href="/accounts/profile?user="+claims.uuid;
}
