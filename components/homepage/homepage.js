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
const roomNameInput = document.getElementById("room-name-input");
const btnSubmitNewRoom = document.getElementById("btnSubmitNewRoom");
const btnSubmitNewWidget = document.getElementById("btnSubmitNewWidget");

//*******************EVENT LISTENERS - START

btnNewRoom.addEventListener("click", function () {
  openDialog("new-room-dialog");
});
btnSignOut.addEventListener("click", signOut);
//btnToggleMute.addEventListener("click", toggleMute);
btnNewWidgetDialog.addEventListener("click", function () {
  openDialog("new-widget-dialog");
});
dialogOverlay.addEventListener("click", closeAllDialogs);
btnSubmitNewRoom.addEventListener("click", submitNewRoom);
roomNameInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    btnSubmitNewRoom.click();
  }
});
btnSubmitNewWidget.addEventListener("click", submitNewWidget);

//***********************************8EVENT LISTENERS - END

function signOut() {
  user.signOut();
  window.location.href = "../log-in/log-in.html";
}

async function loadPage() {
  var loggedIn = await user.isLoggedIn();
  if (loggedIn == false) {
    signOut();
    return null;
  }

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
        addRoomButton(room.room_name, room._id);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function addRoomButton(roomName, roomId) {
  var divRoomButtons = document.getElementById("divRoomButtons");
  var roomDiv = document.createElement("div");
  var roomHeader = document.createElement("h3"); // Create h3 tag for room name
  // var moreIcon = document.createElement("img"); // Create img tag for "more" icon
  var deleteIcon = document.createElement("img"); // Create img tag for "more" icon

  roomHeader.textContent = roomName; // Set room name text
  roomHeader.id = roomId;
  roomHeader.className = "room-item";
  roomHeader.setAttribute("oid", roomId); // Set custom attribute for room id

  // moreIcon.src = "../../resources/more.png"; // Set path to your more icon image
  // moreIcon.className = "more-icon"; // Add class for styling
  // moreIcon.addEventListener("click", function (event) {
  //   event.stopPropagation(); // Prevent click event from bubbling up to parent div
  //   toggleRoomList(roomId); // Function to toggle list visibility
  // });

  deleteIcon.src = "../../resources/delete.png"; // Set path to your more icon image
  deleteIcon.className = "delete-icon"; // Add class for styling
  deleteIcon.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent click event from bubbling up to parent div
    deleteRoom(roomId); // Function to toggle list visibility
  });

  // roomHeader.appendChild(moreIcon);
  roomHeader.appendChild(deleteIcon);
  roomDiv.appendChild(roomHeader);
  divRoomButtons.appendChild(roomDiv);

  // Assuming you have a function called loadRoom to load room details
  roomHeader.addEventListener("click", function () {
    loadRoom(roomId);
  });
}

function toggleRoomList(roomId) {
  var roomList = document.getElementById(roomId + "-list");
  if (roomList.style.display === "none") {
    roomList.style.display = "block";
  } else {
    roomList.style.display = "none";
  }
}

function loadRoom(roomId) {
  console.log("loading room: " + roomId);
}

function addWidgetDiv() {}

function prepareWidgetGrid() {
  //add dropzones
}

function submitNewRoom() {
  const roomName = roomNameInput.value;
  if (roomName) {
    room
      .addRoom(roomName)
      .then((response) => {
        addRoomButton(roomName, response.insertedId);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    roomNameInput.value = "";
  }
  closeDialog("new-room-dialog");
}
function deleteRoom(roomId) {}

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

function submitNewWidget() {
  closeDialog("new-widget-dialog");
}

loadPage();
prepareWidgetGrid();
startClock();
