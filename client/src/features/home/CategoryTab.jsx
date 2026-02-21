import { useState } from "react";
import { useCampaign } from "../../context/CampaignContext";

const categories = ["Health", "Education", "Environment", "Social Work"];

export default function CategoryTabs() {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const { fetchCampaigns } = useCampaign()
    const handleTabClick = (category) => {
        setSelectedCategory(category)
        fetchCampaigns({ category })
    };

    return (
        <div className="flex flex-wrap gap-2 px-2 md:px-0 md:gap-6 justify-center container py-8 mx-auto">
            <button
                onClick={() => handleTabClick(null)}
                className={`cursor-pointer px-2 md:py-2 md:px-4 py-1 text-xs md:text-sm font-medium rounded-full transition-all
                    ${selectedCategory == null
                        ? "border-2 border-primary text-primary"
                        : "text-accent border-2 border-accent hover:bg-secondary hover:scale-105 hover:shadow-xl"
                    }`}
            >
                All
            </button>
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => handleTabClick(category)}
                    className={`cursor-pointer px-2 md:py-2 md:px-4 py-1 text-xs md:text-sm font-medium rounded-full transition-all
                        ${selectedCategory === category
                            ? "border-2 border-primary text-primary"
                            : "text-accent border-2 border-accent hover:bg-secondary hover:scale-105 hover:shadow-xl"
                        }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
