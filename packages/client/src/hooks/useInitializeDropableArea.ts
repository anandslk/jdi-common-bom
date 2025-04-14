import { useEffect, useRef, useCallback } from "react";
import { useAppSelector } from "src/store";
import useDroppableArea from "./useDroppableArea";
import { shallowEqual } from "react-redux";

export const useInitializeDroppableArea = () => {
  const { initializeDroppableArea } = useDroppableArea();
  const hasInitializedDroppable = useRef(false);

  // ✅ Memoized function to prevent re-creation
  const initDroppable = useCallback(() => {
    if (!hasInitializedDroppable.current) {
      initializeDroppableArea();
      hasInitializedDroppable.current = true;
    }
  }, [initializeDroppableArea]);

  // ✅ Use shallowEqual to prevent unnecessary re-renders
  const isDropped = useAppSelector(
    (state) => state.droppedObject.isDropped,
    shallowEqual
  );

  // ✅ Use a single effect to optimize performance
  useEffect(() => {
    initDroppable();

    console.info("[RevisionFloat] State Changes:", { isDropped });
  }, [initDroppable, isDropped]);
};
