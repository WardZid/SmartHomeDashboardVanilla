
var vidFrontDoor = document.getElementById("front-door-cam");
var muteButton = document.querySelector(".mute-button");

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