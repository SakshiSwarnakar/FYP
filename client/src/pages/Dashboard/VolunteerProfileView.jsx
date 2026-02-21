import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { api } from "../../axios/axios";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Loading";
import {
  User,
  Mail,
  Shield,
  ArrowLeft,
  Sparkles,
  Heart,
  Award,
} from "lucide-react";
import { toast } from "react-toastify";

function VolunteerProfileView() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
      return;
    }
    if (user?.role !== "ADMIN") {
      navigate("/dashboard");
      return;
    }
    if (!userId) {
      navigate("/dashboard/accepted-volunteers");
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/user/${userId}`);
        const data = res?.data ?? res;
        setProfile(data);
      } catch (err) {
        toast.error(err?.message ?? "Failed to load profile");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [authLoading, user, navigate, userId]);

  if (authLoading || loading) return <Loading />;
  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto">
        <Link
          to="/dashboard/accepted-volunteers"
          className="inline-flex items-center gap-2 text-primary font-medium mb-6 hover:underline"
        >
          <ArrowLeft size={18} />
          Back to volunteers
        </Link>
        <p className="text-accent/70">Profile not found.</p>
      </div>
    );
  }

  const displayName =
    profile.firstName && profile.lastName
      ? `${profile.firstName} ${profile.lastName}`.trim()
      : profile.fullName || profile.email?.split("@")[0] || "Volunteer";

  const skills = profile.skills ?? [];
  const interests = profile.interests ?? [];
  const badges = profile.badges ?? [];

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/dashboard/accepted-volunteers"
        className="inline-flex items-center gap-2 text-primary font-medium mb-6 hover:underline"
      >
        <ArrowLeft size={18} />
        Back to volunteers
      </Link>

      <h1 className="font-bold text-primary mb-8 text-5xl">
        Volunteer profile
      </h1>

      <div className="rounded-2xl border border-primary/20 bg-white/60 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 bg-linear-to-br from-primary/10 to-accent/10 border-b border-primary/10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <User size={48} className="text-primary" />
            </div>
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-accent">{displayName}</h2>
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="mt-2 flex items-center justify-center sm:justify-start gap-2 text-accent/80 hover:text-primary transition-colors"
                >
                  <Mail size={18} className="shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </a>
              )}
              {profile.phoneNumber && (
                <p className="mt-1 text-sm text-accent/70">
                  {profile.phoneNumber}
                </p>
              )}
              {profile.role && (
                <span className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium px-3 py-1 rounded-full bg-primary/20 text-primary">
                  <Shield size={14} />
                  {profile.role}
                </span>
              )}
            </div>
          </div>
        </div>

        {skills.length > 0 && (
          <div className="p-6 md:p-8 border-b border-primary/10">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent/80 mb-3">
              <Sparkles size={18} />
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="px-3 py-1.5 rounded-full bg-primary/15 text-accent text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {interests.length > 0 && (
          <div className="p-6 md:p-8 border-b border-primary/10">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent/80 mb-3">
              <Heart size={18} />
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm"
                >
                  {i}
                </span>
              ))}
            </div>
          </div>
        )}

        {badges.length > 0 && (
          <div className="p-6 md:p-8 border-b border-primary/10">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent/80 mb-3">
              <Award size={18} />
              Badges
            </h3>
            <div className="flex flex-wrap gap-3">
              {badges.map((b, idx) => (
                <div
                  key={b?.name ?? idx}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/20 bg-primary/5"
                >
                  {b?.icon ? (
                    <span className="text-xl">{b.icon}</span>
                  ) : (
                    <Award size={20} className="text-primary" />
                  )}
                  <span className="font-medium text-accent">
                    {b?.name ?? "Badge"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length === 0 &&
          interests.length === 0 &&
          badges.length === 0 && (
            <div className="p-6 md:p-8 text-accent/60 text-sm">
              No skills, interests, or badges added yet.
            </div>
          )}
      </div>
    </div>
  );
}

export default VolunteerProfileView;
