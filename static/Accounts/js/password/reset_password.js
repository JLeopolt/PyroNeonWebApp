import FetchService from '/static/Accounts/js/libs/services/FetchService.js';
import FormUtils from '/static/Accounts/js/libs/utils/FormUtils.js';

const formUtils = new FormUtils();

// Get the confirmation token from the URL.
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
let username = params.username;
let emailAddress = params.emailAddress
let token = params.token;
sendTemporaryPassword(username, emailAddress, token);

async function sendTemporaryPassword(username, emailAddress, token){
  if(token){
    const fetchService = new FetchService();
    const headers = formUtils.buildHeaders();

    const response = await fetchService.performGetHttpRequest("https://auth.pyroneon.ml:8443/api/reset_password?username="+username+"&emailAddress="+emailAddress+"&token="+token, headers);
    console.log(response);

    const statusType = String(response.status)[0];
    // If OK, then leave the email confirmation as successful.
    if(statusType === "2"){
      return;
    }
  }
  // If no token provided, or rejected by API, fail confirmation.
  failedToConfirm();
}

function failedToConfirm(){
  // Notify the user that their email confirmation token was invalid.
  // Set background to red.
  document.getElementsByTagName("body")[0].style = "background: linear-gradient(10deg, rgba(255,123,123,1) 0%, rgba(180,0,0,1) 100%); background-attachment: fixed; background-repeat: no-repeat;";
  document.getElementsByTagName("h1")[0].textContent = "Invalid Reset Password Token";
  document.getElementsByClassName("paragraph")[0].getElementsByTagName("p")[0].textContent = "Your link is either expired or broken. No temporary password was generated.";
}
