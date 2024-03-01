import * as dbAPI from "../../controllers/databaseAPI.js";
import * as user from "../../models/user.js";

//element definitions
const btnSignIn = document.getElementById("btnSignIn");
const txtUsername = document.getElementById("txtUsername");
const txtPassword = document.getElementById("txtPassword");
const btnTogglePassword = document.getElementById("btnTogglePassword");

// ************** EVENT LISTENERS - START
btnSignIn.addEventListener("click", signIn);

txtUsername.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    btnSignIn.click();
  }
});

txtPassword.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    btnSignIn.click();
  }
});

btnTogglePassword.addEventListener("click", function() {
    const type = txtPassword.getAttribute("type") === "password" ? "text" : "password";
    txtPassword.setAttribute("type", type);
});
// ************** EVENT LISTENERS - END
function signIn() {
  const enteredUsername = txtUsername.value;
  const enteredPassword = txtPassword.value;

  if (
    (isValidInput(enteredUsername) && isValidInput(enteredPassword)) == false
  ) {
    alert("Please fill in all required fields properly");
    return;
  }

  dbAPI
    .login(enteredUsername, enteredPassword)
    .then((success) => {
      if (success) {
        window.location.href = "../homepage/homepage.html";
      } else {
        alert("Incorrect Username Or Password");
      }
    })
    .catch((error) => {
      // Handle error
      console.error("Error:", error);
    });
  //
}

function isValidInput(inputStr) {
  return inputStr != null && inputStr != "";
}


//skip login if user is still in session
if(user.isLoggedIn()){
  window.location.href = "../homepage/homepage.html";
}