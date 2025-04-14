import { useDispatch } from "react-redux";

import { getAllPlants } from "../services/api/PlantAssignment/allPlantSevice";
import { getUserGroupCollab } from "../services/api/PlantAssignment/userGroupService";

import { fetchCADetails } from "../services/api/PlantAssignment/CADetailService";
import { fetchAssignedPlants } from "../services/api/PlantAssignment/assignedPlantService";
import { fetchProductChildren } from "../services/api/PlantAssignment/plantChildrenService";

import { fetchCsrfToken } from "../services/api/PlantAssignment/fetchCsrfService";
import {
  setCAName,
  setHeaders,
  setParentDetailsLoading,
  setPlantObjectData,
  setProductChildren,
  setProposedChanges,
} from "../store/droppedObjectSlice";
import { MSG_FETCH_CSRF_HEADERS_FAILED } from "../utils/toastMessages";
import useToast from "./useToast";
const usePlantAssignment = () => {
  const { showErrorToast } = useToast();

  const dispatch = useDispatch();

  // HERE IS THE iSSUE THAT THIS FUNCTION IS ALWAYS CALLED .
  let email = (window as any).widget.getValue("email");

  console.log("Email in usePlantAssignment:", email);

  // const securityContext1 = initWidget.getValue("Credentials");
  // console.log("Srcurity Context in usePlantAssignment:", securityContext1);

  const handlePlantAssignment = async (
    collabSpace: any,
    state: any,
    objectId: any,
    type: any,
  ) => {
    try {
      dispatch(setParentDetailsLoading(true));
      const headers = await fetchCsrfToken();
      // Step 1: Call Initial Service
      if (headers) {
        console.log("[UsePlantAssignment] Headers are", headers);
        const userGroupCollab = await getUserGroupCollab(
          headers,
          objectId,
          email,
        );
        console.log("[Plant Assignment] User Groups:", userGroupCollab);

        let allCollabSpaces = [...userGroupCollab, collabSpace];

        console.log(
          "[Use Plant Assignment] All CollabSpaces:",
          allCollabSpaces,
        );

        // Step 3: Pass Combined Data to Additional Service
        if (allCollabSpaces) {
          const allPlants = await getAllPlants(allCollabSpaces, headers);
          console.log("[Use Plant Assignment] All Plants are:", allPlants);

          if (allPlants) {
            const plants = await fetchAssignedPlants(
              allPlants,
              headers,
              objectId,
            );

            console.log("[Use Plant Assignment]: ", plants);

            // to dispatch the plants
            if (plants.success) {
              dispatch(setPlantObjectData(plants?.data?.plantData));
              dispatch(setHeaders(headers));
            } else {
              console.error("Failed to fetch plant data");
            }
          } else {
            console.warn("[Use All Plants] There are no Plants");
          }
        } else {
          console.warn("[Use All Plants] There are no CollabSpace");
        }

        // Step 4: Call Remaining Independent Services
        let getProductChildren: any = {};
        console.log("Type Before:", type);
        if (type === "Raw_Material") {
          getProductChildren = {
            success: true,
            data: [],
          };
        } else {
          getProductChildren = await fetchProductChildren(headers, objectId); // type we need here
        }
        console.log("Type After:", type);
        console.log("[Use All Plants] Product Childrens", getProductChildren);
        if (getProductChildren.success) {
          dispatch(setProductChildren(getProductChildren.data));
        }

        const getCaDetails = await fetchCADetails(headers, objectId, state);
        console.log("[Use All Plants] Get CA Details", getCaDetails);
        if (getCaDetails.success) {
          dispatch(setCAName(getCaDetails.data));
          dispatch(setProposedChanges(getCaDetails.proposedChanges));
        }

        // Step 5: Dispatch Results to Redux

        // hERE WE CAN ADD TOAST
        console.log("[Plant Assignment] All Services Executed Successfully");

        return;
      } else {
        showErrorToast(MSG_FETCH_CSRF_HEADERS_FAILED);
      }
    } catch (error) {
      console.error("[Plant Assignment] Error:", error);
      dispatch(setParentDetailsLoading(false));
      throw error; // Let the caller handle the error
    } finally {
      dispatch(setParentDetailsLoading(false)); // End loading at the top level
    }
  };

  return { handlePlantAssignment };
};

export default usePlantAssignment;
