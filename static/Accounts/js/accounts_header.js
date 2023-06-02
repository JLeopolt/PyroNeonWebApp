import FetchService from '/static/Accounts/js/libs/services/FetchService.js';
import FormUtils from '/static/Accounts/js/libs/utils/FormUtils.js';

// Sets up the account header. If claims is null, uses Guest header.
// Be careful not to provide a promise here.
export function SetupAccountsHeader(claims) {
    if(claims != null){
      loadAsUser(claims);
    }
    else{
      loadAsGuest();
    }
}

function loadAsGuest(){
  document.getElementById("headerLoginButton").style.display = "inline-block";
  document.getElementById("headerRegisterButton").style.display = "inline-block";
  document.getElementById("headerLogoutButton").style.display = "none";
  document.getElementById("headerDashboardButton").style.display = "none";
}

function loadAsUser(claims){
  updateSpans("set-to-username",claims.username);
  document.getElementById("headerLoginButton").style.display = "none";
  document.getElementById("headerRegisterButton").style.display = "none";
  document.getElementById("headerLogoutButton").style.display = "inline-block";
  document.getElementById("headerDashboardButton").style.display = "inline-block";
}

// Updates all instances of the class to contain newText.
function updateSpans(className, newText){
  const toUpdate = document.getElementsByClassName(className);
  for(var i = 0; i < toUpdate.length; i++){
    toUpdate[i].textContent = newText;
  }
}
