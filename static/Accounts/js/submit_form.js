import FetchService from '/static/Accounts/js/libs/services/FetchService.js';
import FormUtils from '/static/Accounts/js/libs/utils/FormUtils.js';
import AlertPopup from '/static/Accounts/js/libs/utils/AlertPopup.js';
import {AUTH_ENDPOINT} from '/static/Accounts/js/libs/services/api/endpoints.js';

const fetchService = new FetchService();
const formUtils = new FormUtils();
const alertPopup = new AlertPopup();

// Call submitForm() on form submission.
const register_submit_form = document.querySelector("#register_submit_form");
if(register_submit_form){
  register_submit_form.addEventListener("submit", function(e) {
    submitForm(e, this);
  });
}

async function submitForm(e, form){
  // Prevent reloading page
  e.preventDefault();
  // Deactivate the submit button for a few seconds.
  const submit_button = document.getElementById("registerSubmitButton");
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
  // Don't need to send this.
  delete jsonFormData.confirm_password;

  // Prepare headers
  const headers = formUtils.buildHeaders();
  // Send the post request and get a JSON String as a response.
  const response = await fetchService.performPostHttpRequest(AUTH_ENDPOINT+"register", headers, jsonFormData);
  console.log(response);
  // Convert the HTTP Status into a single digit, representing response type.
  const statusType = String(response.status)[0];
  // Successful responses
  if(statusType === "2"){
    window.location.href = "/accounts/email/account-created-success";
  }
  // Client error
  else if(statusType === "4"){
    alertPopup.createAlertPopup("error", response.errorMessage);
  }
  // Server errors, or other.
  else {
    alertPopup.createAlertPopup("warning", "Status: " + response.status + ": " +response.statusMessage);
  }
}

function validateForm(form){
  // If missing parameters, notify the user and fail the attempt before requesting the API.
  const errorMessage = formUtils.validateForm(form, ["username","password","confirm_password","email_address"]);
  if(errorMessage){
    // Return the error message.
    return errorMessage;
  }
  // If password doesn't match confirm password.
  else if(form.password !== form.confirm_password){
    return "Confirm password doesn't match password.";
  }
  // If successful, return nothing.
  return null;
}
