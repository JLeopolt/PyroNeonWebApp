import FetchService from '/static/Accounts/js/libs/services/FetchService.js';
import FormUtils from '/static/Accounts/js/libs/utils/FormUtils.js';
import AlertPopup from '/static/Accounts/js/libs/utils/AlertPopup.js';

const fetchService = new FetchService();
const formUtils = new FormUtils();
const alertPopup = new AlertPopup();

const register_submit_form = document.querySelector("#forgot_password_submit_form");
if(register_submit_form){
  register_submit_form.addEventListener("submit", function(e) {
    submitForm(e, this);
  });
}

async function submitForm(e, form){
  // Prevent reloading page
  e.preventDefault();

  // Deactivate the button for a few seconds.
  const submit_button = document.getElementById("submitForgotPasswordButton");
  formUtils.disableButton(submit_button);

  // Build a map from the form data.
  const jsonFormData = formUtils.buildJsonFormData(form);

  // Check if the json is valid.
  const errorMessage = formUtils.validateForm(jsonFormData,["username", "email_address"]);
  if(errorMessage){
    // Spit out the error message and cancel.
    alertPopup.createAlertPopup("warning", errorMessage);
    return;
  }

  // Prepare headers
  const headers = formUtils.buildHeaders();

  const response = await fetchService.performPostHttpRequest("https://auth.pyroneon.ml:8443/api/forgot_password", headers, jsonFormData);
  console.log(response);

  // Convert the HTTP Status into a single digit, representing response type.
  const statusType = String(response.status)[0];

  // Successful responses
  if(statusType === "2"){
    alertPopup.createAlertPopup("success", response.message);
  }
  // Client error
  else if(statusType === "4"){
    alertPopup.createAlertPopup("error", response.errorMessage);
  }
  // Server errors, or other.
  else {
    alertPopup.createAlertPopup("warning", "Status: " + response.status + ": " + response.statusMessage + ", " +response.errorMessage);
  }
}
