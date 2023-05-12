import { GetFriendship } from '/static/Accounts/js/libs/services/api/friends-api.js';
import { UpdateSpans } from '/static/Accounts/js/libs/utils/update-elements.js';
import { SendFriendRequest,AcceptFriendRequest,RemoveFriendship } from '/static/Accounts/js/libs/services/api/friends-api.js';
import AlertPopup from '/static/Accounts/js/libs/utils/AlertPopup.js';

let alertPopup = new AlertPopup();

// IDs of all friendship control buttons.
let buttonIDs = ["sendFriendRequest",
                "acceptFriendRequest",
                "rejectFriendRequest",
                "removeFriend"];

// The main function, which sets up the Friendship Control Panel.
export function EnableFriendshipControls(target_id){
  // get this user's friendship for the targetted uuid.
  GetFriendship(target_id).then((friendship) => {
    // setup friendship control panel using a friendship obj, or null
    setFriendshipControls(target_id, friendship);
  });
}

// Updates friendship control buttons and friendship status.
// Takes in the user's UUID, and a Friendship object; which may be Null.
function setFriendshipControls(target_id, friendship){
  let friendshipStatus = undefined;

  // if stranger
  if(friendship == null){
    friendshipStatus = "This user is a stranger to you.";
    setButtonStates([true, false, false, false]);
  }
  else{
    let friendsName = friendship.friend.username;
    friendshipStatus = friendsName;
    // if friends
    if(friendship.was_accepted){
      friendshipStatus += " is friends with you.";
      // enable/disable control buttons.
      setButtonStates([false, false, false, true]);
    }
    // friend request sent by them.
    else if(friendship.was_sent_by_friend){
      friendshipStatus += " wants to be your friend!";
      // enable/disable control buttons.
      setButtonStates([false, true, true, false]);
    }
    // friend request sent by YOU to them.
    else{
      friendshipStatus += " is considering your friend request.";
      // enable/disable control buttons.
      setButtonStates([false, false, false, true]);
    }
  }

  setFriendshipStatus(friendshipStatus);
  setButtonEvents(target_id);
}

// if you're viewing your own profile, or aren't logged in.
export function DisableFriendshipControls(){
  // hide friendship control panel.
  document.getElementById("friendControls").style.display = "none";
}

// whether the user is your friend, wants to be your friend, etc.
function setFriendshipStatus(status){
  UpdateSpans("include-friend-status", status);
}

// Reveals/hides buttons, provide exactly 4 entries, one for each friend control button id.
// true = show , false = hide.
function setButtonStates(visibilityStates){
  for(var i = 0; i < buttonIDs.length; i++){
    var mode = "none";
    if(visibilityStates[i] == true){
      mode = "inline-block";
    }
    document.getElementById(buttonIDs[i]).style.display = mode;
  }
}

// Adds corresponding click events to each friendship control button.
function setButtonEvents(target_id){
  let functions = [function(){sendFriendRequest(target_id)},
                   function(){acceptFriendRequest(target_id)},
                   function(){rejectFriendRequest(target_id)},
                   function(){removeFriend(target_id)}];
  for(var i = 0; i < buttonIDs.length; i++){
    document.getElementById(buttonIDs[i]).onclick = functions[i];
  }
}

// Button control functions
function sendFriendRequest(target_id){
  SendFriendRequest(target_id).then((result) => {
    if(result == true){
      alertPopup.createAlertPopup("success", "Sent friend request.");
      EnableFriendshipControls(target_id);
      return;
    }
    alertPopup.createAlertPopup("error", "Failed to send friend request.");
  });
}
function acceptFriendRequest(target_id){
  AcceptFriendRequest(target_id).then((result) => {
    if(result == true){
      alertPopup.createAlertPopup("success", "Accepted friend request.");
      EnableFriendshipControls(target_id);
      return;
    }
    alertPopup.createAlertPopup("error", "Failed to accept friend request.");
  });
}
function rejectFriendRequest(target_id){
  RemoveFriendship(target_id).then((result) => {
    if(result == true){
      alertPopup.createAlertPopup("success", "Rejected friend request.");
      EnableFriendshipControls(target_id);
      return;
    }
    alertPopup.createAlertPopup("error", "Failed to reject friend request.");
  });
}
function removeFriend(target_id){
  var isConfirmed = confirm("Do you want to end your friendship with this user?");
  // If refused, do nothing.
  if(!isConfirmed){
    return;
  }
  // If confirmed, proceed with removing friend.
  RemoveFriendship(target_id).then((result) => {
    if(result == true){
      alertPopup.createAlertPopup("success", "Removed friend.");
      EnableFriendshipControls(target_id);
      return;
    }
    alertPopup.createAlertPopup("error", "Failed to remove friend.");
  });
}
