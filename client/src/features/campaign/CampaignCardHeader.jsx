function CampaignCardHeader({ title, campaign }) {
  return (
    <div className="relative w-full overflow-hidden rounded-t-2xl">
      <img
        loading="lazy"
        className="w-full h-56 object-cover transform transition-transform duration-500 group-hover:scale-105"
        src={
          campaign?.attachments?.[0]?.url ||
          `[placehold.co](https://placehold.co/600x400?text=${encodeURIComponent(title)})`
        }
        alt={title}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent opacity-60"></div>
    </div>
  );
}

export default CampaignCardHeader;
