import { NavLink } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import FAQ from "../components/FAQ.jsx";

const runOptions = [
  { distance: "3 KM", title: "Start your rhythm", description: "A Sunday distance option for building a consistent routine." },
  { distance: "5 KM", title: "Find your flow", description: "Choose the distance that helps you keep showing up." },
  { distance: "10 KM", title: "Go the distance", description: "A longer option for runners ready for more kilometres." },
];

const values = [
  { number: "01", title: "Health", description: "A simple weekly habit for better physical health." },
  { number: "02", title: "Community", description: "Meet like-minded people through a shared Sunday routine." },
  { number: "03", title: "Consistency", description: "Build discipline one run at a time." },
];

const benefits = [
  "Improves heart health",
  "Burns calories",
  "Reduces stress",
  "Builds discipline",
  "Meet like-minded people",
];

export default function Home() {
  return (
    <div>
      <Hero />

      <section id="sunday-run" className="section scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">The weekly ritual</p>
            <h2 className="section-title mt-3">Your Sunday run, made simple.</h2>
            <p className="max-w-lg leading-7 text-offwhite/65">
              Come together at Dwarka Sector 19B Park every Sunday morning. Pick a distance, move at your own pace, and make the habit stick.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5">
              <p className="text-sm text-offwhite/60">Day</p>
              <p className="mt-2 font-display text-xl font-bold text-white">Sunday</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#232323] p-5">
              <p className="text-sm text-offwhite/60">Meet</p>
              <p className="mt-2 font-display text-xl font-bold text-accent">6:15 AM</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#232323] p-5">
              <p className="text-sm text-offwhite/60">Place</p>
              <p className="mt-2 font-display text-xl font-bold text-white">19B Park</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 bg-black/15">
        <div className="section">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">Choose your distance</p>
              <h2 className="section-title mt-3">A run for every Sunday.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-offwhite/60">The club offers 3 KM, 5 KM, and 10 KM distance options.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {runOptions.map((run) => (
              <article key={run.distance} className="group rounded-3xl border border-white/10 bg-[#232323] p-6 transition duration-200 hover:-translate-y-1 hover:border-primary/50">
                <p className="font-display text-4xl font-extrabold tracking-tight text-primary">{run.distance}</p>
                <h3 className="mt-8 font-display text-xl font-bold text-white">{run.title}</h3>
                <p className="mt-3 leading-6 text-offwhite/65">{run.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-3xl bg-primary p-8 md:p-10">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-white/75">645 Run Club</p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-white md:text-4xl">
              Run every Sunday. Stay healthy. Inspire others.
            </h2>
            <NavLink to="/join" className="mt-8 inline-block rounded-full bg-white px-6 py-3 font-display font-semibold text-dark transition hover:bg-accent">
              Become a member
            </NavLink>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {values.map((value) => (
              <article key={value.title} className="card flex min-h-52 flex-col">
                <p className="font-display text-sm font-bold text-primary">{value.number}</p>
                <h3 className="mt-auto font-display text-xl font-bold text-white">{value.title}</h3>
                <p className="mt-3 text-sm leading-6 text-offwhite/65">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-4">
        <div className="rounded-3xl border border-white/10 bg-[#232323] p-6 md:p-8">
          <div className="grid gap-7 md:grid-cols-[0.75fr_1.25fr] md:items-center">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">Why show up?</p>
              <h2 className="section-title mt-3">More than a run.</h2>
              <p className="leading-7 text-offwhite/65">A regular run can support both body and mind, while giving you a reason to connect with people who want to move too.</p>
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 border-b border-white/10 pb-4 text-sm text-offwhite/85">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">✓</span>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-4">
        <div className="mb-7">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">Find the start</p>
          <h2 className="section-title mt-3">Meet us at 19B Park.</h2>
        </div>
        <div className="overflow-hidden rounded-3xl border border-white/10 shadow-lg shadow-black/20">
          <div className="relative h-[320px] w-full md:h-[440px]">
            <iframe
              title="Dwarka Sector 19B Park map"
              src="https://www.google.com/maps?q=19B+Park,+Dwarka,+Sector+19,+New+Delhi&output=embed"
              className="absolute left-0 top-0 h-full w-full border-0"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="section pt-4">
        <div className="mb-8 text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">Good to know</p>
          <h2 className="section-title mt-3">Questions before your first run?</h2>
        </div>
        <FAQ />
      </section>
    </div>
  );
}
