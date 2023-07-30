import FetchService from '/static/Accounts/js/libs/services/FetchService.js';
import FormUtils from '/static/Accounts/js/libs/utils/FormUtils.js';
import AlertPopup from '/static/Accounts/js/libs/utils/AlertPopup.js';

const fetchService = new FetchService();
const formUtils = new FormUtils();
const alertPopup = new AlertPopup();

// Call submitForm() on form submission.
const update_submit_form = document.querySelector("#update_submit_form");
if(update_submit_form){
  update_submit_form.addEventListener("submit", function(e) {
    submitForm(e, this);
  });
}

async function submitForm(e, form){
  // Prevent reloading page
  e.preventDefault();
  // Deactivate the submit button for a few seconds.
  const submit_button = document.getElementById("updateSubmitButton");
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
  delete jsonFormData.confirm_new_password;

  // Prepare headers
  const headers = formUtils.buildHeaders();
  // Send the post request and get a JSON String as a response.
  const response = await fetchService.performPostHttpRequest("https://auth.pyroneon.net:8443/api/update_password", headers, jsonFormData);
  console.log(response);
  // Convert the HTTP Status into a single digit, representing response type.
  const statusType = String(response.status)[0];
  // Successful responses
  if(statusType === "2"){
    // Delete the JWT from localstorage
    localStorage.removeItem("pn-jwt");
    // Notify user of the success, then redirect them to homepage.
    alertPopup.createAlertPopup("success", response.message);
    setTimeout(() => {
      window.location.href = "/accounts/login";}, 1000);
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
  const errorMessage = formUtils.validateForm(form, ["username","password","new_password","confirm_new_password"]);
  if(errorMessage){
    // Return the error message.
    return errorMessage;
  }
  if(form.new_password !== form.confirm_new_password){
    return "Confirm new password doesn't match your new password.";
  }
  // If successful, return nothing.
  return null;
}
