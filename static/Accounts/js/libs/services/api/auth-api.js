import FetchService from '/static/Accounts/js/libs/services/FetchService.js';
import FormUtils from '/static/Accounts/js/libs/utils/FormUtils.js';

// Prepare utils
const fetchService = new FetchService();
const formUtils = new FormUtils();

// Gets auth token from cookies, and checks if it's expired.
// Notice: Does not actually contact the AuthServer. This is clientside only..
// Will return a Claims object if success, or null if failed.
export function GetAuthClaims() {
  // Check if the client is Logged in (has a valid JWT saved in storage)
  const jwt = localStorage.getItem("pn-jwt");
  // If no JWT saved, fail.
  if(jwt == null){
    console.log("You are not logged in.");
    return null;
  }

  // convert JWT body to base64.
  const body_base64 = atob(jwt.split(".")[1]);
  // convert b64 to JSON
  const body = JSON.parse(body_base64);

  // compare expiration timestamp of the auth token.
  const currTime = new Date().getTime() / 1000;
  // if expired, return null
  if(currTime >= body.exp){
    console.log("Session expired.");
    return null;
  }

  // return claims as a json obj.
  console.log(body);
  return body;
}

// Searches for users based on a search form.
// Returns the response.
export async function SearchUsers(searchQuery, startUsername, reverse, pageSize) {
  // Send the post request
  const response = await fetchService.performPostHttpRequest("https://auth.pyroneon.ml:8443/api/search-username",
                                                              formUtils.buildHeaders(),
                                                              {"search":searchQuery, "start_username":startUsername, "reverse":reverse, "page_size":pageSize});
  return response;
}
