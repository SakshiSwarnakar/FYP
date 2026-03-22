import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import Loading from "../components/Loading";
import { useCampaign } from "../context/CampaignContext";
import CampaignCard from "../features/campaign/CampaignCard";
import { NoCampaignsFound } from "./Home";

export default function Campaign() {
  const { campaigns, status, fetchCampaigns, handlePagination } = useCampaign();
  const pagination = campaigns && campaigns?.pagination?.totalPages;
  const currentPage = Number(campaigns?.pagination?.page);
  const totalPages = campaigns?.pagination?.totalPages;

  useEffect(() => {
    fetchCampaigns();
  }, []);

  if (status == "loading") {
    return <Loading />;
  }
  return (
    <div className="container mx-auto px-4 py-10">
      {/* ── Page Header ── */}
      <div className="mb-10">
        <h2 className="text-5xl font-bold text-primary tracking-tight leading-tight">
          Campaigns
        </h2>
        <p className="mt-2 text-gray-400 text-sm">
          {campaigns?.pagination?.totalDocs ?? 0} campaigns available
        </p>
        <div className="mt-4 w-12 h-1 rounded-full bg-primary/40" />
      </div>

      {/* ── Grid ── */}
      {campaigns?.campaigns?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.campaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-primary/15 bg-white shadow-sm overflow-hidden">
          <NoCampaignsFound isCategoryFilter={null} />
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 0 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {/* Prev */}
          <button
            onClick={() => handlePagination(currentPage - 1)}
            disabled={!campaigns.pagination.hasPrevPage}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-primary/20 text-primary bg-white hover:bg-primary/5 hover:-translate-y-px disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all shadow-sm"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page Numbers */}
          {Array.from({ length: pagination }, (_, i) => {
            const page = i + 1;
            const isActive = currentPage === page;
            return (
              <button
                key={page}
                onClick={() => !isActive && handlePagination(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-all shadow-sm ${
                  isActive
                    ? "bg-primary text-white shadow-primary/25 shadow-md scale-105 cursor-default"
                    : "border border-primary/20 text-primary bg-white hover:bg-primary/5 hover:-translate-y-px"
                }`}
              >
                {page}
              </button>
            );
          })}

          {/* Next */}
          <button
            onClick={() => handlePagination(currentPage + 1)}
            disabled={!campaigns.pagination.hasNextPage}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-primary/20 text-primary bg-white hover:bg-primary/5 hover:-translate-y-px disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all shadow-sm"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Page indicator */}
      {totalPages > 1 && (
        <p className="mt-3 text-center text-xs text-gray-400">
          Page {currentPage} of {totalPages}
        </p>
      )}
    </div>
  );
}
