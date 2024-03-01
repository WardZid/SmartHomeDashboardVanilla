import * as dbAPI from "../../controllers/databaseAPI.js";
import * as lsAPI from "../../controllers/localStorage.js";
import * as user from "../../models/user.js";

const lblFullName = document.getElementById("lblFullName");
const vidFrontDoor = document.getElementById("front-door-cam");
const muteButton = document.querySelector(".mute-button");
const dialogOverlay = document.getElementById("overlay");
const btnNewRoom = document.getElementById("btnNewRoom");
const btnSignOut = document.getElementById("btnSignOut");
const btnToggleMute = document.getElementById("btnToggleMute");
const btnNewWidgetDialog = document.getElementById("btnNewWidgetDialog");
const btnSubmitNewRoom = document.getElementById("btnSubmitNewRoom");
const btnSubmitNewWidget = document.getElementById("btnSubmitNewWidget");

//*******************EVENT LISTENERS - START

btnNewRoom.addEventListener("click", function () {
  openDialog("new-room-dialog");
});
btnSignOut.addEventListener("click", signOut);
btnToggleMute.addEventListener("click", toggleMute);
btnNewWidgetDialog.addEventListener("click", function () {
  openDialog("new-widget-dialog");
});
dialogOverlay.addEventListener("click", closeAllDialogs);
btnSubmitNewRoom.addEventListener("click", submitNewRoom);
btnSubmitNewWidget.addEventListener("click", submitNewWidget);

//***********************************8EVENT LISTENERS - END

function signOut() {
  lsAPI.clear();
  window.location.href = "../log-in/log-in.html";
}

function loadPage() {
  user
    .getUserInfo()
    .then((userInfo) => {
        lblFullName.textContent = userInfo.first_name + " " + userInfo.last_name;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function startClock() {
  setInterval(updateClock, 1000);
}
function updateClock() {
  const timeHeader = document.getElementById("time-header");
  const dateHeader = document.getElementById("date-header");
  const now = new Date(Date.now());

  timeHeader.textContent = now.toLocaleTimeString();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  dateHeader.textContent = now.toLocaleDateString("en-US", options);
}
function togglePause() {
  vidFrontDoor.paused = !vidFrontDoor.paused;
}
function toggleMute() {
  if (vidFrontDoor.muted) {
    vidFrontDoor.muted = false;
    muteButton.textContent = "🔊 Unmute";
  } else {
    vidFrontDoor.muted = true;
    muteButton.textContent = "🔇 Mute";
  }
}

function openDialog(id) {
  const dialog = document.getElementById(id);
  dialog.style.display = "block";
  dialogOverlay.style.display = "block";
}

function closeDialog(id) {
  const dialog = document.getElementById(id);
  dialog.style.display = "none";
  dialogOverlay.style.display = "none";
}

function closeAllDialogs() {
  var dialogs = document.getElementsByClassName("dialog");
  for (var i = 0; i < dialogs.length; i++) {
    var element = dialogs[i];
    element.style.display = "none";
  }
  dialogOverlay.style.display = "none";
}

function submitNewRoom() {
  const roomNameInput = document.getElementById("room-name-input");
  const userInput = roomNameInput.value;

  alert("You entered: " + userInput);

  roomNameInput.value = "";
  closeDialog("new-room-dialog");
}

function submitNewWidget() {
  closeDialog("new-widget-dialog");
}

loadPage();
startClock();
