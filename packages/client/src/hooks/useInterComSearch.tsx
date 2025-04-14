import { useCallback, useEffect, useState } from "react";
import { loadInterCom } from "../utils/helpers";

const useInterComSearch = () => {
  const [socket, setSocket] = useState<InterComSocket | null>(null);
  const [InterCom, setInterCom] = useState<InterComModule | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const interComInstance = await loadInterCom();
        setInterCom(interComInstance);
      } catch (error) {
        console.error(
          "[useInterComSearch] Error initializing InterCom:",
          error,
        );
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const performSearch = useCallback(
    (searchText: string, searchOpts: any, onObjectsSelected: any) => {
      // Check if InterCom is loaded
      if (!InterCom) {
        console.warn("[useInterComSearch] InterCom is not loaded yet.");
        return;
      }

      const socketName =
        "socket" + new Date().toISOString().replace(/[-:]/g, "");
      const newSocket = new InterCom.Socket(socketName, {
        dispatchRetryInternal: 0,
      });
      newSocket.subscribeServer("SearchComServer");
      setSocket(newSocket);

      console.log(
        "[useInterComSearch] performSearch called with:",
        searchText,
        searchOpts,
      );

      const widgetId = (window as any).widget?.id;
      // console.log("[useInterComSearch] widget id:", widgetId);

      const finalSearchOpts = {
        ...searchOpts,
        widget_id: widgetId,
        app_socket_id: socketName,
        default_search_criteria: searchText,
      };

      // Register the search context (if needed)
      console.log(
        "[useInterComSearch] Dispatching RegisterContext event with:",
        finalSearchOpts,
      );
      newSocket.dispatchEvent("RegisterContext", finalSearchOpts);

      newSocket.dispatchEvent("InContextSearch", finalSearchOpts);

      // Add a listener for search results
      const handleSearchResults = (data: any) => {
        console.log("[useInterComSearch] Search results received:", data);
        if (onObjectsSelected) {
          onObjectsSelected(data);
        }
      };

      console.log(
        "[useInterComSearch] Adding listener for Selected_Objects_search",
      );
      newSocket.addListener("Selected_Objects_search", handleSearchResults);
    },
    [InterCom],
  );

  return {
    performSearch,
  };
};

export default useInterComSearch;

interface InterComSocket {
  disconnect: () => void;
  subscribeServer: (serverName: string) => void;
  dispatchEvent: (eventName: string, opts: any) => void;
  addListener: (eventName: string, callback: (data: any) => void) => void;
}

interface InterComModule {
  Socket: new (
    name: string,
    opts: { dispatchRetryInternal: number },
  ) => InterComSocket;
}
