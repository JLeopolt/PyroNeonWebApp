import FetchService from '/static/Accounts/js/libs/services/FetchService.js';
import FormUtils from '/static/Accounts/js/libs/utils/FormUtils.js';

// Automatically checks cookies for auth token, then tries to validate it and return claims.
// Will return a Claims object if success, or null if failed.
export async function GetAuthClaims() {
  // Check if the client is Logged in (has a valid JWT saved in storage)
  const jwt = localStorage.getItem("pn-jwt");

  // If no JWT saved, fail.
  if(jwt == null){
    return null;
  }

  // Prepare utils
  const fetchService = new FetchService();
  const formUtils = new FormUtils();

  // Send the post request, body contains key pair "jwt":<token>
  const response = await fetchService.performPostHttpRequest("https://auth.pyroneon.ml:8443/api/validate", formUtils.buildHeaders(), {"jwt":jwt});
  console.log(response);

  // Convert the HTTP Status into a single digit, representing response type.
  const statusType = String(response.status)[0];

  // Successful responses
  if(statusType === "2"){
    return response.claims;
  }
  else{
    return null;
  }
}

// Searches for users based on a search form.
// Returns the response.
export async function SearchUsers(searchQuery, startUsername, reverse, pageSize) {
  // Prepare utils
  const fetchService = new FetchService();
  const formUtils = new FormUtils();

  // Send the post request
  const response = await fetchService.performPostHttpRequest("https://auth.pyroneon.ml:8443/api/search-username", 
                                                              formUtils.buildHeaders(),
                                                              {"search":searchQuery, "start_username":startUsername, "reverse":reverse, "page_size":pageSize});
  return response;
}
