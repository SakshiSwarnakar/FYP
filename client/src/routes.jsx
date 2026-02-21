import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Profile from "./pages/Dashboard/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CampaignDetails from "./pages/CampaignDetails";
import CreateCampaign from "./pages/Dashboard/CreateCampaign";
import VolunteerAccepted from "./pages/Dashboard/VolunteerAccepted";
import VolunteerRejected from "./pages/Dashboard/VolunteerRejected";
import VolunteerProfileView from "./pages/Dashboard/VolunteerProfileView";
import ForgotPassword from "./pages/ForgotPassword";
import Client from "./layout/Client";
import Dashboard from "./layout/Dashboard";
import RootLayout from "./layout/Root";
import { protectedLoader } from "./utils/authLoader";
import NotFound from "./pages/Notfound";
import VolunteerDetails from "./pages/Dashboard/VolunteerDetails";
import Campaign from "./pages/Campaign";
import CreateTask from "./features/task/CreateTask";
import Common from "./layout/Common";
import SubmitTaskForm from "./features/task/SubmitTaskForm";
import VolunteerManagement from "./pages/Dashboard/VolunteerManagement";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <Client />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "forgotpassword",
            element: <ForgotPassword />,
          },
          {
            path: "campaign",
            element: <Common />,
            children: [
              {
                index: true,
                element: <Campaign />
              },
              {
                path: ":id",
                element: <CampaignDetails />,
              },
            ]
          },

        ],
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        loader: protectedLoader,
        children: [
          {
            path: 'campaign',
            element: <Common />,
            children: [
              {
                index: true,
                element: <Campaign />
              },
              {
                path: ':id',
                element: <Common />,
                children: [
                  {
                    index: true,
                    element: <CampaignDetails />
                  },
                  {
                    path: 'create-task',
                    element: <CreateTask />
                  },
                  {
                    path: 'submit-task/:id',
                    element: <SubmitTaskForm />
                  }
                ]
              },
              {
                path: "create-campaign",
                element: <CreateCampaign />,
              },
              {
                path: "create-campaign/:id",
                element: <CreateCampaign />,
              },

            ]
          },

          {
            path: "volunteer-management",
            element: <VolunteerManagement />,
          },

          {
            path: "volunteers/:userId",
            element: <VolunteerProfileView />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "accepted/campaign",
            element: <VolunteerAccepted />,
            children: [{ path: ":id", element: <VolunteerDetails /> },
            ],
          },
          {
            path: "rejected/campaign",
            element: <VolunteerRejected />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
