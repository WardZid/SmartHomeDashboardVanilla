import * as dbAPI from "../controllers/databaseAPI.js";

export async function getWidgets(roomId) {
  return await dbAPI.getWidgets(roomId);
}

export async function updateWidgetLocation(widgetId,row,col){
  return await dbAPI.updateWidgetLocation(widgetId,row,col);
}