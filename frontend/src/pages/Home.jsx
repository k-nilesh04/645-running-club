import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import FAQ from "../components/FAQ.jsx";
import PhotoGallery from "../components/PhotoGallery.jsx";
import { getCommunityHighlights } from "../api/api.js";

const runOptions = [
  { distance: "03", unit: "KM", title: "The easy start", description: "A relaxed route to build confidence and enjoy the morning.", tag: "Beginner friendly" },
  { distance: "05", unit: "KM", title: "Find your rhythm", description: "A little more distance. A steady pace. A great feeling.", tag: "Most popular" },
  { distance: "10", unit: "KM", title: "Push your limits", description: "For runners ready to stretch their distance and challenge.", tag: "For the bold" },
];
const values = [
  { number: "01", title: "Move for health", description: "Make movement a natural part of your week.", icon: "✳" },
  { number: "02", title: "Find your people", description: "Meet neighbours who make every kilometre better.", icon: "↗" },
  { number: "03", title: "Grow together", description: "No race to win. Just progress worth celebrating.", icon: "⌁" },
];
const benefits = ["A healthier heart and stronger body", "A clearer head and better mood", "A routine that actually sticks", "New friends and shared motivation"];

function CommunityHighlights() {
  const [data, setData] = useState(null);
  useEffect(() => {
    let active = true;
    getCommunityHighlights()
      .then(({ data: response }) => { if (active && response.success) setData(response); })
      .catch(() => { if (active) setData(null); });
    return () => { active = false; };
  }, []);
  if (!data) return null;
  const stats = [
    { label: "Runs held this month", value: data.monthly.runsHeld },
    { label: "Runner check-ins", value: data.monthly.runnerCheckIns },
    { label: "People who showed up", value: data.monthly.uniqueRunners },
    { label: "Kilometres hosted", value: data.monthly.routeKmHosted },
  ];
  return (
    <section className="section !py-12">
      <div className="stats-panel rounded-[2rem] p-6 sm:p-9">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="eyebrow">The community in motion</p><h2 className="section-title mt-3">Small steps. Real momentum.</h2></div>
          <p className="text-xs text-white/40">{data.month}</p>
        </div>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat) => <div key={stat.label} className="border-l border-[#a9e66e]/35 pl-4"><p className="font-display text-3xl font-bold tracking-tight text-white md:text-4xl">{stat.value}</p><p className="mt-2 text-xs leading-5 text-white/50">{stat.label}</p></div>)}
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="eyebrow">Weekly shout-out</p><p className="mt-2 font-display text-xl font-semibold text-white">{data.weeklySpotlight?.name || "Your name could be next."}</p><p className="mt-1 text-xs text-white/45">{data.weeklySpotlight ? `Attended ${data.weeklySpotlight.checkIns} ${data.weeklySpotlight.checkIns === 1 ? "run" : "runs"} this week` : "Keep showing up. Your moment is coming."}</p></div>
          <span className="inline-flex w-fit items-center rounded-full border border-[#a9e66e]/25 bg-[#a9e66e]/10 px-4 py-2 text-xs font-semibold text-[#d0f2b0]">Community powered</span>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <Hero />

      <section id="sunday-run" className="section scroll-mt-24">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl"><p className="eyebrow">Your weekend, reimagined</p><h2 className="section-title mt-3 text-4xl sm:text-5xl">Make room for a <span className="text-[#a9e66e]">better</span> morning.</h2></div>
          <p className="max-w-md text-sm leading-7 text-white/55">A simple weekly ritual that brings fresh air, good energy and great people into your life. No pressure. Just show up.</p>
        </div>
        <div className="grid gap-3 rounded-[2rem] border border-white/10 bg-white/[.025] p-3 sm:grid-cols-3 sm:p-4">
          <div className="rounded-2xl bg-[#122319] p-5"><p className="eyebrow">When we meet</p><p className="mt-3 font-display text-3xl font-bold text-white">Sunday</p><p className="mt-1 text-sm text-white/45">Every single week</p></div>
          <div className="rounded-2xl bg-[#122319] p-5"><p className="eyebrow">Meet-up time</p><p className="mt-3 font-display text-3xl font-bold text-white">6:15 <span className="text-lg text-[#a9e66e]">AM</span></p><p className="mt-1 text-sm text-white/45">Start your day right</p></div>
          <div className="rounded-2xl bg-[#122319] p-5"><p className="eyebrow">Our meeting point</p><p className="mt-3 font-display text-2xl font-bold text-white">19B Park</p><p className="mt-1 text-sm text-white/45">Dwarka, New Delhi</p></div>
        </div>
      </section>

      <section className="distance-section border-y border-white/10">
        <div className="section">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="eyebrow">Choose your own pace</p><h2 className="section-title mt-3 text-4xl sm:text-5xl">Every runner has a <span className="text-[#a9e66e]">starting line.</span></h2></div><p className="max-w-sm text-sm leading-7 text-white/50">Walk it. Jog it. Run it. The only pace that matters is yours.</p></div>
          <div className="grid gap-4 lg:grid-cols-3">
            {runOptions.map((run, index) => <article key={run.distance} className={`distance-card group relative overflow-hidden rounded-[1.75rem] p-6 sm:p-7 ${index === 1 ? "distance-card-featured" : ""}`}>
              <div className="flex items-start justify-between"><span className="font-display text-6xl font-bold tracking-[-.07em] text-white">{run.distance}<span className="ml-1 text-xl text-[#a9e66e]">{run.unit}</span></span><span className="rounded-full border border-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white/45">{run.tag}</span></div>
              <div className="mt-12"><h3 className="font-display text-xl font-bold text-white">{run.title}</h3><p className="mt-3 min-h-[3.5rem] text-sm leading-6 text-white/50">{run.description}</p></div>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4"><span className="text-xs text-white/35">645 Run Club</span><span className="text-lg text-[#a9e66e] transition-transform group-hover:translate-x-1">↗</span></div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
          <div><p className="eyebrow">More than a run</p><h2 className="section-title mt-3 text-4xl sm:text-5xl">Good for your body.<br /><span className="text-[#a9e66e]">Great for your soul.</span></h2><p className="mt-5 max-w-md text-sm leading-7 text-white/55">We believe feeling better starts with small, consistent steps. Join a welcoming group where every effort counts and every person belongs.</p><div className="mt-7 flex flex-wrap gap-3"><NavLink to="/about" className="btn-primary">Our story <span aria-hidden="true">↗</span></NavLink><NavLink to="/join" className="hero-secondary">Become a member</NavLink></div></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => <article key={value.number} className="value-card rounded-3xl p-5"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#a9e66e]/10 text-xl text-[#b9ed89]">{value.icon}</span><p className="mt-7 text-xs font-bold tracking-widest text-[#a9e66e]">{value.number}</p><h3 className="mt-2 font-display text-lg font-bold text-white">{value.title}</h3><p className="mt-2 text-xs leading-6 text-white/50">{value.description}</p></article>)}
          </div>
        </div>
      </section>

      <CommunityHighlights />

      <section className="section !pt-8">
        <PhotoGallery />
        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[.025] p-5 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-xl text-sm leading-6 text-white/55">The best part of running is the people you meet along the way. Share your Sunday moments with us.</p><a href="https://instagram.com/645_runclub" target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#b9ed89] transition hover:text-white">Share your story ↗</a></div>
      </section>

      <section className="section !pt-0">
        <div className="benefits-panel grid gap-8 rounded-[2rem] p-7 sm:p-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div><p className="eyebrow">A little goes a long way</p><h2 className="section-title mt-3 text-3xl sm:text-4xl">Your body will<br />thank you for it.</h2></div>
          <div className="grid gap-3 sm:grid-cols-2">{benefits.map((benefit) => <p key={benefit} className="flex items-start gap-3 border-b border-white/10 py-3 text-sm text-white/70"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#a9e66e]/15 text-[11px] text-[#b9ed89]">✓</span>{benefit}</p>)}</div>
        </div>
      </section>

      <section className="section !pt-0">
        <div className="mb-7"><p className="eyebrow">Find your way here</p><h2 className="section-title mt-3 text-3xl sm:text-4xl">Meet us at Dwarka Sector 19B Park.</h2><p className="mt-2 text-sm text-white/50">Your Sunday morning starts here.</p></div>
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 p-2"><div className="relative h-[300px] w-full overflow-hidden rounded-2xl sm:h-[400px]"><iframe title="Dwarka Sector 19B Park map" src="https://www.google.com/maps?q=19B+Park,+Dwarka,+Sector+19,+New+Delhi&output=embed" className="absolute inset-0 h-full w-full border-0" allowFullScreen loading="lazy" /></div></div>
      </section>

      <section className="section !pt-0">
        <div className="mb-7"><p className="eyebrow">Good to know</p><h2 className="section-title mt-3 text-3xl sm:text-4xl">A few things you might wonder.</h2></div>
        <FAQ />
      </section>
    </div>
  );
}