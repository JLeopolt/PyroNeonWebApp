import FetchService from '/static/Accounts/js/libs/services/FetchService.js';
import FormUtils from '/static/Accounts/js/libs/utils/FormUtils.js';

// Prepare utils
const fetchService = new FetchService();
const formUtils = new FormUtils();

// Gets JWT from cookies, asks Friends API if the authenticated user is friends with UUID.
// Will return a Friendship object if success, or null if failed.
export async function GetFriendship(target_uuid) {
  // Check if the client is Logged in (has a valid JWT saved in storage)
  const jwt = localStorage.getItem("pn-jwt");
  // If no JWT saved, fail.
  if(jwt == null){
    return null;
  }
  // Send the post request with body.
  const response = await fetchService.performPostHttpRequest(
    "https://games.pyroneon.ml:6950/api/friends/get-friendship",
  formUtils.buildHeaders(),{"auth_token":jwt,"other_id":target_uuid});
  // process response.
  if(processResponse(response) == true){
    return response.friendship;
  }
  return null;
}

// Gets JWT from cookies, issues a new friend request.
// Returns true if successful, false otherwise.
export async function SendFriendRequest(target_uuid) {
  // Check if the client is Logged in (has a valid JWT saved in storage)
  const jwt = localStorage.getItem("pn-jwt");
  // If no JWT saved, fail.
  if(jwt == null){
    return null;
  }
  // Send the post request with body.
  const response = await fetchService.performPostHttpRequest(
    "https://games.pyroneon.ml:6950/api/friends/issue-request",
  formUtils.buildHeaders(),{"auth_token":jwt,"other_id":target_uuid});
  // process response. may return true/false.
  return processResponse(response);
}

// Gets JWT from cookies, accepts a specific friend request.
// Returns true if successful, false otherwise.
export async function AcceptFriendRequest(target_uuid) {
  // Check if the client is Logged in (has a valid JWT saved in storage)
  const jwt = localStorage.getItem("pn-jwt");
  // If no JWT saved, fail.
  if(jwt == null){
    return null;
  }
  // Send the post request with body.
  const response = await fetchService.performPostHttpRequest(
    "https://games.pyroneon.ml:6950/api/friends/accept-request",
  formUtils.buildHeaders(),{"auth_token":jwt,"other_id":target_uuid});
  // process response. may return true/false.
  return processResponse(response);
}

// Gets JWT from cookies, either rejects a specific friend request, or deletes a friend.
// Returns true if successful, false otherwise.
export async function RemoveFriendship(target_uuid) {
  // Check if the client is Logged in (has a valid JWT saved in storage)
  const jwt = localStorage.getItem("pn-jwt");
  // If no JWT saved, fail.
  if(jwt == null){
    return null;
  }
  // Send the post request with body.
  const response = await fetchService.performPostHttpRequest(
    "https://games.pyroneon.ml:6950/api/friends/remove-friend",
  formUtils.buildHeaders(),{"auth_token":jwt,"other_id":target_uuid});
  // process response. may return true/false.
  return processResponse(response);
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
