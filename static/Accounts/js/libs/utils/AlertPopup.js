export default class AlertPopup {
    constructor() {}

    createAlertPopup(type, message){
      const alert = document.getElementsByClassName("alert")[0];
      // Make the display visible.
      alert.style.display = "flex";
      // Set the background color of the alert.
      if(type === "error"){
        alert.style.backgroundColor = "#f44336";
      }
      else if(type === "warning"){
        alert.style.backgroundColor = "#EE7D00";
      }
      else if(type === "info"){
        alert.style.backgroundColor = "#2196F3";
      }
      else if(type === "success"){
        alert.style.backgroundColor = "#04AA6D";
      }
      // Set the message content of the alert.
      // alert.firstChild.textContent = message;
      alert.getElementsByClassName("alert_message")[0].textContent = message;
      window.location.href = '#alert_box';
    }
}
