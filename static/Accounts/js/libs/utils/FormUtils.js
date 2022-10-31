export default class FormUtils {
    constructor() {}

    // Temporarily disables a form button.
    disableButton(submit_button){
      submit_button.disabled = true;
      submit_button.style.filter = "brightness(75%)";
      setTimeout(() => {
        submit_button.disabled = false;
        submit_button.style.filter = "none";}, 2000);
    }

    // Converts an html form submission into a JS Object
    buildJsonFormData(form){
      const jsonFormData = { };
      for(const pair of new FormData(form)){
        jsonFormData[pair[0]] = pair[1];
      }
      return jsonFormData;
    }

    // Prepares headers for an API request.
    buildHeaders(authorization = null) {
        const headers = {
            "Content-Type": "application/json",
            // "Authorization": (authorization) ? authorization : "Bearer TOKEN_MISSING"
        };
        return headers;
    }

    // Checks if all required keys exist within a form. Returns null if successful, or an error message otherwise.
    validateForm(form, requiredKeys) {
      // For every key
      for(var i = 0; i < requiredKeys.length; i++) {
        // If the key is NOT in the form
        if(!form[requiredKeys[i]]){
          return "Please enter your "+requiredKeys[i];
        }
      }
      // If all keys were found, return nothing.
      return null;
    }
}
