// layouts/RootLayout.jsx
import { Outlet } from "react-router"
import Providers from "./Providers"

import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout() {
    return (
        <Providers>
            <ToastContainer />
            <Outlet />
        </Providers>
    )
}
