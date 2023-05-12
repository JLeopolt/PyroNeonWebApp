import { SetupAccountsHeader } from '/static/Accounts/js/accounts_header.js';
import { GetAuthClaims } from '/static/Accounts/js/libs/services/api/auth-api.js';

// The main function which performs all setup for the page.
export function GenerateFriendsPage(){
  // Async get auth claims
  GetAuthClaims().then((claims) => {
    // setup account header
    SetupAccountsHeader(claims);

    // if not logged in, redirect.
    if(claims == null){
      console.log("You must be logged in to view your friends list.");
      window.location.href = "/missing";
      return;
    }
    // generate the page here.
    generatePage(claims);
  });
}

// Generates elements for the page and performs setup.
function generatePage(claims){
  // Disable the loading animation.
  document.getElementsByClassName("lds-roller")[0].style.display = "none";
  // Reveal the page contents.
  document.getElementById("friendsList").style.display = "block";
}
