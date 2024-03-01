import * as localStorage from "./localStorage.js";


const accessTokenExpiry = 3600; // Example: 1 hour
const refreshTokenExpiry = 2592000; // Example: 30 days
const userIDExpiry = 2592000; // Example: 30 days

export async function login(email, password) {
  const url =
    "https://realm.mongodb.com/api/client/v2.0/app/data-rtanz/auth/providers/local-userpass/login";
  const data = {
    username: email,
    password: password,
  };

  try {
    const response = await fetch(url, {
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
      localStorage.setAccessToken(responseData.access_token, accessTokenExpiry);
      localStorage.setRefreshToken( responseData.refresh_token, refreshTokenExpiry);
      localStorage.setUserID(responseData.user_id, userIDExpiry);

      return true;
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

