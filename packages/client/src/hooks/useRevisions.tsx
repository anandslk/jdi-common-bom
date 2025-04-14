import useToast from "./useToast";

import api from "../utils/api"; // Import axios instance
import { MSG_REPLACE_SUCCESS, MSG_REPLACE_ERROR } from "../utils/toastMessages";

const useRevisions = () => {
  const { showSuccessToast, showErrorToast } = useToast();

  const fetchRevisionsAndParents = async (
    objectId: any,
    objectType: any,
    relativePath: any,
  ) => {
    if (!relativePath) {
      console.error("[Fetch Revisions] ❌ Missing relative path.");
      return;
    }

    const parentURL = `/revFloat/getParents`;

    try {
      // Use the axios instance to make the POST request
      const response = await api.post(parentURL, {
        data: {
          id: objectId,
          type: objectType,
          relativePath: relativePath,
        },
      });

      if (response.status === 200) {
        const parentDetails = response.data;

        // 🚀 Return data instead of dispatching
        return parentDetails;
      } else {
        throw new Error(
          `[Fetch Revisions] HTTP error! status: ${response.status}`,
        );
      }
    } catch (error) {
      console.error("[Fetch Revisions] ❌ Error occurred:", error);
      return null; // Ensure it returns null on error
    }
  };

  const replaceRevisions = async (
    selectedParents: any,
    droppedData: any,
    userEmail: any,
  ) => {
    const parentURL = `/revFloat/floatRevisions`; // Use relative path for axios

    try {
      // Make the POST request to the replacement API
      const response = await api.post(parentURL, {
        SelectedParents: selectedParents,
        DroppedData: droppedData,
        userEmail: userEmail,
      });

      if (response.status === 200) {
        // Handle successful replacement
        console.log("Replacement successful:", response.data);
        showSuccessToast(MSG_REPLACE_SUCCESS); // Show success toast
        // You might want to update the Redux store or refetch data here
        return { success: true };
      } else {
        throw new Error(
          `[Replacement API] HTTP error! status: ${response.status}`,
        );
      }
    } catch (error: any) {
      console.error("Error during replacement:", error);
      showErrorToast(MSG_REPLACE_ERROR); // Show error toast
      return { success: false, error: error.message };
    }
  };

  return { fetchRevisionsAndParents, replaceRevisions };
};

export default useRevisions;
