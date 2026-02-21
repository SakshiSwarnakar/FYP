import { HeartPulse, GraduationCap, Leaf, PackageSearch } from "lucide-react";

export default function HowItWorks() {
  const campaigns = [
    {
      step: 1,
      title: "Create or Discover Campaigns",
      description:
        "Organizers create impactful campaigns while volunteers explore causes aligned with their passion and availability.",
    },
    {
      step: 2,
      title: "Apply & Connect",
      description:
        "Volunteers apply with a single click. Organizers review profiles, skills, and availability before accepting.",
    },
    {
      step: 3,
      title: "Collaborate & Make Impact",
      description:
        "Work together on the ground or remotely, track participation, and create real change in communities.",
    },
  ];

  return (
    <section className="pb-18">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="flex gap-2 justify-center items-center text-primary text-3xl font-bold text-gray-900">
            <PackageSearch size={28} /> How It Works?
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Know the process and be a part of our massive team.
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
