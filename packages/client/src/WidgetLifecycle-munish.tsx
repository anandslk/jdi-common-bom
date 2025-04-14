import { useEffect, useState } from "react";
import { refreshWidgetData } from "./services/api/refreshService";
import useToast from "./hooks/useToast";
import useDroppableArea from "./hooks/useDroppableArea";
import { MSG_REFRESH_ERROR, MSG_REFRESH_SUCCESS } from "./utils/toastMessages";
import Loader from "./components/Loader/Loader";
import { store } from "./store";

const WidgetLifecycle = () => {
  const { handleDrop } = useDroppableArea();
  const { showSuccessToast, showErrorToast } = useToast();
  const [loading, setLoading] = useState(false);

  // console.log("---[WidgetLifecycle]--- starts");

  const isAutoTriggeredRefresh = (trace: any) => {
    return trace.some(
      (line: any) =>
        line.includes("UWA_Frame_Alone.js") || line.includes("bundle-min.js"),
    );
  };

  useEffect(() => {
    if (!(window as any).widget) return;

    // console.log("[WidgetLifecycle] 📌 Registering `onRefresh` event...");

    const onRefresh = async () => {
      const trace = new Error()?.stack?.split("\n");

      // ✅ Check if refresh was manually triggered
      const userClickedRefresh = sessionStorage.getItem("userClickedRefresh");

      if (isAutoTriggeredRefresh(trace) && !userClickedRefresh) {
        console.warn(
          "[WidgetLifecycle] ⛔ Auto-refresh detected. Ignoring unwanted `onRefresh`.",
        );
        return; // ✅ Block auto-triggered refresh
      }

      // console.log("[WidgetLifecycle] 🔄 `onRefresh` triggered!");
      // ✅ Reset manual refresh flag so next refresh isn't blocked
      sessionStorage.removeItem("userClickedRefresh");
      // console.log(
      //   "Stored Flag in widgt lifecycle:",
      //   sessionStorage.getItem("userClickedRefresh")
      // );

      setLoading(true);

      const latestState = store.getState();
      const latestDraggedData: any =
        latestState.droppedObject.droppedObjectData.initialDraggedData;

      if (!latestDraggedData?.data?.items?.length) {
        console.error(
          "[WidgetLifecycle] ⚠️ `initialDraggedData` is missing or invalid:",
          latestDraggedData,
        );
        setLoading(false);
        return;
      }

      try {
        // console.log(
        //   "[WidgetLifecycle] 🚀 Refreshing widget with latest data..."
        // );
        await refreshWidgetData(latestDraggedData.data.items, handleDrop);
      } catch (error) {
        console.error("[WidgetLifecycle] ❌ Error during refresh:", error);
        showErrorToast(MSG_REFRESH_ERROR);
      } finally {
        setLoading(false); // ✅ Stop Loader when refresh completes
        showSuccessToast(MSG_REFRESH_SUCCESS);
      }
    };
    console.trace("[WidgetLifecycle] 🔄 `onRefresh` was called from:");
    (window as any).widget.addEvent("onRefresh", onRefresh);
    // console.log(
    //   "[WidgetLifecycle] ✅ `onRefresh` event registered successfully"
    // );
  }, []); // ✅ Runs only once

  return loading ? <Loader /> : null;
};

export default WidgetLifecycle;
