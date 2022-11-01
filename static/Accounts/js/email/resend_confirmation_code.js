import FetchService from '../libs/services/FetchService.js';
import FormUtils from '../libs/utils/FormUtils.js';
import AlertPopup from '../libs/utils/AlertPopup.js';

const fetchService = new FetchService();
const formUtils = new FormUtils();
const alertPopup = new AlertPopup();

const register_submit_form = document.querySelector("#username_submit_form");
if(register_submit_form){
  register_submit_form.addEventListener("submit", function(e) {
    submitForm(e, this);
  });
}

async function submitForm(e, form){
  // Prevent reloading page
  e.preventDefault();

  // Deactivate the button for a few seconds.
  const submit_button = document.getElementById("submitUsernameButton");
  formUtils.disableButton(submit_button);

  // Build a map from the form data.
  const jsonFormData = formUtils.buildJsonFormData(form);

  // Check if the json is valid.
  const errorMessage = formUtils.validateForm(jsonFormData,["username"]);
  if(errorMessage){
    // Spit out the error message and cancel.
    alertPopup.createAlertPopup("warning", errorMessage);
    return;
  }

  // Prepare headers
  const headers = formUtils.buildHeaders();

  const response = await fetchService.performGetHttpRequest("https://auth.pyroneon.ml:8443/api/resend-confirmation-code?un="+jsonFormData.username, headers);
  console.log(response);

  // Convert the HTTP Status into a single digit, representing response type.
  const statusType = String(response.status)[0];

  // Successful responses
  if(statusType === "2"){
    window.location.href = "/accounts/email/enter-manual-confirmation-code";
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
