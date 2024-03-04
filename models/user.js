import * as dbAPI from "../controllers/databaseAPI.js";
import * as lsAPI from "../controllers/localStorage.js";

export async function getUserInfo() {
  var userInfo = lsAPI.getUserInfoFromSessionStorage();
  if (userInfo == null) {
    userInfo = await dbAPI.fetchUserInfo();
    lsAPI.setUserInfoToSessionStorage(userInfo);
  }
  return userInfo;
}

export async function isLoggedIn() {
  if (lsAPI.isCookieExpired("refreshToken")) {
    signOut();
    return false;
  }

  if (lsAPI.isCookieExpired("accessToken")) {
    await dbAPI.refreshAccessToken();
  }

  //check again after refreshing access token
  if (lsAPI.isCookieExpired("accessToken")){
    signOut();
    return false;
  }
  
  return true;
}

export function signOut() {
  lsAPI.clear();
}
