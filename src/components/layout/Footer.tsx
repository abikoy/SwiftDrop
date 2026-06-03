import Link from "next/link";
import { Zap, Twitter, Instagram, Facebook, Linkedin } from "lucide-react";

const footerLinks = {
  Company: [
    { label: "About us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/blog" },
    { label: "Investors", href: "/investors" },
  ],
  Services: [
    { label: "Food delivery", href: "/restaurants" },
    { label: "Grocery", href: "/grocery" },
    { label: "Pharmacy", href: "/pharmacy" },
    { label: "Courier", href: "/courier" },
    { label: "Business", href: "/business" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Accessibility", href: "/accessibility" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#111827] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Brand col */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5 w-fit">
              <div className="w-9 h-9 bg-gradient-to-br from-[#FF6B00] to-[#FF3D00] rounded-[10px] flex items-center justify-center">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-display text-xl font-extrabold tracking-tight text-white">
                Swift<span className="text-[#FF6B00]">Drop</span>
              </span>
            </Link>
            <p className="text-sm text-[#6B7280] leading-relaxed mb-6 max-w-[260px]">
              Fast delivery for anything you need. Connecting you with local
              restaurants, stores, and couriers across 30+ cities.
            </p>
            <div className="flex gap-2.5">
              {[
                { Icon: Twitter, label: "Twitter" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Linkedin, label: "LinkedIn" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#FF6B00] hover:border-[#FF6B00]/30 hover:bg-[#FF6B00]/10 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-display text-sm font-bold text-white mb-5 tracking-wide">
                {heading}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#6B7280] hover:text-[#FF6B00] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-sm text-[#6B7280]">
            © {new Date().getFullYear()} SwiftDrop Technologies Inc. All rights
            reserved.
          </p>
          <div className="flex gap-3">
            {[
              { os: "🍎", store: "App Store", sub: "Download on the" },
              { os: "▶", store: "Google Play", sub: "Get it on" },
            ].map(({ os, store, sub }) => (
              <button
                key={store}
                className="flex items-center gap-2.5 bg-[#1A2035] border border-white/[0.08] rounded-xl px-4 py-2.5 hover:border-[#FF6B00]/30 transition-colors"
              >
                <span className="text-xl">{os}</span>
                <div className="text-left">
                  <div className="text-[10px] text-[#6B7280] leading-none">
                    {sub}
                  </div>
                  <div className="text-[13px] font-semibold text-white leading-tight mt-0.5">
                    {store}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
