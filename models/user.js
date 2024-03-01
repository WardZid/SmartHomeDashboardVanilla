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

export function isLoggedIn(){
    return lsAPI.isCookieExpired("accessToken") == false;
}