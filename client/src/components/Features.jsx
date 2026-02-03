import { HeartPulse, GraduationCap, Leaf } from "lucide-react";

export default function CampaignCategories() {
    const campaigns = [
        {
            icon: <HeartPulse className="w-8 h-8" />,
            title: "Health & Relief Campaigns",
            description:
                "Support medical camps, blood donation drives, disaster relief efforts, and emergency response programs.",
        },
        {
            icon: <GraduationCap className="w-8 h-8" />,
            title: "Education & Youth Programs",
            description:
                "Volunteer in literacy drives, mentorship programs, school rebuilding projects, and skill development initiatives.",
        },
        {
            icon: <Leaf className="w-8 h-8" />,
            title: "Environment & Community Care",
            description:
                "Join clean-up drives, tree plantation campaigns, wildlife protection, and sustainable community projects.",
        },
    ];

    return (
        <section className="pb-18">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Campaigns You Can Volunteer For
                    </h2>
                    <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
                        Discover meaningful campaigns and contribute your time, skills,
                        and energy where it matters most.
                    </p>
                </div>

                {/* Campaign Cards */}
                <div className="grid gap-6 md:grid-cols-3">
                    {campaigns.map((campaign, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition duration-300 cursor-pointer"
                        >
                            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-primary to-accent text-secondary mb-4">
                                {campaign.icon}
                            </div>

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
