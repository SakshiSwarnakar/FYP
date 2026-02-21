export const getCampaignPhase = (campaign) => {
  const now = new Date();

  if (campaign.status === "DRAFT") return "DRAFT";

  if (!campaign.startDate || !campaign.endDate) return "UNKNOWN";

  const start = new Date(campaign.startDate);
  const end = new Date(campaign.endDate);

  if (now < start) return "UPCOMING";
  if (now <= end) return "ONGOING";

  return "COMPLETED";
};
