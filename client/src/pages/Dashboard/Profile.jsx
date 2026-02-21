import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../axios/axios";
import { toast } from "react-toastify";
import {
  CheckCircle2,
  Mail,
  User,
  XCircle,
  CalendarDays,
  Shield,
  Award,
  Sparkles,
  Heart,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import Loading from "../../components/Loading";

function VolunteerProfile() {
  const navigate = useNavigate();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
      return;
    }
    if (!user?.id) return;

    const loadProfile = async () => {
      try {
        const res = await api.get("/user/profile");
        const data = res?.data ?? res;
        setProfile(data);
        setSkills(Array.isArray(data?.skills) ? data.skills : []);
        setInterests(Array.isArray(data?.interests) ? data.interests : []);
      } catch (_) {
        setProfile({});
        setSkills(Array.isArray(user?.skills) ? user.skills : []);
        setInterests(Array.isArray(user?.interests) ? user.interests : []);
      } finally {
        setProfileLoading(false);
      }
    };
    loadProfile();
  }, [authLoading, user?.id, navigate, user?.skills, user?.interests]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.put("/user/profile", { skills, interests });
      toast.success("Profile updated");
      await refreshUser?.();
    } catch (err) {
      toast.error(err?.message ?? "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const v = skillInput.trim();
    if (v && !skills.includes(v)) {
      setSkills([...skills, v]);
      setSkillInput("");
    }
  };

  const removeSkill = (s) => setSkills(skills.filter((x) => x !== s));

  const addInterest = () => {
    const v = interestInput.trim();
    if (v && !interests.includes(v)) {
      setInterests([...interests, v]);
      setInterestInput("");
    }
  };

  const removeInterest = (i) => setInterests(interests.filter((x) => x !== i));

  if (authLoading || profileLoading) return <Loading />;
  if (!user) return null;

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : user.fullName || user.email?.split("@")[0] || "Volunteer";

  const badges = profile?.badges ?? user?.badges ?? [];
  const hasSkills = skills.length > 0;
  const hasInterests = interests.length > 0;
  const hasBadges = Array.isArray(badges) && badges.length > 0;
  const dirty =
    JSON.stringify(skills) !== JSON.stringify(profile?.skills ?? []) ||
    JSON.stringify(interests) !== JSON.stringify(profile?.interests ?? []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-bold text-primary mb-8 text-5xl">Profile</h1>

      <div className="rounded-2xl border border-primary/20 bg-white/60 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 bg-linear-to-br from-primary/10 to-accent/10 border-b border-primary/10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <User size={48} className="text-primary" />
            </div>
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-accent">{displayName}</h2>
              {user.email && (
                <a
                  href={`mailto:${user.email}`}
                  className="mt-2 flex items-center justify-center sm:justify-start gap-2 text-accent/80 hover:text-primary transition-colors"
                >
                  <Mail size={18} className="shrink-0" />
                  <span className="truncate">{user.email}</span>
                </a>
              )}
              {user.role && (
                <span className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium px-3 py-1 rounded-full bg-primary/20 text-primary">
                  <Shield size={14} />
                  {user.role}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="p-6 md:p-8 border-b border-primary/10">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent/80 mb-3">
            <Sparkles size={18} />
            Skills
          </h3>
          {hasSkills ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/15 text-accent text-sm"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSkill(s)}
                    className="p-0.5 rounded hover:bg-primary/20"
                    aria-label={`Remove ${s}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-accent/60 text-sm mb-4">No skills added yet.</p>
          )}
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              placeholder="Add a skill"
              className="flex-1 min-w-[140px] px-3 py-2 rounded-lg border border-primary/20 text-accent placeholder:text-accent/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="button"
              onClick={addSkill}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary/20 text-primary font-medium hover:bg-primary/30 transition-colors"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
        </div>

        {/* Interests */}
        <div className="p-6 md:p-8 border-b border-primary/10">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent/80 mb-3">
            <Heart size={18} />
            Interests
          </h3>
          {hasInterests ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {interests.map((i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm"
                >
                  {i}
                  <button
                    type="button"
                    onClick={() => removeInterest(i)}
                    className="p-0.5 rounded hover:bg-accent/20"
                    aria-label={`Remove ${i}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-accent/60 text-sm mb-4">No interests added yet.</p>
          )}
          <div className="flex flex-wrap gap-2">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addInterest())
              }
              placeholder="Add an interest"
              className="flex-1 min-w-[140px] px-3 py-2 rounded-lg border border-primary/20 text-accent placeholder:text-accent/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="button"
              onClick={addInterest}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-primary/20 text-primary font-medium hover:bg-primary/30 transition-colors"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
        </div>

        {/* Badges (read-only) */}
        <div className="p-6 md:p-8 border-b border-primary/10">
          <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-accent/80 mb-3">
            <Award size={18} />
            Badges
          </h3>
          {hasBadges ? (
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
                  <span className="font-medium text-accent">{b?.name ?? "Badge"}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-accent/60 text-sm">No badges yet. Complete events to earn badges.</p>
          )}
        </div>

        {/* Save */}
        {dirty && (
          <div className="p-6 md:p-8 bg-primary/5 border-b border-primary/10">
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : null}
              <span>{saving ? "Saving…" : "Save skills & interests"}</span>
            </button>
          </div>
        )}

        {user.role === "VOLUNTEER" && (
          <div className="p-6 md:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent/70 mb-4">
              Quick links
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/dashboard/accepted"
                className="flex items-center gap-3 p-4 rounded-xl border border-primary/20 bg-white hover:bg-primary/5 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={22} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-accent">Accepted events</p>
                  <p className="text-xs text-accent/60">
                    Campaigns where you were accepted
                  </p>
                </div>
              </Link>
              <Link
                to="/dashboard/rejected"
                className="flex items-center gap-3 p-4 rounded-xl border border-primary/20 bg-white hover:bg-primary/5 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                  <XCircle size={22} className="text-red-600" />
                </div>
                <div>
                  <p className="font-semibold text-accent">Rejected events</p>
                  <p className="text-xs text-accent/60">
                    Applications that were not accepted
                  </p>
                </div>
              </Link>
            </div>
          </div>
        )}

        <div className="px-6 md:px-8 py-4 border-t border-primary/10 bg-primary/5">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <CalendarDays size={16} />
            Back to My Events
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VolunteerProfile;
