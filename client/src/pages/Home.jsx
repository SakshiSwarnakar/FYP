import { useState } from "react";
import { ChevronRight, Megaphone } from "lucide-react";
import CampaignCard from "../features/campaign/CampaignCard";
import CategoryTabs from "../features/home/CategoryTab";
import CampaignFeatures from "../features/home/Features";
import HeroSection from "../features/home/HeroSection";
import Loading from "../components/Loading";
import { useCampaign } from "../context/CampaignContext";
import HowItWorks from "../features/home/HowItWorks";
import WhyWorkWithUs from "../features/home/WhyWorkWithUs";
import { Link } from "react-router";

function Home() {

  const { status, campaigns, choseCampaign, handleRegister } = useCampaign();
  const isLoading = status === "loading";

  // const campaignList = Array.isArray(campaigns)
  //   ? campaigns
  //   : campaigns?.data ?? [];
  // const filteredCampaigns =
  //   selectedCategory == null
  //     ? campaignList
  //     : campaignList.filter(
  //       (c) => c.category?.toLowerCase() === selectedCategory?.toLowerCase()
  //     );

  // const hasNoCampaignsToShow = filteredCampaigns.length === 0;
  // const showEmptyState = !isLoading && hasNoCampaignsToShow;
  // const isCategoryFilter = campaignList.length > 0 && hasNoCampaignsToShow;

  return (
    <div>
      <HeroSection />
      <CampaignFeatures />
      <HowItWorks />
      <WhyWorkWithUs />
      <CategoryTabs />
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-5xl text-primary font-bold">Latest Campaign</h1>
            <p className="text-lg text-gray-500">
              Explore what's happening around you.
            </p>
          </div>
          <Link
            to="/campaign"
            className="flex gap-1 items-center font-semibold text-primary bg-primary/5 rounded-lg hover:bg-primary hover:text-white duration-150 px-6 py-3"
          >
            View all <ChevronRight />
          </Link>
        </div>

        {isLoading && (
          <div className="mt-8">
            <Loading />
          </div>
        )}

        {!isLoading && !campaigns?.length && (
          <div className="mt-8 rounded-2xl border border-primary/20 bg-white/60 shadow-sm overflow-hidden">
            <NoCampaignsFound />
          </div>
        )}

        {!isLoading && campaigns?.length > 0 && (
          <div className="grid-container mt-6">
            {campaigns.slice(0, 4).map((event) => (
              <CampaignCard
                key={event.id}
                campaign={event}
                choseCampaign={choseCampaign}
                handleRegister={handleRegister}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;


export function NoCampaignsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 shadow-inner">
        <Megaphone className="w-12 h-12 text-primary/70" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-bold text-accent mb-2">
        No campaigns found
      </h2>
      <p className="text-accent/70 max-w-sm mx-auto">
        There are no campaigns right now.
      </p>
    </div>
  );
}