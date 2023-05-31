import FetchService from '/static/Accounts/js/libs/services/FetchService.js';
import DateUtil from '/static/Accounts/js/libs/utils/date-util.js';
import { UpdateSpans, UpdateLinks, UpdateSpansVisibility } from '/static/Accounts/js/libs/utils/update-elements.js';
import { EnableFriendshipControls, DisableFriendshipControls } from '/static/Accounts/js/users/friend-controls.js';
import { UpdateProfileBio, UpdateProfileWebsiteLink, UpdateProfileLocation } from '/static/Accounts/js/libs/services/api/profile-api.js';
import AlertPopup from '/static/Accounts/js/libs/utils/AlertPopup.js';

let alertPopup = new AlertPopup();
let userProfileData = undefined;

// The main function which performs all setup for the page.
export function GeneratePage(claims, target_id){
  // Resolve the uuid.
  resolveUUID(target_id);

  // if not logged in , disable friendship panel.
  if(claims == null){
    DisableFriendshipControls();
    return;
  }
  // if own profile, disable friendship panel, and enable Edit mode.
  if(target_id === claims.uuid){
    DisableFriendshipControls();
    // allow user to edit their profile.
    enableEditMode();
    return;
  }

  // Enable the friendship control panel.
  EnableFriendshipControls(target_id);
}

// Asks the Auth API to resolve the provided UUID to a Public User Profile.
async function resolveUUID(uuid){
  // Prepare utils
  const fetchService = new FetchService();
  // Send the get request, url param is the UUID to resolve. No headers.
  const response = await fetchService.performGetHttpRequest("https://auth.pyroneon.ml:8443/api/get-user-profile?uuid="+uuid, {});
  console.log(response);

  // Convert the HTTP Status into a single digit, representing response type.
  const statusType = String(response.status)[0];
  // Successful responses
  if(statusType === "2"){
    userProfileData = response.user;
    generateProfile(response.user);
  }
  else{
    // Invalid UUID. 404
    window.location.href = "/missing";
  }
}

// Called when the User Profile data has been resolved and site is ready to generate.
function generateProfile(userData){
  // Update the page title to specify the username.
  document.title = userData.username + "'s Profile - PyroNeon";

  // Disable the loading animation.
  document.getElementsByClassName("lds-roller")[0].style.display = "none";
  // Reveal the profile contents.
  document.getElementById("profilePage").style.display = "block";

  // Replace all instances of 'include-username' to the username.
  UpdateSpans("include-username", userData.username);
  // Replace all instances to the Bio.
  UpdateSpans("include-user-bio", userData.biography);
  // Replace all instances to the Personal Website.
  UpdateLinks("include-user-website", userData.personal_website);
  // Replace all instances to the Location.
  UpdateSpans("include-user-location", userData.location);

  // Replace all instances to the Date Created. Converts ms to time-since.
  const acctCreatedTime = new Date(userData.date_created);
  // User-friendly timestamp.
  const dateCreatedUserFriendly = acctCreatedTime.toLocaleDateString('en-us',{weekday:"long", year:"numeric", month:"short", day:"numeric"});
  UpdateSpans("include-date-created", dateCreatedUserFriendly);
  // Time elapsed since account was created, ex. '3 months ago'
  const timeSinceCreation = new DateUtil().timeSince(new Date(userData.date_created));
  UpdateSpans("include-time-since-creation", timeSinceCreation + " ago");

  // Set the auto profile banner color.
  autoGenerateBannerBackground(userData.uuid);
}

// Automatically sets the background color of the banner, based on the last 6 digits of the user's UUID.
function autoGenerateBannerBackground(uuid){
  const toUpdate = document.getElementsByClassName("profile-banner");
  for(var i = 0; i < toUpdate.length; i++){
    // Set the background color to UUID digits, use extra 2 digits to set alpha.
    toUpdate[i].style.backgroundColor = "#" + uuid.slice(0,6) + "A5";
  }
}

// Allow the user to edit their profile.
function enableEditMode(){
  // Reveal all profile edit buttons.
  for(var i = 0; i < profileEditButtonIDs.length; i++){
    document.getElementById(profileEditButtonIDs[i]).style.display = "inline-block";
  }
  // add functionality to profile edit buttons.
  setProfileEditButtonEvents();
}

// pencil button IDs
let profileContentSpans = ["include-user-bio", "include-user-website", "include-user-location"];
let profileEditButtonIDs = ["editProfileBio","editProfileWebsite","editProfileLocation"];
let profileEditSections = ["profileBioEntry", "profileWebsiteEntry", "profileLocationEntry"];
let userProfileDataFields = ["biography", "personal_website", "location"];

// Adds function to buttons.
function setProfileEditButtonEvents(){
  // Set the initial edit button (the pencil icon) events
  let functions = [function(){revealProfileEditField(0)},
                   function(){revealProfileEditField(1)},
                   function(){revealProfileEditField(2)}];
  // add the functions to buttons.
  for(var i = 0; i < profileEditButtonIDs.length; i++){
    document.getElementById(profileEditButtonIDs[i]).onclick = functions[i];
  }

  // Set the cancel buttons within the edit sections.
  let cancelFunctions = [function(){hideProfileEditField(0)},
                   function(){hideProfileEditField(1)},
                   function(){hideProfileEditField(2)}];
  // add the functions to cancel buttons.
  for(var i = 0; i < profileEditSections.length; i++){
    // target the Cancel button from the edit section.
    document.getElementById(profileEditSections[i]).getElementsByClassName("redButton")[0].onclick = cancelFunctions[i];
  }

  // Set the cancel buttons within the edit sections.
  let submitFunctions = [function(){submitProfileEdit(UpdateProfileBio, 0)},
                   function(){submitProfileEdit(UpdateProfileWebsiteLink, 1)},
                   function(){submitProfileEdit(UpdateProfileLocation, 2)}];
  // add the functions to cancel buttons.
  for(var i = 0; i < profileEditSections.length; i++){
    // target the Cancel button from the edit section.
    document.getElementById(profileEditSections[i]).getElementsByClassName("submitButton")[0].onclick = submitFunctions[i];
  }
}

// Called by a profile edit button. Reveals the edit section.
function revealProfileEditField(index){
  // Get the correct elements.
  var spanClass = profileContentSpans[index];
  var sectionId = profileEditSections[index];
  // hide the original span
  UpdateSpansVisibility(spanClass, "none");
  // Set the contents of the edit text box to the current biography.
  document.getElementById(sectionId).getElementsByTagName('textarea')[0].value = userProfileData[userProfileDataFields[index]];
  // set the edit section visible.
  document.getElementById(sectionId).style.display = "block";
}

// Hides the edit section.
function hideProfileEditField(index){
  // Get the correct elements.
  var spanClass = profileContentSpans[index];
  var sectionId = profileEditSections[index];
  // reveal the original span
  UpdateSpansVisibility(spanClass, "inline-block");
  // remove text from the text area.
  document.getElementById(sectionId).getElementsByTagName('textarea')[0].value = "";
  // set the entry section hidden.
  document.getElementById(sectionId).style.display = "none";
}

function submitProfileEdit(submitFunction, index){
  // Get the contents of the text area under the specified edit section.
  var content = document.getElementById(profileEditSections[index]).getElementsByTagName('textarea')[0].value;
  // Execute the submit function, providing Content as the param.
  submitFunction(content).then((response) => {
      const statusType = String(response.status)[0];
      // Successful responses
      if(statusType === "2"){
        // If success, notify user and hide edit field.
        alertPopup.createAlertPopup("success", response.message);
        // Hide the edit field.
        hideProfileEditField(index);
        return;
      }
      // Unsuccessful responses
      alertPopup.createAlertPopup("error", response.errorMessage);
  });
}
