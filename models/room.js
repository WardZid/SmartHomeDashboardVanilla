import * as dbAPI from "../controllers/databaseAPI.js";

export async function getRooms() {
  return await dbAPI.getRooms();
}

export async function addRoom(roomName) {
  return await dbAPI.addNewRoom(roomName);
}

export async function deleteRoom(roomId) {
  return await dbAPI.deleteRoom(roomId);
}
