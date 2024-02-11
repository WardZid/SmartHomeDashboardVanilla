
const vidFrontDoor = document.getElementById("front-door-cam");
const muteButton = document.querySelector(".mute-button");
const newRoomDialog = document.getElementById("new-room-dialog");
const dialogOverlay = document.getElementById('overlay');



function signOut() {
    window.location.href = '../log-in/log-in.html';
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

function openNewRoomDialog(){
    dialogOverlay.style.display = 'block';
    newRoomDialog.style.display = 'block';
}

function closeNewRoomDialog(){
    dialogOverlay.style.display = 'none';
    newRoomDialog.style.display = 'none';
}

function submitNewRoom(){
    const roomNameInput = document.getElementById('room-name-input');
    const userInput = roomNameInput.value;
    
    alert('You entered: ' + userInput);

    roomNameInput.value = "";
    closeNewRoomDialog();
}

