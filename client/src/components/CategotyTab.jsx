import { useState } from "react";

const categories = ["Health", "Education", "Environment", "Social Work"];

export default function CategoryTabs({ onChange }) {
    const [activeTab, setActiveTab] = useState(null);

    const handleTabClick = (category) => {
        setActiveTab(category);
        onChange?.(category);
    };

    return (
        <div className="flex gap-2 px-2 md:px-0 md:gap-6 justify-center container py-8 mx-auto">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => handleTabClick(category)}
                    className={` cursor-pointer px-2 md:py-2 md:px-4 py-1 text-xs md:text-sm font-medium rounded-full transition-all
              ${activeTab === category
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
