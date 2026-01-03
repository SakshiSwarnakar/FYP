export default function HeroSection() {
    return (
        <section className="min-h-[90vh] grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] items-center container mx-auto overflow-hidden gap-12">
            {/* Content */}
            <div className="pointer-events-none min-h-screen  left-0 w-full top-0 absolute  bg-linear-to-b from-primary/10 via-accent/10 to-transparent" />

            <div className="max-w-xl">
                <span className="inline-flex items-center rounded-full bg-secondary text-accent px-4 py-1 text-sm font-medium mb-5">
                    🚀 Community Campaign
                </span>

                <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-tight text-text">
                    Together We Can{' '}
                    <span className="text-primary">Make Change Happen</span>
                </h1>

                <p className="mt-6 text-base text-neutral-600">
                    Join our campaign to empower communities, create real impact, and build a
                    better future—one step at a time.
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                    <button className="rounded-xl bg-linear-to-br from-primary to-accent px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5">
                        Join Campaign
                    </button>

                    <button className="rounded-xl border-2 border-border px-6 py-3 font-semibold text-accent transition hover:bg-secondary">
                        Learn More
                    </button>
                </div>
            </div>

            {/* Visual */}
            <div className="relative hidden lg:block">
                <img
                    src="/hero_social_serve.jpg"
                    alt="Campaign"
                    className="relative rounded-3xl object-cover"
                />
            </div>
        </section >
    )
}