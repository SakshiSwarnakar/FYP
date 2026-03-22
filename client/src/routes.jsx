import { createBrowserRouter } from "react-router";
import CreateTask from "./features/task/CreateTask";
import ReviewSubmission from "./features/task/ReviewSubmission";
import SubmitTaskForm from "./features/task/SubmitTaskForm";
import TaskList from "./features/task/TaskList";
import TaskReviewPage from "./features/task/TaskReview";
import Client from "./layout/Client";
import Common from "./layout/Common";
import Dashboard from "./layout/Dashboard";
import RootLayout from "./layout/Root";
import Campaign from "./pages/Campaign";
import CampaignDetails from "./pages/CampaignDetails";
import CreateCampaign from "./pages/Dashboard/CreateCampaign";
import Profile from "./pages/Dashboard/Profile";
import VolunteerAccepted from "./pages/Dashboard/VolunteerAccepted";
import VolunteerDetails from "./pages/Dashboard/VolunteerDetails";
import VolunteerManagement from "./pages/Dashboard/VolunteerManagement";
import VolunteerProfileView from "./pages/Dashboard/VolunteerProfileView";
import VolunteerRejected from "./pages/Dashboard/VolunteerRejected";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/Notfound";
import Register from "./pages/Register";
import { protectedLoader } from "./utils/authLoader";
import CampaignChat from "./features/chat/Campaignchat";

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
                element: <Campaign />,
              },
              {
                path: ":id",
                element: <Common />,
                children: [
                  {
                    index: true,
                    element: <CampaignDetails />,
                  },
                  {
                    path: "submit-task/:taskId",
                    element: <SubmitTaskForm />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        loader: protectedLoader,
        children: [
          { path: 'chat', element: <CampaignChat /> },
          {
            path: "campaign",
            element: <Common />,
            children: [
              {
                index: true,
                element: <Campaign />,
              },
              {
                path: 'chat',
                element: <CampaignChat />
              },
              {
                path: ":id",
                element: <Common />,
                children: [
                  {
                    index: true,
                    element: <CampaignDetails />,
                  },
                  {
                    path: "create-task",
                    element: <CreateTask />,
                  },
                  {
                    path: "submit-task/:taskId",
                    element: <SubmitTaskForm />,
                  },
                ],
              },
            ],
          },
          {
            path: "task-review",
            element: <Common />,
            children: [
              {
                index: true,
                element: <TaskList />,
              },
              {
                path: ":campaignId",
                element: <TaskReviewPage />,
              },
              {
                path: "task/:taskId",
                element: <ReviewSubmission />,
              },
            ],
          },
          {
            path: "create-campaign",
            element: <CreateCampaign />,
          },
          {
            path: "campaign/create-campaign/:id",
            element: <CreateCampaign />,
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
            children: [{ path: ":id", element: <VolunteerDetails /> }],
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
