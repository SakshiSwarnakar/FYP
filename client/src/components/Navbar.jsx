import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Blend, HandHeart, House, LayoutGrid, LogIn } from "lucide-react";
import NotificationBell from "../features/notification/Notification";
import CampaignChat from "../features/chat/Campaignchat";

function Navbar() {
  const location = useLocation();
  const { user, loading } = useAuth();


  const navLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
      ? "text-primary bg-primary/10"
      : "text-accent/90 hover:text-primary hover:bg-primary/5"
      }`;
  };

  return (
    <nav className="sticky top-0 z-10 w-full bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg transition-opacity hover:opacity-90"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-accent to-primary">
            <Blend className="h-5 w-5 text-white" />
          </span>
          <span className="text-xl font-bold tracking-tight text-accent">
            Social
          </span>
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          <Link to="/" className={navLinkClass("/")}>
            <House size={18} className="shrink-0" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <Link to="/campaign" className={navLinkClass("/campaign")}>
            <HandHeart size={18} className="shrink-0" />
            <span className="hidden sm:inline">Campaigns</span>
          </Link>



          {!loading && user?.role == "ADMIN" && (
            <Link to="/dashboard/campaign" className={navLinkClass("/dashboard")}>
              <LayoutGrid size={18} className="shrink-0" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}
          {!loading && user?.role == "VOLUNTEER" && (
            <Link to="/dashboard/profile" className={navLinkClass("/dashboard")}>
              <LayoutGrid size={18} className="shrink-0" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          )}

          {!loading && !user && (
            <Link
              to="/login"
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-primary transition-all hover:shadow-lg bg-primary/10`}
            >
              <LogIn size={18} className="shrink-0" />
              <span>Log in</span>
            </Link>
          )}
          {(!loading && (user?.role == 'ADMIN' || user?.role == "VOLUNTEER")) &&
            (
              <NotificationBell />
            )}
          {user && <CampaignChat currentUser={{ _id: user?.id, firstName: user?.firstName || "unknown", lastName: user?.lastName, role: user?.role }}
          />}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
