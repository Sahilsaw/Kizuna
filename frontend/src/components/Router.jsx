import { createBrowserRouter } from "react-router-dom";
import {ProtectedRoutes,AuthenticatedRoutes} from "./PrivateRoutes";

import App from "../App";
import LoginPage from "../pages/LoginPage";
import SettingsPage from "../pages/SettingsPage";
import ProfilePage from "../pages/ProfilePage";
import SignUpPage from "../pages/SignUpPage";
import HomePage from "../pages/HomePage";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoutes>
            <HomePage />
          </ProtectedRoutes>
        ),
      },
      {
        path: 'signup',
        element: 
        <AuthenticatedRoutes>
            <SignUpPage />
        </AuthenticatedRoutes>,
      },
      {
        path: 'login',
        element:
        <AuthenticatedRoutes>
            <LoginPage />
        </AuthenticatedRoutes>,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoutes>
            <ProfilePage />
          </ProtectedRoutes>
        ),
      },
    ],
  },
]);

export default router;