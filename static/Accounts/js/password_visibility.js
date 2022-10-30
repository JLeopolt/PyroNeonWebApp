function togglePasswordVisibility(passwordTextField) {
  var x = document.getElementById(passwordTextField);
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}
