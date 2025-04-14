import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  setDroppedObjectData,
  setIsDropped as setIsDroppedAction,
  setLoading,
} from "../store/droppedObjectSlice";
// Custom hook
import usePlantAssignment from "./usePlantAssignment";
// Reusable services
import {
  // fetchCsrfTokenAndDependencies as fetchCsrfService,
  // fetchObjectDetails as fetchObjectDetailsService,
  getDroppedObjectDetails,
  initializeDroppableArea as initDroppable,
} from "../services/api/droppableService";
import {
  MSG_FETCH_OBJECT_DETAILS_FAILED,
  MSG_INVALID_OBJECT_TYPE,
  MSG_UNEXPECTED_ERROR,
} from "../utils/toastMessages";
import useToast from "./useToast";
import { useAppSelector } from "src/store";

const usePlantDropableArea = () => {
  const { showErrorToast } = useToast();
  const { handlePlantAssignment } = usePlantAssignment();
  const isDropped = useAppSelector((state) => state.droppedObject.isDropped);
  const loading = useAppSelector((state) => state.droppedObject.loading);
  const dispatch = useDispatch();

  const fetchObjectDetails = useCallback(
    async (dataItems: any) => {
      try {
        const objectDetailsResult: any = await getDroppedObjectDetails({
          dataItems,
        });

        // const cardownerResult = await fetchCardOwnerDetailsService({
        //   dataItems,
        //   headers,
        // });

        if (objectDetailsResult.success) {
          // Merge the data from both services
          // const combineData = {
          //   cardData: objectDetailsResult.data.cardData,
          //   ownerData: cardownerResult.data.ownerData,
          // };

          dispatch(
            setDroppedObjectData({
              cardData: objectDetailsResult.data.cardData,
            }),
          );

          const draggedObjectData = objectDetailsResult.data.cardData;
          console.log("[Dragged Items are]", draggedObjectData);

          dispatch(setIsDroppedAction(true));

          // call usePlantAssignment after successfully fetching object details
          if (objectDetailsResult) {
            await handlePlantAssignment(
              draggedObjectData["Collaborative Space"],
              draggedObjectData["Maturity State"],
              dataItems[0]?.objectId,
              dataItems[0]?.objectType,
            );
          }
        } else {
          showErrorToast(MSG_FETCH_OBJECT_DETAILS_FAILED);
        }
      } catch (error) {
        console.error("[FetchObjectDetails] Error fetching details:", error);
        showErrorToast(MSG_FETCH_OBJECT_DETAILS_FAILED);
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, handlePlantAssignment],
  );

  const handleDrop = useCallback(
    async (dataItems: any) => {
      console.log("[handleDrop] handleDrop called with dataItems:", dataItems);

      try {
        if (dataItems && dataItems.length > 0) {
          // Validate object type
          const objectType = dataItems[0]?.objectType;
          const validTypes = ["VPMReference", "Document", "Raw_Material"];
          if (!validTypes.includes(objectType)) {
            showErrorToast(MSG_INVALID_OBJECT_TYPE);
            return;
          }
          dispatch(setIsDroppedAction(true));
          // ✅ Ensure we only start loading if another request isn't running
          console.log("[handleDrop] 🔄 Force setting `loading = true`...");
          dispatch(setLoading(false));
          setTimeout(() => dispatch(setLoading(true)), 0);
          await fetchObjectDetails(dataItems);
        } else {
          console.warn("[handleDrop] No data items to process.");
        }
      } catch (error) {
        console.error("[Drop] Error in handleDrop:", error);
        dispatch(setLoading(false)); // ✅ Reset loading in Redux
        console.log(
          "[handleDrop] Error in handleDrop, setting loading to false",
        );
        showErrorToast(MSG_UNEXPECTED_ERROR);
      }
      // finally {
      //   const latestLoadingState = store.getState().droppedObject.loading;
      //   if (latestLoadingState) {
      //     console.log("[handleDrop] ✅ Resetting `loading = false`...");
      //     setLoading(false);
      //   } else {
      //     console.log("[handleDrop] ⏳ `loading` is already false. Skipping reset.");
      //   }
      // }
    },
    [fetchObjectDetails, showErrorToast],
  );
  // Initialize droppable area
  const initializeDroppableArea = useCallback(() => {
    // ✅ Only reset isDropped if it's currently false (prevent overwriting a valid drop)
    if (!isDropped) {
      console.log(
        "[initializeDroppableArea] 🚀 Resetting isDropped to false...",
      );
      dispatch(setIsDroppedAction(false)); // ✅ Reset only if necessary
    } else {
      console.log(
        "[initializeDroppableArea] ⏳ isDropped is already true. Skipping reset.",
      );
    }
    const interval = setInterval(() => {
      const droppableContainer = document.querySelector(".droppable-container");
      if (droppableContainer) {
        clearInterval(interval);
        initDroppable(droppableContainer, handleDrop, dispatch, showErrorToast);
      }
    }, 100); // Check every 100ms

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [handleDrop, dispatch]);

  return {
    initializeDroppableArea,
    loading,
    handleDrop,
  };
};

export default usePlantDropableArea;
