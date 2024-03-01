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
function clearAllCookies() {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict;`;
  }
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


export function setUserInfoToSessionStorage(userInfo){
  sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
}
export function getUserInfoFromSessionStorage(){
  const userInfoString = sessionStorage.getItem('userInfo');
  return JSON.parse(userInfoString);
}

export function clear(){
  sessionStorage.clear();
  clearAllCookies();
}



export function isCookieExpired(cookieName) {
  const cookieValue = getCookie(cookieName);
  if (!cookieValue) {
    // Cookie doesn't exist
    return true;
  }

  const cookiePairs = cookieValue.split(';');
  for (let i = 0; i < cookiePairs.length; i++) {
    const pair = cookiePairs[i].trim().split('=');
    if (pair[0] === 'expires') {
      const expirationDate = new Date(pair[1]);
      const currentDate = new Date();
      return expirationDate < currentDate;
    }
  }

  // If there's no 'expires' attribute, the cookie doesn't have an expiration date
  return false;
}