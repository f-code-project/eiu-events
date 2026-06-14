import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import MasterLayout from "../layout/MasterLayout";
import NotFound from "../pages/NotFound";
// import Home from '@/pages/Home';
// import About from '@/pages/About';
// import NotFound from '@/pages/NotFound';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MasterLayout />,
    children: [
      {
        path: "/",
        element: <App />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);
