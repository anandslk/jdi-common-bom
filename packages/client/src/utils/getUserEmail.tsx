// utils/getUserEmail.js
import { loadPlatformAPI } from "./helpers";

export default async function getUserEmail() {
  try {
    const PlatformAPI: any = await loadPlatformAPI();
    const user = await PlatformAPI.getUser();

    return user.email;
  } catch (error) {
    console.error("Error getting user email:", error);
    return null; // Or throw the error, depending on how you want to handle it
  }
}
