import * as lsAPI from "./localStorage.js";

const loginEndpoint = "https://realm.mongodb.com/api/client/v2.0/app/data-rtanz/auth/providers/local-userpass/login"
const dataEndpoint = "https://eu-central-1.aws.data.mongodb-api.com/app/data-rtanz/endpoint/data/v1/action"

const accessTokenExpiry = 3600; // Example: 1 hour
const refreshTokenExpiry = 2592000; // Example: 30 days
const userIDExpiry = 2592000; // Example: 30 days

export async function login(email, password) {

  const data = {
    username: email,
    password: password,
  };

  try {
    const response = await fetch(loginEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    if (responseData && responseData.error) {
      return false;
    } else {
      lsAPI.setAccessToken(responseData.access_token, accessTokenExpiry);
      lsAPI.setRefreshToken(responseData.refresh_token, refreshTokenExpiry);
      lsAPI.setUserID(responseData.user_id, userIDExpiry);

      return true;
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function fetchUserInfo() {
  const accessToken = lsAPI.getAccessToken();
  const userID = lsAPI.getUserID();
  const requestData = {
    collection: "users",
    database: "SmartHomeDatabase",
    dataSource: "Cluster0",
    filter: {
      _id: { $oid: userID },
    },
  };

  try {
    const response = await fetch(dataEndpoint + "/findOne", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData.document;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
