import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "src/layout";

const Home = lazy(() => import("src/pages"));
const ProcessInitiated = lazy(() => import("src/pages/intiated"));
const TaskList = lazy(() => import("src/pages/task-list"));
const NotFound = lazy(() => import("src/pages/page-not-found"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,

    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/initiated",
        element: <ProcessInitiated />,
      },
      {
        path: "/tasks",
        element: <TaskList />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
