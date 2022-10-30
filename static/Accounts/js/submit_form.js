import FetchService from './services/FetchService.js';

const fetchService = new FetchService();

async function submitForm(e, form){
  // Prevent reloading page
  e.preventDefault();

  // Deactivate the button for a few seconds.
  const submit_button = document.getElementById("registerSubmitButton");
  submit_button.disabled = true;
  submit_button.style.filter = "brightness(75%)";
  setTimeout(() => {
    submit_button.disabled = false;
    submit_button.style.filter = "none";}, 2000);

  // Build a map from the form data.
  const jsonFormData = buildJsonFormData(form);

  // Check if the json is valid.
  const errorMessage = validateForm(jsonFormData);
  if(errorMessage){
    // Spit out the error message and cancel.
    createAlertPopup("warning", errorMessage);
    return;
  }
  // Don't need to send this.
  delete jsonFormData.confirm_password;
  // Prepare headers
  const headers = buildHeaders();
  // Send the post request and get a JSON String as a response.
  const response = await fetchService.performPostHttpRequest("https://auth.pyroneon.ml:8443/api/register", headers, jsonFormData);
  console.log(response);

  // Convert the HTTP Status into a single digit, representing response type.
  const statusType = String(response.status)[0];

  // Successful responses
  if(statusType === "2"){
    window.location.href = "/accounts/account-created-success";
  }
  // Client error
  else if(statusType === "4"){
    createAlertPopup("error", response.errorMessage);
  }
  // Server errors, or other.
  else {
    createAlertPopup("warning", "Status: " + response.status + ": " +response.statusMessage);
  }
}

function buildJsonFormData(form){
  const jsonFormData = { };
  for(const pair of new FormData(form)){
    jsonFormData[pair[0]] = pair[1];
  }
  return jsonFormData;
}

function buildHeaders(authorization = null) {
    const headers = {
        "Content-Type": "application/json",
        // "Authorization": (authorization) ? authorization : "Bearer TOKEN_MISSING"
    };
    return headers;
}

// Confirms the form is filled out, and the password & confirm password match.
function validateForm(form){
  // If missing parameters, notify the user and fail the attempt before requesting the API.
  if(!form.username){
    return "Please enter a username.";
  }
  else if(!form.password){
    return "Please enter a password.";
  }
  else if(!form.confirm_password){
    return "Please confirm your password.";
  }
  else if(!form.email_address){
    return "Please enter an email address.";
  }
  // If password doesn't match confirm password.
  else if(form.password !== form.confirm_password){
    return "Confirm password doesn't match password.";
  }
  // If successful, return nothing.
  return null;
}

function createAlertPopup(type, message){
  const alert = document.getElementsByClassName("alert")[0];
  // Make the display visible.
  alert.style.display = "flex";
  // Set the background color of the alert.
  if(type === "error"){
    alert.style.backgroundColor = "#f44336";
  }
  else if(type === "warning"){
    alert.style.backgroundColor = "#EE7D00";
  }
  else if(type === "info"){
    alert.style.backgroundColor = "#2196F3";
  }
  else if(type === "success"){
    alert.style.backgroundColor = "#04AA6D";
  }
  // Set the message content of the alert.
  // alert.firstChild.textContent = message;
  alert.getElementsByClassName("alert_message")[0].textContent = message;
  window.location.href = '#alert_box';
}

const register_submit_form = document.querySelector("#register_submit_form");
if(register_submit_form){
  register_submit_form.addEventListener("submit", function(e) {
    submitForm(e, this);
  });
}
