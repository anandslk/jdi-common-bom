import { ReactNode, Suspense } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "src/store";
import { Provider } from "react-redux";

import { LineProgress } from "src/components/LineProgress";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

export const Providers = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<LineProgress />}>
              <DndProvider backend={HTML5Backend}>
                <Toaster position="top-center" reverseOrder={false} />

                {children}
              </DndProvider>
            </Suspense>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </HelmetProvider>
  );
};
