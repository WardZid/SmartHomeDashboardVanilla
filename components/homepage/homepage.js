
const vidFrontDoor = document.getElementById("front-door-cam");
const muteButton = document.querySelector(".mute-button");
const dialogOverlay = document.getElementById('overlay');



function signOut() {
    window.location.href = '../log-in/log-in.html';
}

function startClock(){
    setInterval(updateClock, 1000);
}
function updateClock(){
    const timeHeader = document.getElementById("time-header");
    const dateHeader = document.getElementById("date-header");
    const now = new Date(Date.now());
    
    timeHeader.textContent = now.toLocaleTimeString();

    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    dateHeader.textContent = now.toLocaleDateString('en-US', options);
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

function openDialog(id){
    const dialog = document.getElementById(id);
    dialog.style.display = 'block';
    dialogOverlay.style.display = 'block';
}

function closeDialog(id){
    const dialog = document.getElementById(id);
    dialog.style.display = 'none';
    dialogOverlay.style.display = 'none';
}

function closeAllDialogs(){
    var dialogs = document.getElementsByClassName("dialog");
    for (var i = 0; i < dialogs.length; i++) {
        var element = dialogs[i];
        element.style.display = 'none';
    }
    dialogOverlay.style.display = 'none';
}

function submitNewRoom(){
    const roomNameInput = document.getElementById('room-name-input');
    const userInput = roomNameInput.value;
    
    alert('You entered: ' + userInput);

    roomNameInput.value = "";
    closeDialog('new-room-dialog');
}

function submitNewWidget(){
    closeDialog('new-widget-dialog');
}

startClock();