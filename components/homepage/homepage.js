import * as dbAPI from "../../controllers/databaseAPI.js";
import * as lsAPI from "../../controllers/localStorage.js";
import * as user from "../../models/user.js";
import * as room from "../../models/room.js";
import * as widget from "../../models/widget.js";

//*******elements */
const vidFrontDoor = document.getElementById("front-door-cam");
const muteButton = document.querySelector(".mute-button");
const dialogOverlay = document.getElementById("overlay");

const lblFullName = document.getElementById("lblFullName");
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

  room
    .getRooms()
    .then((roomsArray) => {
      roomsArray.forEach(function (room) {
        addRoomButton(room.room_name,room._id);
      });
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

function addRoomButton(roomName, roomId) {
  var divRoomButtons = document.getElementById("divRoomButtons");
  var button = document.createElement("button");
  button.textContent = roomName;
  button.id = roomId;
  button.setAttribute("data-room-id", roomId); // Set custom attribute for room id
  divRoomButtons.appendChild(button);
}

function submitNewRoom() {
  const roomNameInput = document.getElementById("room-name-input");
  const roomName = roomNameInput.value;

  room
    .addRoom(roomName)
    .then((response) => {
      addRoomButton(roomName,response.insertedId)
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  roomNameInput.value = "";
  closeDialog("new-room-dialog");
}

function submitNewWidget() {
  closeDialog("new-widget-dialog");
}

function loadRoom(roomId) {}
loadPage();
startClock();
