import * as lsAPI from "./localStorage.js";
import * as user from "../models/user.js";

const loginEndpoint =
  "https://realm.mongodb.com/api/client/v2.0/app/data-rtanz/auth/providers/local-userpass/login";
const refreshTokenEndpoint =
  "https://services.cloud.mongodb.com/api/client/v2.0/auth/session";
const dataEndpoint =
  "https://eu-central-1.aws.data.mongodb-api.com/app/data-rtanz/endpoint/data/v1/action";

const databaseName = "SmartHomeDatabase";
const dataSourceName = "Cluster0";
const accessTokenExpiry = 1800; // 30 mins
const refreshTokenExpiry = 5184000; // 60 days
const userIDExpiry = 5184000; // 60 days

function buildRequest(collectionName, additionalData) {
  const accessToken = lsAPI.getAccessToken();

  const requestData = {
    collection: collectionName,
    database: databaseName,
    dataSource: dataSourceName,
    ...additionalData,
  };

  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(requestData),
  };
  return request;
}

export async function refreshAccessToken() {
  const refreshToken = lsAPI.getRefreshToken();
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
  };
  try {
    const response = await fetch(refreshTokenEndpoint, request);
    if (!response.ok) {
      user.signOut();
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    if (responseData.access_token) {
      lsAPI.setAccessToken(responseData.access_token, accessTokenExpiry);
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
async function send(endpoint, request) {
  if (await user.isLoggedIn()) {
    try {
      const response = await fetch(endpoint, request);

      if (!response.ok) {
        if (response.status == 401) {
          user.signOut();
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  }
}
async function findOne(collectionName, requestData) {
  const endpoint = dataEndpoint + "/findOne";
  const request = buildRequest(collectionName, requestData);

  const response = await send(endpoint, request);
  return response.document;
}
async function findMany(collectionName, requestData) {
  const endpoint = dataEndpoint + "/find";
  const request = buildRequest(collectionName, requestData);

  const response = await send(endpoint, request);
  return response.documents;
}
async function insertOne(collectionName, requestData) {
  const endpoint = dataEndpoint + "/insertOne";
  const request = buildRequest(collectionName, requestData);

  const response = await send(endpoint, request);
  return response;
}

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
  const userID = lsAPI.getUserID();
  const requestData = {
    filter: {
      _id: { $oid: userID },
    },
  };
  return await findOne("users", requestData);
}

export async function addNewRoom(roomName) {
  const userID = lsAPI.getUserID();
  const requestData = {
    document: {
      room_name: roomName,
      user_id: { $oid: userID },
    },
  };
  return await insertOne("rooms", requestData);
}

export async function fetchRooms() {
  const userID = lsAPI.getUserID();
  const requestData = {
    filter: {
      user_id: { $oid: userID },
    },
  };
  return await findMany("rooms", requestData);
}
