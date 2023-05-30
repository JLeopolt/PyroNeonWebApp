import { SearchUsers } from '/static/Accounts/js/libs/services/api/auth-api.js';
import AlertPopup from '/static/Accounts/js/libs/utils/AlertPopup.js';

let alertPopup = new AlertPopup();
const pageSize = 5;

// The main function which performs all setup for the page.
// Does not require claims.
export function GeneratePage(){
  // generate the page here.
  generatePage();

  // use URL Params to restore page.
  autoListFromURLParams();

  // add function to the search button.
  document.getElementById("searchSubmitButton").onclick = function(){searchForm()};
}

// called when Search Button is clicked.
function searchForm(){
  // get the query
  const searchQuery = document.getElementById("searchTextField").value;
  // start from the first page of the search.
  listEntries(searchQuery, null, null, 1);
}






function autoListFromURLParams(){
  // retrieve URL Params
  var searchParams = new URLSearchParams(window.location.search);
  // search query
  var searchQuery = searchParams.get("q");

  // if no query field.
  if(searchQuery == null){
    return;
  }

  document.getElementById("searchTextField").value = searchQuery;
  // which page you're on
  var pageNo = searchParams.get("page");
  if(pageNo == null || pageNo == undefined){
    pageNo = 1;
  }
  // userID to start from (for api)
  var startUsername = searchParams.get("start");
  var prev = searchParams.get("prev");

  listEntries(searchQuery, startUsername, prev, pageNo);
}

function setListURLParams(searchQuery, page, start, reverse){
  var searchParams = new URLSearchParams(window.location.search);
  // set the new options
  if(searchQuery != null && searchQuery != undefined){
    searchParams.set("q", searchQuery);
  }
  if(page != null && page != undefined){
    searchParams.set("page", page);
  }
  else{
    searchParams.delete("page");
  }
  if(start != null && start != undefined){
    searchParams.set("start", start);
  }
  else{
    searchParams.delete("start");
  }
  if(reverse != null && reverse != undefined){
    searchParams.set("prev", reverse);
  }
  else{
    searchParams.delete("prev");
  }

  // update the search url WITHOUT refreshing page.
  var newRelativePathQuery = window.location.pathname + '?' + searchParams.toString();
  window.history.replaceState( {} , window.title, newRelativePathQuery );
}






// Prepares the page after loading successful.
function generatePage(){
  // add function to the Page buttons.
  addPageButtonEvents();
}

// Loading throbber
let throbber = document.getElementById("throbber");

// Enable the loading animation.
function enableThrobber(){
  throbber.style.display = "table-row";
}

// Disable the loading animation.
function disableThrobber(){
  throbber.style.display = "none";
}

// Fills the users list panel with user elements.
// NOTICE: Assumes the users list is already CLEARED.
function populateResultsList(users){
  // Now, since API request is finished, disable the throbber.
  disableThrobber();

  // If null or no friends, show an empty set.
  if(users == null || users.length == 0){
    showNoResultsNotice();
    return;
  }

  // Loop through the whole Friends list.
  for (let i in users) {
    // Add the user to the HTML page.
    createFriendElement(users[i]);
  }

  var parent = document.getElementById("resultList");
  // fill remaining space with empty rows.
  for(var n = users.length-1; n < pageSize-1; n++){
    createEmptyRow(parent);
  }
}

let emptyRow = document.getElementById("emptyRowEntry");
emptyRow.style.display = "table-row";
emptyRow.setAttribute('id', "");

function createEmptyRow(parent){
  parent.appendChild(emptyRow.cloneNode(true));
}

// Removes all FriendEntries from the table body, without deleting any other elements.
function clearResultList(){
  var parent = document.getElementById("resultList");
  var resultEntries = parent.getElementsByClassName("resultEntry");
  // Delete ONLY friendEntries.
  while(resultEntries.length > 0) {
        parent.removeChild(resultEntries[0]);
  }
  // Hide the no results notice
  hideNoResultsNotice();
}




// Create a copy of the resultEntryNode from HTML and prepare it for reproduction.
let resultEntryNode = document.getElementById("resultEntryNode").cloneNode(true);
resultEntryNode.style.display = "table-row";
resultEntryNode.setAttribute('id', "");

// Automatically adds an element representing that user to the corresponding section in the HTML page.
function createFriendElement(user){
  // clone the saved friend entry node.
  var entry = resultEntryNode.cloneNode(true);
  // set the onclick event to redirect user to the friend's profile page.
  entry.setAttribute('onclick', "window.location.href = \"/accounts/profile?user=" + user.uuid + "\";");
  // set the nametag to Username.
  entry.getElementsByTagName("p")[0].textContent = user.username;
  // add the user entry to the friends list.
  document.getElementById("resultList").appendChild(entry);
}




let noResultsNotice = document.getElementById("noResultsNotice");
// Notifies the user that there are no Friends under a category.
function showNoResultsNotice(){
  noResultsNotice.style.display = "table-row";
}
// Hides the no results notice.
function hideNoResultsNotice(){
  noResultsNotice.style.display = "none";
}

let currentResultsList = undefined;

// Helper method for listFriend functions.
function listEntries(searchQuery, startUsername, reverse, newPageNo){
  // Deactivate the submit button.
  disableButton("searchSubmitButton");
  // remove whatever is already in the friends list.
  clearResultList();
  // Enable loading animation.
  enableThrobber();
  // set url param options
  setListURLParams(searchQuery, newPageNo, startUsername, reverse);
  // set page number.
  setPageNumber(newPageNo);
  // Get friendships based on the input params.
  if(reverse == undefined){
    reverse = null;
  }
  // Get 1 more result than actual page size, to check if a next page exists.
  SearchUsers(searchQuery, startUsername, reverse, pageSize+1).then((response) => {
    // Convert the HTTP Status into a single digit, representing response type.
    const statusType = String(response.status)[0];

    // Error messages
    if(statusType === "4"){
      // If it has an errorMessage
      var error = response.errorMessage;
      if(error == null){
        // If it has an error
        error = response.error;
      }
      alertPopup.createAlertPopup("error", error);
    }
    // Server errors, or other.
    else if(statusType !== "2"){
      alertPopup.createAlertPopup("warning", "Status: " + response.status + ": " +response.statusMessage);
    }

    var users = response.users;
    if(users == null || users == undefined){
      users = {};
      showNoResultsNotice();
    }
    currentResultsList = users;

    // if next page exists, if more than pageSize results then a next page exists.
    const nextPageExists = users.length > pageSize;
    // truncate the array to remove extra result, if one exists.
    if(nextPageExists == true){
      users.splice(pageSize);
    }
    // populate the list.
    populateResultsList(users);
    // enable/disable page buttons.
    checkPossiblePageButtons(nextPageExists || reverse, newPageNo);

    // once done, reenable the search button.
    enableButton("searchSubmitButton", function(){searchForm()});
  });
}






const pageButtons = ["prevPageButton", "nextPageButton"];
const pageButtonFunctions = [function(){prevPage()}, function(){nextPage()}];

// checks which page buttons are available.
function checkPossiblePageButtons(nextPageExists, pageNo){
  // If a next page exists
  if(nextPageExists){
    enableButton(pageButtons[1], pageButtonFunctions[1]);
  }
  else{
    disableButton(pageButtons[1]);
  }
  // If page 1, disable prev
  if(pageNo < 2){
    disableButton(pageButtons[0]);
  }
  else{
    enableButton(pageButtons[0], pageButtonFunctions[0]);
  }
}

function addPageButtonEvents(){
  for(var i = 0; i < pageButtons.length; i++){
    document.getElementById(pageButtons[i]).onclick = pageButtonFunctions[i];
    // disable by default, will be enabled on load.
    disableButton(pageButtons[i]);
  }
}

function prevPage(){
  var newPage = getCurrentPageNumber() - 1;
  var startID = currentResultsList[0].username;
  setListURLParams(null, newPage, startID, true);
  autoListFromURLParams();
}

// This will only be called if current page is full of results.
function nextPage(){
  var newPage = getCurrentPageNumber() + 1;
  // get last entry's uuid for start id.
  var startID = currentResultsList[pageSize-1].username;
  setListURLParams(null, newPage, startID);
  autoListFromURLParams();
}

function disableButton(id){
  var button = document.getElementById(id);
  button.style.opacity = "0.5";
  // disable :hover effect.
  button.style.background = "inherit";
  // disable button events
  button.onclick = null;
}

function enableButton(id, funct){
  var button = document.getElementById(id);
  button.style.opacity = "1.0";
  // re-enable :hover effect.
  button.style.background = "";
  // enable proper button events
  button.onclick = funct;
}

// set the page number at bottom of the table.
function setPageNumber(pageNumber){
  document.getElementById("pageNumber").textContent = pageNumber;
}

// return the integer value of Page Number element.
function getCurrentPageNumber(){
  return parseInt(document.getElementById("pageNumber").textContent);
}
