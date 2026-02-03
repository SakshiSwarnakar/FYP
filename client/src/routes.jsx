import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Profile from "./pages/Dashboard/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Campaign from "./pages/Campaign";
import CreateCampaign from "./pages/Dashboard/CreateCampaign";
import ForgotPassword from "./pages/ForgotPassword";

import Client from "./layout/Client";
import Dashboard from "./layout/Dashboard";
import RootLayout from "./layout/Root";
import { protectedLoader } from "./utils/authLoader";
import NotFound from "./pages/Notfound";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <Client />,
        children: [
          {
            index: true,
            element: <Home />
          },
          {
            path: "login",
            element: <Login />
          },
          {
            path: "register",
            element: <Register />
          },
          {
            path: "forgotpassword",
            element: <ForgotPassword />
          },
          {
            path: "campaign/:id",
            element: <Campaign />
          }
        ]
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        loader: protectedLoader,
        children: [
          {
            index: true,
            element: <Profile />
          },
          {
            path: "create-campaign",
            element: <CreateCampaign />
          },
          {
            path: "create-campaign/:id",
            element: <CreateCampaign />
          },
          {
            path: "campaign/:id",
            element: <Campaign />
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);
