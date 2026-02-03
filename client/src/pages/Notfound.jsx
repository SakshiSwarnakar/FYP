import { NavLink } from "react-router"
import { ArrowLeft, Home, AlertTriangle } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
            <AlertTriangle size={64} className="text-primary mb-4" />

            <h1 className="text-7xl font-extrabold tracking-tight text-foreground">
                404
            </h1>

            <p className="mt-2 text-xl font-semibold text-foreground">
                Page not found
            </p>

            <p className="mt-2 text-muted-foreground max-w-md">
                Oops! The page you’re looking for doesn’t exist or was moved.
                Let’s get you back on track.
            </p>

            <div className="mt-6 flex gap-4">
                <NavLink
                    to="/"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition"
                >
                    <Home size={18} />
                    Go Home
                </NavLink>

                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition"
                >
                    <ArrowLeft size={18} />
                    Go Back
                </button>
            </div>
        </div>
    )
}
