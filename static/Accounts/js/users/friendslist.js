import { SetupAccountsHeader } from '/static/Accounts/js/accounts_header.js';
import { GetFriendsList } from '/static/Accounts/js/libs/services/api/friends-api.js';
import { AcceptFriendRequest,RemoveFriendship } from '/static/Accounts/js/libs/services/api/friends-api.js';
import AlertPopup from '/static/Accounts/js/libs/utils/AlertPopup.js';

let alertPopup = new AlertPopup();
const pageSize = 5;

// The main function which performs all setup for the page.
export function GeneratePage(claims){
  // generate the page here. this can be done before requesting friendship list.
  generatePage();
  // use URL Params to set the tab.
  autoListFromURLParams();
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
function populateFriendsList(friends, canAcceptReq){
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
    createFriendElement(friends[i], canAcceptReq);
  }

  var parent = document.getElementById("friendsList");
  // fill remaining space with empty rows.
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
// canAcceptReq is a bool which specifies if accept friend request button is enabled.
// Automatically adds an element representing that user to the corresponding section in the HTML page.
function createFriendElement(friendship, canAcceptReq){
  // clone the saved friend entry node.
  var entry = friendEntryNode.cloneNode(true);

  // set the onclick event to redirect user to the friend's profile page.
  entry.setAttribute('onclick', "window.location.href = \"/accounts/users/profile?user=" + friendship.friend.uuid + "\";");

  // set the nametag to Username.
  entry.getElementsByTagName("p")[0].textContent = friendship.friend.username;

  // set the background color to the user's special profile color.
  // entry.style.backgroundColor = "#" + friendship.friend.uuid.slice(0,6) + "A5";

  // Remove Friend button. May also be used as Reject Friend Request button.
  var removeFriendButton = entry.getElementsByClassName("redButton")[0];
  // set removeFriendButton to use REJECT-FRIEND function (no confirm) if in request mode, otherwise use regular remove friend with confirm mode.
  removeFriendButton.onclick = function(){removeFriend(friendship.friend.uuid, !canAcceptReq)};
  // prevent background clickevent firing alongside this button, by using jquery stopPropagation.
  $(removeFriendButton).click(function(e) {
   e.stopPropagation();
  });

  if(canAcceptReq){
    // enable accept friend request button.
    var acceptFriendButton = entry.getElementsByClassName("greenButton")[0];
    acceptFriendButton.style.display = "inline-block";
    acceptFriendButton.onclick = function(){acceptFriendRequest(friendship.friend.uuid)};

    // prevent background clickevent firing alongside this button, by using jquery stopPropagation.
    $(acceptFriendButton).click(function(e) {
     e.stopPropagation();
    });
  }

  // add the user entry to the friends list.
  document.getElementById("friendsList").appendChild(entry);
}

// api request for accept friend request.
function acceptFriendRequest(target_id){
  AcceptFriendRequest(target_id).then((result) => {
    if(result == true){
      alertPopup.createAlertPopup("success", "Accepted friend request.");
      autoListFromURLParams();
      return;
    }
    alertPopup.createAlertPopup("error", "Failed to accept friend request.");
  });
}

// api request for reject friend request / remove friend.
// requireConfirm is bool which determines if a confirmation is required to execute.
function removeFriend(target_id, requireConfirm){
  // confirm check , if required.
  if(requireConfirm){
    var isConfirmed = confirm("Do you want to end your friendship with this user?");
    // If refused, do nothing.
    if(!isConfirmed){
      return;
    }
  }
  // If confirmed, proceed with removing friend.
  RemoveFriendship(target_id).then((result) => {
    if(result == true){
      alertPopup.createAlertPopup("success", "Removed friend.");
      autoListFromURLParams();
      return;
    }
    alertPopup.createAlertPopup("error", "Failed to remove friend.");
  });
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
  // Get 1 more result than actual page size, to check if a next page exists.
  GetFriendsList(pageSize+1, isAccepted, sent_by_friend, startId, reverse).then((friends) => {
    // if next page exists, if more than pageSize results then a next page exists.
    const nextPageExists = friends.length > pageSize;
    // truncate the array to remove extra result, if one exists.
    if(nextPageExists == true){
      friends.splice(pageSize);
    }
    currentFriendsList = friends;
    // Populate the friends list with the results.
    // if not accepted & sent by friend, it can be accepted/rejected, so enable accept button.
    populateFriendsList(friends, (!isAccepted && sent_by_friend));
    // enable/disable page buttons.
    checkPossiblePageButtons(nextPageExists || reverse, newPageNo);
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
function checkPossiblePageButtons(nextPageExists, pageNo){
  // If a next page exists
  if(nextPageExists){
    enableButton(1);
  }
  else{
    disableButton(1);
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
    // disable by default, will be enabled on load.
    disableButton(i);
  }
}

function prevPage(){
  var newPage = getCurrentPageNumber() - 1;
  var startID = currentFriendsList[0].friend.uuid;
  setListURLParams(null, newPage, startID, true);
  autoListFromURLParams();
}

// This will only be called if current page is full of results.
function nextPage(){
  var newPage = getCurrentPageNumber() + 1;
  // get last entry's uuid for start id.
  var startID = currentFriendsList[pageSize-1].friend.uuid;
  setListURLParams(null, newPage, startID);
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
