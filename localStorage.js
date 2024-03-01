// Function to set cookies
export function setCookie(name, value, expirySeconds) {
  const d = new Date();
  d.setTime(d.getTime() + expirySeconds * 1000); // Convert seconds to milliseconds
  const expires = "expires=" + d.toUTCString();
  document.cookie =
    name + "=" + value + ";" + expires + ";path=/;SameSite=Strict;Secure;";
}
// Function to get cookie value by name
export function getCookie(name) {
  const cookieName = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return "";
}

export function setAccessToken(accessToken, expiry) {
  setCookie("accessToken", accessToken, expiry);
}
export function setRefreshToken(refreshToken, expiry) {
  setCookie("refreshToken", refreshToken, expiry);
}
export function setUserID(userID, expiry) {
  setCookie("userID", userID, expiry);
}

export function getAccessToken() {
  return getCookie("accessToken");
}
export function getRefreshToken() {
  return getCookie("refreshToken");
}
export function getUserID() {
  return getCookie("userID");
}
