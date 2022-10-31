import FetchService from '../libs/services/FetchService.js';
import FormUtils from '../libs/utils/FormUtils.js';
import AlertPopup from '../libs/utils/AlertPopup.js';

const formUtils = new FormUtils();
const alertPopup = new AlertPopup();

// Call submitForm() on form submission.
const username_submit_form = document.querySelector("#username_submit_form");
if(username_submit_form){
  username_submit_form.addEventListener("submit", function(e) {
    submitForm(e, this);
  });
}

async function submitForm(e, form){
  // Prevent reloading page
  e.preventDefault();
  // Deactivate the submit button for a few seconds.
  const submit_button = document.getElementById("submitActivationCode");
  formUtils.disableButton(submit_button);
  // Build an object from the form data.
  const jsonFormData = formUtils.buildJsonFormData(form);

  validateToken(jsonFormData.token);
}

async function validateToken(token){
  if(token){
    const fetchService = new FetchService();
    const headers = formUtils.buildHeaders();

    const response = await fetchService.performGetHttpRequest("https://auth.pyroneon.ml:8443/api/activate?token="+token, headers);
    console.log(response);

    const statusType = String(response.status)[0];

    if(statusType === "2"){
      alertPopup.createAlertPopup("success", response.message);
      setTimeout(() => {
        window.location.href = "/accounts/login";}, 1000);
      return;
    }
    alertPopup.createAlertPopup("error", response.errorMessage);
    return;
  }
  alertPopup.createAlertPopup("warning", "No token was provided.");
}
