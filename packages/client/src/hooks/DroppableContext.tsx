import { createContext, useContext, useRef, useEffect, ReactNode } from "react";
import useDroppableArea from "./useDroppableArea"; // Your existing hook

// ✅ Create the Context
const DroppableContext = createContext({});

// ✅ Create the Provider Component
export const DroppableProvider = ({ children }: { children: ReactNode }) => {
  const { initializeDroppableArea } = useDroppableArea();
  const hasInitialized = useRef(false);

  // ✅ Initialize droppable area only ONCE
  useEffect(() => {
    if (!hasInitialized.current) {
      console.log("[DroppableProvider] Initializing droppable area...");
      initializeDroppableArea();
      hasInitialized.current = true; // ✅ Ensures it runs only once
    }
  }, [initializeDroppableArea]);

  return <DroppableContext value={{}}>{children}</DroppableContext>;
};

// ✅ Custom Hook to Use the Context
export const useDroppable = () => useContext(DroppableContext);
