import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { LineProgress } from "src/components/LineProgress";
import { Navbar } from "src/components/Navbar";

export const Layout = () => {
  const { key } = useLocation();

  return (
    <>
      <Suspense key={key} fallback={<LineProgress />}>
        <Navbar />

        <Outlet />
      </Suspense>
    </>
  );
};
