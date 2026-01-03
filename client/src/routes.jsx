import { createBrowserRouter } from "react-router";
import App from "./App";
import Home from "./pages/Home";
import Profile from "./pages//Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Campaign from "./pages/Campaign";
import CreateCampaign from "./pages/CreateCampaign";
import Client from "./layout/Client";
import Dashboard from "./layout/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: '/',
        element: <Client />,
        children: [
          {
            index: true,
            element: <Home />
          },
          {
            path: '/login',
            element: <Login />
          },
          {
            path: '/register',
            element: <Register />
          },
          
        
          {
            path: '/campaign/:id',
            element: <Campaign />
          },
        ]
      },

      {
        path: '/dashboard',
        element: <Dashboard />,
        children: [
          {
            index: true,
            element: <Profile />
          },
          {
            path: 'create-campaign',
            element: <CreateCampaign />
          },
          {
            path: 'create-campaign/:id',
            element: <CreateCampaign />
          },
          {
            path: 'campaign/:id',
            element: <Campaign />
          },
        ]
      }
    ]
  }
]);