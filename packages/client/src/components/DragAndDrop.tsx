import { ReactNode } from "react";
import DragAndDropComponent from "./DragAndDrop/DragAndDrop";
import Loader from "./Loader/Loader";
import { useInitializeDroppableArea } from "src/hooks/useInitializeDropableArea";
import useDroppableArea from "src/hooks/useDroppableArea";
import { useAppSelector } from "src/store";

export const WithDroppableLogic = ({
  children,
  objectDropped,
}: {
  children: ReactNode;
  objectDropped: any;
}) => {
  const { loading } = useDroppableArea();

  useInitializeDroppableArea();

  // Use Redux for isDropped
  const isDropped = useAppSelector((state) => state.droppedObject.isDropped);

  // Check if a dynamic loadingObject value is passed via props;
  // if not, fallback to Redux.
  const loadingObject = objectDropped;

  // Show loading states
  if (loading || loadingObject) {
    return <Loader />;
  }

  // If not dropped, show drag-and-drop area
  if (!isDropped) {
    return <DragAndDropComponent />;
  }

  // Render the wrapped component when isDropped = true
  return children;
};
