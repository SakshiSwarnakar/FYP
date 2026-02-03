import { Facebook, Twitter, Instagram, Mail } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="relative bg-bg border-t border-border">
            {/* subtle linear accent */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-secondary/70 to-transparent" />

            <div className="relative mx-auto container px-6 md:px-0 py-16">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-bold text-text">
                            Campaign<span className="text-primary">.</span>
                        </h3>
                        <p className="mt-4 max-w-md text-sm text-neutral-600">
                            Building stronger communities through action, transparency, and
                            collective effort. Your voice matters.
                        </p>

                        <div className="mt-6 flex gap-4">
                            <a
                                href="#"
                                className="rounded-lg border border-border p-2 text-accent transition hover:bg-secondary"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="#"
                                className="rounded-lg border border-border p-2 text-accent transition hover:bg-secondary"
                            >
                                <Twitter size={18} />
                            </a>
                            <a
                                href="#"
                                className="rounded-lg border border-border p-2 text-accent transition hover:bg-secondary"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="#"
                                className="rounded-lg border border-border p-2 text-accent transition hover:bg-secondary"
                            >
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold text-text">Campaign</h4>
                        <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                            <li><a href="#" className="hover:text-primary">About</a></li>
                            <li><a href="#" className="hover:text-primary">Goals</a></li>
                            <li><a href="#" className="hover:text-primary">Volunteers</a></li>
                            <li><a href="#" className="hover:text-primary">Updates</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-text">Support</h4>
                        <ul className="mt-4 space-y-2 text-sm text-neutral-600">
                            <li><a href="#" className="hover:text-primary">Contact</a></li>
                            <li><a href="#" className="hover:text-primary">FAQ</a></li>
                            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary">Terms</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-16 flex flex-col gap-4 border-t border-border pt-6 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
                    <p>© {new Date().getFullYear()} Campaign. All rights reserved.</p>
                    <p className="text-neutral-400">Made with purpose • Powered by community</p>
                </div>
            </div>
        </footer>
    )
}
