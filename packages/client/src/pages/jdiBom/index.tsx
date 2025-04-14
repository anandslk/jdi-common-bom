import { WithDroppableLogic } from "src/components/DragAndDrop";
import { initializeWidget } from "src/components/InitializeWidget";
import { JdiBomPage } from "src/pages";
import { useAppSelector } from "src/store";

const JDIWidget = () => {
  const loadingParentDetails = useAppSelector(
    (state) => state.droppedObject.loadingParentDetails
  );

  return (
    <WithDroppableLogic objectDropped={loadingParentDetails}>
      <JdiBomPage />
    </WithDroppableLogic>
  );
};

const JdiBomWidget = () => initializeWidget(<JDIWidget />);

export default JdiBomWidget;
