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
const divRoomButtons = document.getElementById("divRoomButtons");
const btnNewRoom = document.getElementById("btnNewRoom");
const btnSignOut = document.getElementById("btnSignOut");

// const btnToggleMute = document.getElementById("btnToggleMute");
const roomNameInput = document.getElementById("room-name-input");
const btnSubmitNewRoom = document.getElementById("btnSubmitNewRoom");

const btnNewWidgetDialog = document.getElementById("btnNewWidgetDialog");
const btnSubmitNewWidget = document.getElementById("btnSubmitNewWidget");

const divWidgetGrid = document.getElementById("widget-grid");
const tblWidgetTable = document.getElementById("widget-table");

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

new ResizeObserver(updateWidgetTableSize).observe(divWidgetGrid);

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
      if(roomsArray.length > 0){
        loadRoom(roomsArray[0]._id);
      }
      roomsArray.forEach(function (room) {
        addRoomButton(room.room_name, room._id);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  //createWidgetTable();
}

function clearWidgetTable() {
  tblWidgetTable.innerHTML = "";
}

function createWidgetTable() {
  clearWidgetTable();

  const width = divWidgetGrid.clientWidth;
  const height = divWidgetGrid.clientHeight;

  const tblWidth = width - (width % 200);
  const tblHeight = height - (height % 200);

  const columns = Math.floor(width / 200);
  const rows = Math.floor(height / 200);

  // tblWidgetTable.style.width=tblWidth+"px";
  // tblWidgetTable.style.height=tblHeight+"px";

  // tblWidgetTable.style.maxWidth=tblWidth+"px";
  // tblWidgetTable.style.maxHeight=tblHeight+"px";

  for (let i = 0; i < rows; i++) {
    const row = tblWidgetTable.insertRow();
    for (let j = 0; j < columns; j++) {
      const cell = row.insertCell();

      var divDropZone = document.createElement("div");
      divDropZone.id = i + "-" + j + "-dropzone";
      divDropZone.className = "dropzone";

      divDropZone.addEventListener("dragover", function (event) {
        event.preventDefault();
      });

      divDropZone.addEventListener("drop", function (event) {
        event.preventDefault();
        if (this.childElementCount <= 0) {
          var draggedElementId = event.dataTransfer.getData("text");
          var draggedElement = document.getElementById(draggedElementId);

          widget
            .updateWidgetLocation(draggedElementId, i, j)
            .then((response) => {
              console.log(response);
              this.prepend(draggedElement);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      });

      cell.appendChild(divDropZone);

      // cell.textContent = `Cell ${i + 1}-${j + 1}`;
    }
  }
}

function calculateCellCount() {
  const cellWidth = 200;
  const cellHeight = 200;

  const parentWidth = divWidgetGrid.clientWidth;
  const parentHeight = divWidgetGrid.clientHeight;

  const horizontalCellCount = Math.floor(parentWidth / cellWidth);
  const verticalCellCount = Math.floor(parentHeight / cellHeight);

  return horizontalCellCount * verticalCellCount;
}

function updateWidgetTableSize() {
  const width = divWidgetGrid.clientWidth;
  const height = divWidgetGrid.clientHeight;

  const tblWidth = width - (width % 200);
  const tblHeight = height - (height % 200);

  const columns = Math.ceil(width / 200);
  const rows = Math.ceil(height / 200);

  tblWidgetTable.width = tblWidth;
  tblWidgetTable.height = tblHeight;

  //clearWidgetTable();
  //createWidgetTable(rows, columns);
}

function addRoomButton(roomName, roomId) {
  document.getElementById("roomListPlaceHolder").style.display = "none";

  var roomDiv = document.createElement("div");
  var roomHeader = document.createElement("h3"); // Create h3 tag for room name
  // var moreIcon = document.createElement("img"); // Create img tag for "more" icon
  var deleteIcon = document.createElement("img"); // Create img tag for "more" icon

  roomDiv.id = roomId;
  roomDiv.setAttribute("oid", roomId);
  roomDiv.className = "room-item";

  roomHeader.textContent = roomName;

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

  // Event listener to show delete icon on hover
  roomDiv.addEventListener("mouseover", function () {
    deleteIcon.style.visibility = "visible";
  });

  // Event listener to hide delete icon when not hovered
  roomDiv.addEventListener("mouseout", function () {
    deleteIcon.style.visibility = "hidden";
  });

  // roomHeader.appendChild(moreIcon);
  roomDiv.appendChild(roomHeader);
  roomDiv.appendChild(deleteIcon);

  divRoomButtons.appendChild(roomDiv);

  roomDiv.addEventListener("click", function () {
    loadRoom(roomId);
  });
}

function removeRoomButton(roomId) {
  var roomToRemove = document.getElementById(roomId);
  if (roomToRemove) {
    divRoomButtons.removeChild(roomToRemove);
  }

  if (divRoomButtons.childElementCount == 1) {
    document.getElementById("roomListPlaceHolder").style.display = "block";
  }
}

// function toggleRoomList(roomId) {
//   var roomList = document.getElementById(roomId + "-list");
//   if (roomList.style.display === "none") {
//     roomList.style.display = "block";
//   } else {
//     roomList.style.display = "none";
//   }
// }

function loadRoom(roomId) {
  clearWidgetTable();
  createWidgetTable();

  console.log("loading room: " + roomId);
  widget
    .getWidgets(roomId)
    .then((widgets) => {
      widgets.forEach(function (widget) {
        addWidgetDiv(widget);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function addWidgetDiv(widget) {
  try {
    // const cell = tblWidgetTable.rows[widget.row].cells[widget.col];
    const cell = document.getElementById(
      widget.row + "-" + widget.col + "-dropzone"
    );

    var divWidget = document.createElement("div");
    var widgetTitle = document.createElement("h3");

    divWidget.className = "widget";
    divWidget.draggable = true;
    divWidget.id = widget._id;
    divWidget.addEventListener("dragstart", function (event) {
      event.dataTransfer.setData("text", this.id);
    });

    widgetTitle.textContent = widget.title;

    divWidget.appendChild(widgetTitle);

    cell.innerHTML = "";

    // Set rowspan and colspan attributes
    if (widget.row_span > 1) {
      cell.setAttribute("rowspan", widget.row_span);
    }
    if (widget.col_span > 1) {
      cell.setAttribute("colspan", widget.col_span);
    }

    cell.appendChild(divWidget);
  } catch (error) {
    console.log(error);
  }
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
function deleteRoom(roomId) {
  room
    .deleteRoom(roomId)
    .then((response) => {
      removeRoomButton(roomId);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// function startClock() {
//   setInterval(updateClock, 1000);
// }
// function updateClock() {
//   const timeHeader = document.getElementById("time-header");
//   const dateHeader = document.getElementById("date-header");
//   const now = new Date(Date.now());

//   timeHeader.textContent = now.toLocaleTimeString();

//   const options = {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   };
//   dateHeader.textContent = now.toLocaleDateString("en-US", options);
// }
// function togglePause() {
//   vidFrontDoor.paused = !vidFrontDoor.paused;
// }
// function toggleMute() {
//   if (vidFrontDoor.muted) {
//     vidFrontDoor.muted = false;
//     muteButton.textContent = "🔊 Unmute";
//   } else {
//     vidFrontDoor.muted = true;
//     muteButton.textContent = "🔇 Mute";
//   }
// }

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
//startClock();
