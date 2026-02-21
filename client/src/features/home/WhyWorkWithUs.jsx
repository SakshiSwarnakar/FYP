import { ShieldHalf } from "lucide-react";

export default function WhyWorkWithUs() {
  const campaigns = [
    {
      title: "Find Causes That Matter",
      description:
        "From health and education to environment and community care, discover campaigns that truly resonate with you.",
    },
    {
      title: "Flexible Opportunities",
      description:
        "Volunteer on your schedule — short-term, long-term, remote, or on-ground opportunities available.",
    },
    {
      title: "Build Skills & Experience",
      description:
        "Gain hands-on experience, develop leadership skills, and strengthen your social impact profile.",
    },
  ];

  return (
    <section className="pb-18">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className=" text-primary text-3xl flex gap-2 justify-center items-center font-bold text-gray-900">
            <ShieldHalf size={28} /> Why work with us?
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Improve your social skills, get exposure to new ideas and community.
          </p>
        </div>

        {/* Campaign Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {campaigns.map((campaign, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition duration-300 cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {campaign.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {campaign.description}
              </p>

              <span className="inline-block mt-4 text-sm font-medium text-accent">
                Explore campaigns →
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
