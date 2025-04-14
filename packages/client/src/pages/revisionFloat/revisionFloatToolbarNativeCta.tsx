import CustomButton from "../../components/Button/Button";
import useRevisions from "../../hooks/useRevisions";
import useToast from "../../hooks/useToast";
import { MSG_NO_ROWS, MSG_NO_REPLACE } from "../../utils/toastMessages";
import getUserEmail from "../../utils/getUserEmail";
import { useAppSelector } from "src/store";

const RevisionFloatToolbarNativeCta = () => {
  const { replaceRevisions } = useRevisions();
  const { showErrorToast } = useToast();
  // Access relevant data from Redux store
  const droppedObjectData = useAppSelector(
    (state) => state.droppedObject.droppedObjectData,
  );

  const selectedTableRows = useAppSelector(
    (state) => state.droppedObject.selectedTableRows,
  ); // Assuming you're storing selected rows in Redux

  // console.log("selectedTableRows", selectedTableRows);

  const handleReplace = async () => {
    if (!selectedTableRows || selectedTableRows.length === 0) {
      showErrorToast(MSG_NO_ROWS);
      return;
    }

    // Get the parentDetails from droppedObjectData
    const allParents = (droppedObjectData.parentDetails as any)?.data;
    if (!allParents || allParents.length === 0) {
      showErrorToast("No parent details available.");
      return;
    }

    // Filter selected rows where 'To-Be child connected' is not "-"
    const selectedRows = selectedTableRows.filter(
      (row) => row["To-Be child connected"] !== "-",
    );

    if (selectedRows.length === 0) {
      showErrorToast(MSG_NO_REPLACE);
      return;
    }

    // Map selectedRows to their corresponding parent objects
    const selectedParents = selectedRows.map((row) => {
      return allParents.find(
        (parent: any) =>
          parent["Dropped Revision ID"] === row["Dropped Revision ID"],
      );
    });

    // Check if any matching parent is not found
    if (selectedParents.some((parent) => !parent)) {
      showErrorToast("Could not find all corresponding parent details.");
      return;
    }

    const userEmail = await getUserEmail();
    if (!userEmail) {
      throw new Error("User email not found.");
    }

    const droppedData = droppedObjectData.cardData;

    // Call the replaceRevisions function from useRevisions hook
    const result = await replaceRevisions(
      selectedParents,
      droppedData,
      userEmail,
    );

    if (result.success) {
      // Handle success (e.g., show a success message, refetch data, etc.)
    } else {
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="d-flex cta-absolute">
      <CustomButton
        variant="outline-secondary"
        className="m-2"
        size="lg"
        text="Replace"
        onClick={handleReplace}
      />
      {/* <WidgetLifecycle /> */}

      {/* <CustomButton
        variant="outline-secondary"
        className="m-2"
        size="lg"
        text=" Select items in my Collaborative Space"
        // onClick={""}
      /> */}
    </div>
  );
};

export default RevisionFloatToolbarNativeCta;
