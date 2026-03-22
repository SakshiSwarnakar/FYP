import {
  CheckCircle2,
  ClipboardCheck,
  Megaphone,
  PartyPopper,
  UserCircle,
  UsersRound,
  XCircle,
} from "lucide-react";
import { NavLink } from "react-router";
import { useAuth } from "../../context/AuthContext";

const NavItem = ({ to, end, icon, label }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `group flex items-center gap-3 rounded-xl py-2.5 px-3 text-sm font-medium transition-all duration-200 min-w-0
      ${
        isActive
          ? "bg-primary text-white shadow-sm shadow-primary/25"
          : "text-gray-500 hover:bg-primary/8 hover:text-primary"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <span
          className={`shrink-0 transition-transform duration-200 ${!isActive && "group-hover:scale-110"}`}
        >
          {icon}
        </span>
        <span className="hidden md:block truncate">{label}</span>
      </>
    )}
  </NavLink>
);

const SectionLabel = ({ children }) => (
  <p className="hidden md:block px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-300 select-none">
    {children}
  </p>
);

const Divider = () => (
  <div className="hidden md:block my-2 mx-3 border-t border-primary/8" />
);

function Sidebar() {
  const { user } = useAuth();

  const sidebarBase = `
    w-14 md:w-56 h-[85vh] sticky top-24 ml-1
    flex flex-col overflow-hidden
    bg-white border border-primary/12 rounded-2xl shadow-sm
  `;

  if (user?.role === "ADMIN") {
    return (
      <aside className={sidebarBase}>
        {/* Top accent strip */}
        <div className="h-0.5 w-full bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30 flex-shrink-0" />

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          <SectionLabel>Dashboard</SectionLabel>

          <NavItem
            to="/dashboard/campaign"
            end
            icon={<PartyPopper size={18} />}
            label="My Events"
          />
          <NavItem
            to="/dashboard/create-campaign"
            icon={<Megaphone size={18} />}
            label="Create Event"
          />

          <Divider />
          <SectionLabel>Management</SectionLabel>

          <NavItem
            to="/dashboard/volunteer-management"
            icon={<UsersRound size={18} />}
            label="Volunteers"
          />
          <NavItem
            to="/dashboard/task-review"
            icon={<ClipboardCheck size={18} />}
            label="Task Review"
          />

          <Divider />
          <SectionLabel>Account</SectionLabel>

          <NavItem
            to="/dashboard/profile"
            icon={<UserCircle size={18} />}
            label="Profile"
          />
        </div>
      </aside>
    );
  }

  if (user?.role === "VOLUNTEER") {
    return (
      <aside className={sidebarBase}>
        <div className="h-0.5 w-full bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30 flex-shrink-0" />

        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          <SectionLabel>Account</SectionLabel>

          <NavItem
            to="/dashboard/profile"
            end
            icon={<UserCircle size={18} />}
            label="Profile"
          />

          <Divider />
          <SectionLabel>My Applications</SectionLabel>

          <NavItem
            to="accepted/campaign"
            icon={<CheckCircle2 size={18} />}
            label="Accepted"
          />
          <NavItem
            to="rejected/campaign"
            icon={<XCircle size={18} />}
            label="Rejected"
          />
        </div>
      </aside>
    );
  }

  return null;
}

export default Sidebar;
