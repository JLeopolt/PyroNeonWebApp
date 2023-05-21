import { SetupAccountsHeader } from '/static/Accounts/js/accounts_header.js';
import { GetAuthClaims } from '/static/Accounts/js/libs/services/api/auth-api.js';
import { GetFriendsList, GetPageSize, SetPageSize } from '/static/Accounts/js/libs/services/api/friends-api.js';

SetPageSize(1);

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
    // generate the page here. this can be done before requesting friendship list.
    generatePage();
    // use URL Params to set the tab.
    autoListFromURLParams();
  });
}

function autoListFromURLParams(){
  // retrieve URL Params
  var searchParams = new URLSearchParams(window.location.search);
  // which tab to use
  var mode = searchParams.get("view");
  // which page you're on
  var pageNo = searchParams.get("page");
  if(pageNo == null || pageNo == undefined){
    pageNo = 1;
  }
  // userID to start from (for api)
  var startID = searchParams.get("start");
  var prev = searchParams.get("prev");

  if(mode == null){
    // display active friends by default.
    listActiveFriends(pageNo, startID, prev);
    return;
  }
  if(mode === "friends"){
    listActiveFriends(pageNo, startID, prev);
    return;
  }
  if(mode === "incoming"){
    listIncomingFriendRequests(pageNo, startID, prev);
    return;
  }
  if(mode === "outgoing"){
    listOutgoingFriendRequests(pageNo, startID, prev);
    return;
  }
  // If invalid option, do default.
  listActiveFriends(pageNo, startID);
}

function setListURLParams(opt, page, start, reverse){
  var searchParams = new URLSearchParams(window.location.search);
  // set the new options
  if(opt != null && opt != undefined){
    searchParams.set("view", opt);
  }
  if(page != null && page != undefined){
    searchParams.set("page", page);
  }
  if(start != null && start != undefined){
    searchParams.set("start", start);
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
  // add functionality to tab buttons
  addTabButtonEvents();
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

// Fills the Friends list panel with friend elements.
// NOTICE: Assumes the friends list is already CLEARED.
function populateFriendsList(friends){
  // Now, since API request is finished, disable the throbber.
  disableThrobber();

  // If null or no friends, show an empty set.
  if(friends == null || friends.length == 0){
    showNoResultsNotice();
    return;
  }

  // Loop through the whole Friends list.
  for (let i in friends) {
    // Add the user to the HTML page.
    createFriendElement(friends[i]);
  }

  var parent = document.getElementById("friendsList");
  // fill remaining space with empty rows.
  let pageSize = GetPageSize();
  for(var n = friends.length-1; n < pageSize-1; n++){
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
function clearFriendList(){
  var parent = document.getElementById("friendsList");
  var friendEntries = parent.getElementsByClassName("friendEntry");
  // Delete ONLY friendEntries.
  while(friendEntries.length > 0) {
        parent.removeChild(friendEntries[0]);
  }
  // Hide the no results notice
  hideNoResultsNotice();
}

// Create a copy of the friendEntryNode from HTML and prepare it for reproduction.
let friendEntryNode = document.getElementById("friendEntryNode").cloneNode(true);
friendEntryNode.style.display = "table-row";
friendEntryNode.setAttribute('id', "");

// Takes in a JSON Object representing the Friendship with another user.
// Automatically adds an element representing that user to the corresponding section in the HTML page.
function createFriendElement(friendship){
  // clone the saved friend entry node.
  var entry = friendEntryNode.cloneNode(true);
  // set the onclick event to redirect user to the friend's profile page.
  entry.setAttribute('onclick', "window.location.href = \"/accounts/profile?user=" + friendship.friend.uuid + "\";");
  // set the nametag to Username.
  entry.getElementsByTagName("p")[0].textContent = friendship.friend.username;
  // set the background color to the user's special profile color.
  // entry.style.backgroundColor = "#" + friendship.friend.uuid.slice(0,6) + "A5";
  // add the user entry to the friends list.
  document.getElementById("friendsList").appendChild(entry);
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

let friendTabButtonIds = ["friendsTab", "incomingTab", "outgoingTab"];

function addTabButtonEvents(){
  let functions = [function(){listActiveFriends(1, null)},
                   function(){listIncomingFriendRequests(1, null)},
                   function(){listOutgoingFriendRequests(1, null)}];
  // add the functions to buttons.
  for(var i = 0; i < friendTabButtonIds.length; i++){
    document.getElementById(friendTabButtonIds[i]).onclick = functions[i];
  }
}

function listActiveFriends(newPageNo, startID, reverse){
  listEntries(0, "friends", true, null, startID, reverse, newPageNo);
}

function listIncomingFriendRequests(newPageNo, startID, reverse){
  listEntries(1, "incoming", false, true, startID, reverse, newPageNo);
}

function listOutgoingFriendRequests(newPageNo, startID, reverse){
  listEntries(2, "outgoing", false, false, startID, reverse, newPageNo);
}

let currentFriendsList = undefined;

// Helper method for listFriend functions.
function listEntries(tabIndex, urlMode, isAccepted, sent_by_friend, startId, reverse, newPageNo){
  // remove whatever is already in the friends list.
  clearFriendList();
  // Enable loading animation.
  enableThrobber();
  // Highlight corresponding tab.
  highlightTab(tabIndex);
  // set url param options
  setListURLParams(urlMode, newPageNo, startId, reverse);
  // set page number.
  setPageNumber(newPageNo);
  // Get friendships based on the input params.
  if(reverse == undefined){
    reverse = null;
  }
  GetFriendsList(isAccepted, sent_by_friend, startId, reverse).then((friends) => {
    currentFriendsList = friends;
    // Populate the friends list with the results.
    populateFriendsList(friends);
    // enable/disable page buttons.
    checkPossiblePageButtons(friends, newPageNo);
  });
}

function resetTabHighlights(){
  // restore all tabs to initial state, which allows hover to stil work.
  for(var i = 0; i < friendTabButtonIds.length; i++){
    document.getElementById(friendTabButtonIds[i]).style.backgroundColor = "";
  }
}

function highlightTab(index){
  resetTabHighlights();
  document.getElementById(friendTabButtonIds[index]).style.backgroundColor = "#4F4F4F";
}

const pageButtons = ["prevPageButton", "nextPageButton"];
const pageButtonFunctions = [function(){prevPage()}, function(){nextPage()}];

// checks which page buttons are available.
function checkPossiblePageButtons(friends, pageNo){
  // If list isn't pageSize, there are no more pages.
  if(friends.length < GetPageSize()){
    disableButton(1);
  }
  else{
    enableButton(1);
  }
  // If page 1, disable prev
  if(pageNo < 2){
    disableButton(0);
  }
  else{
    enableButton(0);
  }
}

function addPageButtonEvents(){
  for(var i = 0; i < pageButtons.length; i++){
    document.getElementById(pageButtons[i]).onclick = pageButtonFunctions[i];
  }
}

function prevPage(){
  var newPage = getCurrentPageNumber() - 1;
  // get first entry's uuid for start id.
  var startID = currentFriendsList[0].friend.uuid;
  setListURLParams(null, newPage, startID, true);
  // listOutgoingFriendRequests(newPage, startID, true);
  autoListFromURLParams();
}
// This will only be called if current page is full of results.
function nextPage(){
  var newPage = getCurrentPageNumber() + 1;
  // get last entry's uuid for start id.
  var startID = currentFriendsList[GetPageSize()-1].friend.uuid;
  setListURLParams(null, newPage, startID);
  // listOutgoingFriendRequests(newPage, startID);
  autoListFromURLParams();
}

function disableButton(index){
  var button = document.getElementById(pageButtons[index]);
  button.style.opacity = "0.5";
  // disable :hover effect.
  button.style.background = "inherit";
  // disable button events
  button.onclick = null;
}

function enableButton(index){
  var button = document.getElementById(pageButtons[index]);
  button.style.opacity = "1.0";
  // re-enable :hover effect.
  button.style.background = "";
  // enable proper button events
  button.onclick = pageButtonFunctions[index];
}

// set the page number at bottom of the table.
function setPageNumber(pageNumber){
  document.getElementById("pageNumber").textContent = pageNumber;
}

// return the integer value of Page Number element.
function getCurrentPageNumber(){
  return parseInt(document.getElementById("pageNumber").textContent);
}
