import {
  Bookmark,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router";
import Loading from "../../components/Loading";
import { useCampaign } from "../../context/CampaignContext";
import { NoCampaignsFound } from "../../pages/Home";

function InfoRow({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2.5 text-xs text-gray-500/90">
      <Icon
        size={13}
        className="text-primary/60 flex-shrink-0"
        strokeWidth={2.1}
      />
      <span className="truncate font-normal tracking-tight">{label}</span>
    </div>
  );
}

export default function TaskList() {
  const { campaigns, status, fetchCampaigns, handlePagination } = useCampaign();
  const currentPage = Number(campaigns?.pagination?.page || 1);
  const totalPages = Number(campaigns?.pagination?.totalPages || 1);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  if (status === "loading") return <Loading />;

  const hasCampaigns = campaigns?.campaigns?.length > 0;

  return (
    <div className="flex flex-col w-full gap-8 md:gap-10 pb-6">
      {/* ── Campaign Grid ── */}
      {hasCampaigns ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {campaigns.campaigns.map((campaign) => (
            <Link
              to={`${campaign.id}`}
              key={campaign.id}
              className={`
                group relative flex flex-col bg-white
                border border-primary/10 rounded-2xl
                shadow-sm hover:shadow-lg hover:shadow-primary/5
                transition-all duration-300 ease-out
                hover:-translate-y-1 active:translate-y-0
                overflow-hidden
              `}
            >
              {/* Subtle top gradient accent */}
              <div className="h-1 w-full bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />

              <div className="flex flex-col flex-1 p-5 gap-4">
                {/* Title + Badge */}
                <div className="flex items-start justify-between gap-3">
                  <h4
                    className="
                    text-base font-semibold text-gray-800
                    leading-tight line-clamp-2
                    group-hover:text-primary transition-colors
                  "
                  >
                    {campaign.title}
                  </h4>

                  <span
                    className="
                    inline-flex items-center shrink-0
                    text-xs font-medium px-2.5 py-1
                    rounded-full bg-primary/6 text-primary
                    border border-primary/12 uppercase tracking-wide
                  "
                  >
                    {campaign?.phase || "pending"}
                  </span>
                </div>

                {/* Metadata */}
                <div className="flex flex-col gap-2.5 mt-1">
                  <InfoRow
                    icon={Bookmark}
                    label={campaign.category || "No category"}
                  />
                  <InfoRow
                    icon={MapPin}
                    label={campaign.location || "Remote / Not specified"}
                  />
                  <InfoRow
                    icon={CalendarDays}
                    label={
                      campaign.startDate
                        ? new Date(campaign.startDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "—"
                    }
                  />
                </div>

                {/* Footer hint */}
                <div
                  className="
                  mt-auto pt-4 border-t border-gray-100/70
                  flex items-center justify-between text-sm
                "
                >
                  <span
                    className="
                    text-xs font-medium text-primary/70
                    opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0
                    transition-all duration-300 ease-out
                  "
                  >
                    View campaign tasks →
                  </span>

                  <div
                    className="
                    w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center
                    text-primary/70 group-hover:bg-primary/15 group-hover:text-primary
                    transition-all duration-300 group-hover:scale-105
                  "
                  >
                    <ChevronRight size={15} strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              {/* Gentle hover ring */}
              <div
                className="
                absolute inset-0 rounded-2xl pointer-events-none
                border border-primary/0 group-hover:border-primary/15
                transition-colors duration-400
              "
              />
            </Link>
          ))}
        </div>
      ) : (
        <div
          className="
          mt-6 rounded-2xl border border-primary/8
          bg-white/60 backdrop-blur-sm shadow-sm
        "
        >
          <NoCampaignsFound isCategoryFilter={null} />
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-6">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={() => handlePagination(currentPage - 1)}
              disabled={currentPage <= 1}
              className="
                w-10 h-10 flex items-center justify-center rounded-xl
                border border-primary/15 text-primary/80 bg-white
                hover:bg-primary/5 hover:border-primary/30 hover:text-primary
                disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-primary/15
                transition-all duration-200 active:scale-95 shadow-sm
              "
              aria-label="Previous page"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => {
              const page = i + 1;
              const isActive = currentPage === page;
              const isNearCurrent = Math.abs(page - currentPage) <= 2;
              const showPage =
                isNearCurrent || page === 1 || page === totalPages;

              if (!showPage) {
                if (page === 2 || page === totalPages - 1) {
                  return (
                    <span
                      key={page}
                      className="w-10 h-10 flex items-center justify-center text-gray-400"
                    >
                      …
                    </span>
                  );
                }
                return null;
              }

              return (
                <button
                  key={page}
                  onClick={() => handlePagination(page)}
                  className={`
                    w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium
                    transition-all duration-200 shadow-sm active:scale-95
                    ${
                      isActive
                        ? "bg-primary text-white shadow-primary/25 scale-105"
                        : "border border-primary/15 text-primary/90 bg-white hover:bg-primary/5 hover:border-primary/25"
                    }
                  `}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePagination(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="
                w-10 h-10 flex items-center justify-center rounded-xl
                border border-primary/15 text-primary/80 bg-white
                hover:bg-primary/5 hover:border-primary/30 hover:text-primary
                disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-primary/15
                transition-all duration-200 active:scale-95 shadow-sm
              "
              aria-label="Next page"
            >
              <ChevronRight size={18} strokeWidth={2.5} />
            </button>
          </div>

          <p className="text-xs text-gray-500/80 font-light tracking-wide">
            Page <strong className="text-gray-700">{currentPage}</strong> of{" "}
            {totalPages}
          </p>
        </div>
      )}
    </div>
  );
}
