import FetchService from '/static/Accounts/js/libs/services/FetchService.js';
import FormUtils from '/static/Accounts/js/libs/utils/FormUtils.js';

// Prepare utils
const fetchService = new FetchService();
const formUtils = new FormUtils();
const friendsEndpoint = "https://games.pyroneon.net/api/";

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
    friendsEndpoint + "friends/get-friendship",
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
    friendsEndpoint + "friends/issue-request",
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
    friendsEndpoint + "friends/accept-request",
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
    friendsEndpoint + "friends/remove-friend",
  formUtils.buildHeaders(),{"auth_token":jwt,"other_id":target_uuid});
  // process response. may return true/false.
  return processResponse(response);
}

// Gets JWT from cookies, either rejects all friendships / friend requests.
// isAccepted determines if selecting pending or accepted friendships.
// sent_by_friend is used to specify if the requests were made by you, or by the friend. May be null.
// startId is used for pagination. If startId is null, starts from 0.
// reverse is used for pagination. If reverse is true, gets elements in reverse order. If false or null, uses forward order.
// Returns a JSON Array of friends, or null.
export async function GetFriendsList(pageSize, isAccepted, sent_by_friend, startId, reverse) {
  // Check if the client is Logged in (has a valid JWT saved in storage)
  const jwt = localStorage.getItem("pn-jwt");
  // If no JWT saved, fail.
  if(jwt == null){
    return null;
  }
  // Send the post request with body.
  const response = await fetchService.performPostHttpRequest(
    friendsEndpoint + "friends/list-friends",
  formUtils.buildHeaders(),{"auth_token":jwt, "was_accepted":isAccepted, "start_uuid":startId, "reverse":reverse, "sent_by_friend":sent_by_friend, "page_size":pageSize});
  // process response.
  if(processResponse(response)){
    return response.friends;
  }
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
