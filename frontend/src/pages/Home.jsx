import { NavLink } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import FAQ from "../components/FAQ.jsx";

const runOptions = [
  { distance: "3 KM", title: "Start easy", description: "A comfortable distance to get moving and build a routine." },
  { distance: "5 KM", title: "Find your pace", description: "A little more distance for runners finding their rhythm." },
  { distance: "10 KM", title: "Go further", description: "A longer route for those ready to challenge themselves." },
];

const values = [
  { number: "01", title: "Health", description: "Make movement part of your week." },
  { number: "02", title: "People", description: "Meet neighbours who enjoy being active." },
  { number: "03", title: "Consistency", description: "Progress comes from showing up." },
];

const benefits = ["Support your heart health", "Clear your head", "Build a steady routine", "Meet new people", "Enjoy your neighbourhood"];

export default function Home() {
  return (
    <div>
      <Hero />

      <section id="sunday-run" className="section scroll-mt-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">A simple weekly ritual</p>
            <h2 className="section-title mt-3">Make Sunday count.</h2>
            <p className="max-w-lg leading-7 text-offwhite/65">Meet us at Dwarka Sector 19B Park. Choose a distance, move at your own pace and enjoy the morning with the community.</p>
          </div>
          <div className="grid grid-cols-3 border-y border-white/10 py-5">
            <div className="pr-3"><p className="text-xs text-offwhite/45">When</p><p className="mt-2 font-display text-lg font-semibold text-white">Sunday</p></div>
            <div className="border-l border-white/10 px-4"><p className="text-xs text-offwhite/45">Meet</p><p className="mt-2 font-display text-lg font-semibold text-primary">6:15 AM</p></div>
            <div className="border-l border-white/10 pl-4"><p className="text-xs text-offwhite/45">Where</p><p className="mt-2 font-display text-lg font-semibold text-white">19B Park</p></div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/10">
        <div className="section">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Pick your distance</p><h2 className="section-title mt-3">There’s a pace for everyone.</h2></div>
            <p className="max-w-sm text-sm leading-6 text-offwhite/55">No pressure to be fast. Just choose what feels right for you.</p>
          </div>
          <div className="grid gap-0 md:grid-cols-3">
            {runOptions.map((run, index) => (
              <article key={run.distance} className={`border-t border-white/10 py-6 md:px-6 md:py-5 ${index === 1 ? "md:border-x md:border-white/10" : "md:px-0"}`}>
                <p className="font-display text-4xl font-bold text-primary">{run.distance}</p>
                <h3 className="mt-5 font-display text-xl font-semibold text-white">{run.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-6 text-offwhite/55">{run.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="border-l-2 border-primary pl-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">The 645 idea</p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-white md:text-4xl">Run a little.<br />Feel a lot better.</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-offwhite/60">We're here to make fitness feel welcoming and doable. Come as you are, and let the habit grow.</p>
            <NavLink to="/join" className="btn-primary mt-7">Become a member</NavLink>
          </div>
          <div className="grid gap-0 sm:grid-cols-3">
            {values.map((value) => (
              <article key={value.title} className="border-t border-white/10 py-5 sm:px-4">
                <p className="text-xs font-semibold text-primary">{value.number}</p>
                <h3 className="mt-8 font-display text-xl font-semibold text-white">{value.title}</h3>
                <p className="mt-2 text-sm leading-6 text-offwhite/55">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-4">
        <div className="grid gap-8 border-y border-white/10 py-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Why run with us?</p><h2 className="section-title mt-3">Good for your body.<br />Good for your week.</h2></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {benefits.map((benefit) => <p key={benefit} className="border-b border-white/10 py-3 text-sm text-offwhite/75"><span className="mr-3 text-primary">✓</span>{benefit}</p>)}
          </div>
        </div>
      </section>

      <section className="section pt-4">
        <div className="mb-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Find us</p><h2 className="section-title mt-3">Dwarka Sector 19B Park.</h2><p className="mt-2 text-sm text-offwhite/55">A familiar place to meet, move and start the day together.</p></div>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <div className="relative h-[300px] w-full md:h-[400px]"><iframe title="Dwarka Sector 19B Park map" src="https://www.google.com/maps?q=19B+Park,+Dwarka,+Sector+19,+New+Delhi&output=embed" className="absolute inset-0 h-full w-full border-0" allowFullScreen loading="lazy" /></div>
        </div>
      </section>

      <section className="section pt-4">
        <div className="mb-7"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Before you come</p><h2 className="section-title mt-3">A few things you might wonder.</h2></div>
        <FAQ />
      </section>
    </div>
  );
}