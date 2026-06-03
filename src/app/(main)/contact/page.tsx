export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <div className="section-label mb-6">Get in touch</div>
      <h1 className="font-display text-5xl font-extrabold text-white mb-4 tracking-tight">
        Contact <span className="text-[#FF6B00]">Us</span>
      </h1>
      <p className="text-[#9CA3AF] mb-12">
        Have a question or need help? We&apos;re here for you 24/7.
      </p>
      <div className="glass-card p-8 rounded-2xl space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">First name</label>
            <input type="text" placeholder="John" className="w-full bg-[#1A2035] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#6B7280] outline-none focus:border-[#FF6B00]/50 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Last name</label>
            <input type="text" placeholder="Doe" className="w-full bg-[#1A2035] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#6B7280] outline-none focus:border-[#FF6B00]/50 transition-all" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Email</label>
          <input type="email" placeholder="you@example.com" className="w-full bg-[#1A2035] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#6B7280] outline-none focus:border-[#FF6B00]/50 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Message</label>
          <textarea rows={5} placeholder="How can we help?" className="w-full bg-[#1A2035] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#6B7280] outline-none focus:border-[#FF6B00]/50 transition-all resize-none" />
        </div>
        <button className="btn-orange w-full py-3.5 text-base">Send Message →</button>
      </div>
    </div>
  );
}
