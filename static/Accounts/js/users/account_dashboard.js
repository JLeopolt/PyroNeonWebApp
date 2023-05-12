import FetchService from '../libs/services/FetchService.js';
import FormUtils from '../libs/utils/FormUtils.js';

// On load, check if the client is Logged in (has a valid JWT saved in storage)
const jwt = localStorage.getItem("pn-jwt");

if(!jwt){
  // No JWT was found, so redirect them to the login page.
  window.location.href = "/accounts/login";
}
else{
  // Validate the JWT.
  validateJWT(jwt);
}

async function validateJWT(jwt){
  // Prepare utils
  const fetchService = new FetchService();
  const formUtils = new FormUtils();
  // Prepare headers
  const headers = formUtils.buildHeaders();
  // Send the post request, body contains key pair "jwt":<token>
  const response = await fetchService.performPostHttpRequest("https://auth.pyroneon.ml:8443/api/validate", headers, {"jwt":jwt});
  console.log(response);
  // Convert the HTTP Status into a single digit, representing response type.
  const statusType = String(response.status)[0];
  // Successful responses
  if(statusType === "2"){
    const claims = response.claims;
    // Adopt the jwt, the user is validated.
    generateAccountDashboard(claims);
  }
  else{
    // Invalid JWT, send them to the login page.
    window.location.href = "/accounts/login";
  }
}

// Called when the JWT has been verified and the dashboard must be generated.
function generateAccountDashboard(claims){
  document.getElementsByClassName("lds-roller")[0].style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  updateSpans("set-to-username", claims.username);
}

// Updates all instances of the class to contain newText.
function updateSpans(className, newText){
  const toUpdate = document.getElementsByClassName(className);
  for(var i = 0; i < toUpdate.length; i++){
    toUpdate[i].textContent = newText;
  }
}
