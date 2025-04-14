import { ReactNode, Suspense } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "src/store";
import { Provider } from "react-redux";

import { LineProgress } from "src/components/LineProgress";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { Bounce, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "../index.css";
import "../styles/variables.css";

export const Providers = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={<LineProgress />}>
              <Toaster position="top-center" reverseOrder={false} />
              <ToastContainer
                position={"top-right"}
                autoClose={2000}
                hideProgressBar={false}
                closeOnClick={true}
                pauseOnHover={false}
                pauseOnFocusLoss={false}
                draggable={true}
                theme={"light"}
                transition={Bounce}
              />

              {children}
            </Suspense>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </HelmetProvider>
  );
};
