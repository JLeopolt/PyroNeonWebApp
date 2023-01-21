import FetchService from '/static/Accounts/js/libs/services/FetchService.js';
import FormUtils from '/static/Accounts/js/libs/utils/FormUtils.js';
import AlertPopup from '/static/Accounts/js/libs/utils/AlertPopup.js';

const fetchService = new FetchService();
const formUtils = new FormUtils();
const alertPopup = new AlertPopup();

// Call submitForm() on form submission.
const login_submit_form = document.querySelector("#login_submit_form");
if(login_submit_form){
  login_submit_form.addEventListener("submit", function(e) {
    submitForm(e, this);
  });
}

async function submitForm(e, form){
  // Prevent reloading page
  e.preventDefault();
  // Deactivate the submit button for a few seconds.
  const submit_button = document.getElementById("loginSubmitButton");
  formUtils.disableButton(submit_button);
  // Build an object from the form data.
  const jsonFormData = formUtils.buildJsonFormData(form);
  // Check if the json is valid.
  const errorMessage = validateForm(jsonFormData);
  if(errorMessage){
    // Spit out the error message and cancel.
    alertPopup.createAlertPopup("warning", errorMessage);
    return;
  }

  // Prepare headers
  const headers = formUtils.buildHeaders();
  // Send the post request and get a JSON String as a response.
  const response = await fetchService.performPostHttpRequest("https://auth.pyroneon.ml:8443/api/authenticate", headers, jsonFormData);
  console.log(response);
  // Convert the HTTP Status into a single digit, representing response type.
  const statusType = String(response.status)[0];
  // Successful responses
  if(statusType === "2"){
    // JWT as string
    const jwt = response.jwt;
    // Save the jwt to localstorage.
    localStorage.setItem("pn-jwt", jwt);

    // Account manager page
    alertPopup.createAlertPopup("success", "Successfully logged in. Redirecting you..");
    setTimeout(() => {
      window.location.href = "/accounts/account-dashboard";}, 1000);
  }
  // Client error
  else if(statusType === "4"){
    // If it has an errorMessage
    var error = response.errorMessage;
    if(error == null){
      // If it has an error
      error = response.error;
    }
    alertPopup.createAlertPopup("error", error);
  }
  // Server errors, or other.
  else {
    alertPopup.createAlertPopup("warning", "Status: " + response.status + ": " +response.statusMessage);
  }
}

function validateForm(form){
  // If missing parameters, notify the user and fail the attempt before requesting the API.
  const errorMessage = formUtils.validateForm(form, ["username","password"]);
  if(errorMessage){
    // Return the error message.
    return errorMessage;
  }
  // If successful, return nothing.
  return null;
}
