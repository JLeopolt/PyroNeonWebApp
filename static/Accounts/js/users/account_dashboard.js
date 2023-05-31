import { UpdateSpans } from '/static/Accounts/js/libs/utils/update-elements.js';

// Called when the JWT has been verified and the dashboard must be generated.
export function GeneratePage(claims){
  UpdateSpans("set-to-username", claims.username);
  // set the profile to redirect to profile page of this user.
  document.getElementById("myProfileButton").href="/accounts/profile?user="+claims.uuid;
}
