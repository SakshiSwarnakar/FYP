import { NavLink } from "react-router";
import { useAuth } from "../../context/AuthContext";
import {
  CheckCircle2,
  Megaphone,
  PartyPopper,
  UserCircle,
  UserCheck,
  UsersRound,
  XCircle,
} from "lucide-react";

const navLinkClass = (isActive) =>
  `flex items-center gap-3 min-w-0 
   rounded-lg py-2.5 px-3 text-sm font-medium
   transition-all duration-200
   ${isActive
    ? "bg-primary text-white shadow-md"
    : "text-accent hover:bg-primary/10 hover:text-primary"
  }`;

function Sidebar() {
  const { user } = useAuth();

  if (user?.role === "ADMIN") {
    return (
      <div className="w-12 h-[85vh] overflow-y-auto sticky top-25 ml-1 md:w-52 border border-primary/10 rounded-xl overflow-hidden md:p-2 flex flex-col bg-white/50 shadow-md">
        <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent/70 hidden md:block">
          Dashboard
        </p>
        <nav className="space-y-1 flex flex-col">
          <NavLink
            to="/dashboard/campaign"
            end
            className={({ isActive }) => navLinkClass(isActive)}
          >
            <PartyPopper size={20} className="shrink-0" />
            <span className="hidden md:inline">My Events</span>
          </NavLink>
          <NavLink
            to="/dashboard/create-campaign"
            className={({ isActive }) => navLinkClass(isActive)}
          >
            <Megaphone size={20} className="shrink-0" />
            <span className="hidden md:inline">Create Event</span>
          </NavLink>
          <NavLink
            to="/dashboard/volunteer-management"
            className={({ isActive }) => navLinkClass(isActive)}
          >
            <UsersRound size={20} className="shrink-0" />
            <span className="hidden md:block flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
              Volunteer Management
            </span>
          </NavLink>
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) => navLinkClass(isActive)}
          >
            <UserCircle size={20} className="shrink-0" />
            <span className="hidden md:inline">Profile</span>
          </NavLink>
        </nav>
      </div>
    );
  }

  if (user?.role === "VOLUNTEER") {
    return (
      <div className="w-12 h-[85vh] overflow-y-auto sticky top-25 ml-1 md:w-52 border border-primary rounded-xl overflow-hidden p-2 flex flex-col bg-white/50 shadow-sm">
        <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent/70 hidden md:block">
          My applications
        </p>
        <nav className="space-y-1 flex flex-col">
          <NavLink
            to="/dashboard/profile"
            end
            className={({ isActive }) => navLinkClass(isActive)}
          >
            <UserCircle size={20} className="shrink-0" />
            <span className="hidden md:inline">Profile</span>
          </NavLink>
          <NavLink
            to="accepted/campaign"
            className={({ isActive }) => navLinkClass(isActive)}
          >
            <CheckCircle2 size={20} className="shrink-0" />
            <span className="hidden md:inline">Accepted</span>
          </NavLink>
          <NavLink
            to="rejected/campaign"
            className={({ isActive }) => navLinkClass(isActive)}
          >
            <XCircle size={20} className="shrink-0" />
            <span className="hidden md:inline">Rejected</span>
          </NavLink>
        </nav>
      </div>
    );
  }

  return null;
}

export default Sidebar;
