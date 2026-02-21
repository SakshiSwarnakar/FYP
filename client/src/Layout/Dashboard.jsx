import { Blend, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Dashboard/Sidebar";
import { useEffect, useRef, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profilePop, openProfile] = useState(false);

  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        openProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : user?.email?.split("@")[0] || "Account";

  return (
    <div>
      <main className="mx-auto px-0">
        <div className="fixed z-10 bg-bg top-0 w-full flex p-4 rounded border-b shadow-sm border-secondary items-center gap-2">
          <div>
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
          </div>
          <div ref={profileRef} className="ml-auto relative">
            <button
              onClick={() => openProfile(!profilePop)}
              className="w-10 h-10 rounded-full bg-linear-to-br from-accent to-primary text-white flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
              aria-expanded={profilePop}
              aria-haspopup="true"
            >
              <User size={20} />
            </button>

            <div
              className={`absolute top-full right-0 mt-2 w-56 rounded-xl border border-primary/20 bg-white shadow-xl overflow-hidden transition-all duration-200 origin-top-right ${
                profilePop
                  ? "opacity-100 scale-100 visible"
                  : "opacity-0 scale-95 pointer-events-none invisible"
              }`}
            >
              <div className="p-4 bg-linear-to-br from-primary/10 to-accent/10 border-b border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <User size={22} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-accent truncate">
                      {displayName}
                    </p>
                    {user?.email && (
                      <p className="text-xs text-accent/70 truncate">
                        {user.email}
                      </p>
                    )}
                    {user?.role && (
                      <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                        {user.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="py-1.5">
                <Link
                  to="/dashboard"
                  onClick={() => openProfile(false)}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium text-accent hover:bg-primary/10 transition-colors"
                >
                  <User size={18} className="text-primary shrink-0" />
                  <span>My dashboard</span>
                </Link>
                <Link
                  to="/dashboard/profile"
                  onClick={() => openProfile(false)}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium text-accent hover:bg-primary/10 transition-colors"
                >
                  <User size={18} className="text-primary shrink-0" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} className="shrink-0" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-26 flex">
          <Sidebar />
          <div className="flex-1 mx-6 md:mx-8 lg:mx-12">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
