import FetchService from '/static/Accounts/js/libs/services/FetchService.js';
import FormUtils from '/static/Accounts/js/libs/utils/FormUtils.js';

// Prepare utils
const fetchService = new FetchService();
const formUtils = new FormUtils();

// Gets JWT from cookies, updates the profile bio.
// return response.
export async function UpdateProfileBio(content) {
  // Check if the client is Logged in (has a valid JWT saved in storage)
  const jwt = localStorage.getItem("pn-jwt");
  // If no JWT saved, fail.
  if(jwt == null){
    return null;
  }
  // Send the post request with body.
  const response = await fetchService.performPostHttpRequest(
    "https://auth.pyroneon.ml:8443/api/profile/update-bio",
  formUtils.buildHeaders(),{"auth_token":jwt,"content":content});
  // return response.
  return response;
}

// Gets JWT from cookies, updates the profile personal website link.
// return response.
export async function UpdateProfileWebsiteLink(content) {
  // Check if the client is Logged in (has a valid JWT saved in storage)
  const jwt = localStorage.getItem("pn-jwt");
  // If no JWT saved, fail.
  if(jwt == null){
    return null;
  }
  // Send the post request with body.
  const response = await fetchService.performPostHttpRequest(
    "https://auth.pyroneon.ml:8443/api/profile/update-personal-website",
  formUtils.buildHeaders(),{"auth_token":jwt,"content":content});
  // return response.
  return response;
}

// Gets JWT from cookies, updates the profile location.
// return response.
export async function UpdateProfileLocation(content) {
  // Check if the client is Logged in (has a valid JWT saved in storage)
  const jwt = localStorage.getItem("pn-jwt");
  // If no JWT saved, fail.
  if(jwt == null){
    return null;
  }
  // Send the post request with body.
  const response = await fetchService.performPostHttpRequest(
    "https://auth.pyroneon.ml:8443/api/profile/update-location",
  formUtils.buildHeaders(),{"auth_token":jwt,"content":content});
  // return response.
  return response;
}

// Checks if a response returned successfully.
// Returns true or false.
function processResponse(response){
  console.log(response);
  // Convert the HTTP Status into a single digit, representing response type.
  const statusType = String(response.status)[0];
  // Successful responses
  if(statusType === "2"){
    return true;
  }
  else{
    return false;
  }
}
