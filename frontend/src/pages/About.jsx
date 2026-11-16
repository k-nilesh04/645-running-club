import PhotoGallery from "../components/PhotoGallery";

const coreValues = [
  { icon: "↗", title: "Health", description: "Make movement a natural part of everyday life." },
  { icon: "◎", title: "Community", description: "Find your people and make every Sunday count." },
  { icon: "⌁", title: "Discipline", description: "Show up, put in the work, and keep moving forward." },
  { icon: "✦", title: "Consistency", description: "Small steps repeated over time create big change." },
];

const mission = [
  "Encourage healthy habits.",
  "Promote consistency.",
  "Build confidence.",
  "Create friendships.",
  "Spread positivity.",
];

const vision = [
  "Create India's strongest running community.",
  "Become the benchmark for community-driven fitness initiatives.",
  "Turn daily routines into lifelong healthy lifestyles.",
];

export default function About() {
  return (
    <div className="overflow-hidden">
      <section className="relative isolate flex min-h-[440px] items-center overflow-hidden bg-[#0c1714] px-6 py-24 sm:min-h-[500px]">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_75%_35%,rgba(163,230,53,0.18),transparent_42%),linear-gradient(135deg,#0c1714_0%,#14251e_55%,#0c1714_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #d9f99d 1px, transparent 0)", backgroundSize: "22px 22px" }} />
        <div className="absolute -right-24 top-10 -z-10 h-80 w-80 rounded-full border border-lime-200/10 sm:h-[28rem] sm:w-[28rem]" />
        <div className="absolute -right-10 top-24 -z-10 h-64 w-64 rounded-full border border-lime-200/10 sm:h-96 sm:w-96" />
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-lime-200">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-300" /> More than a running club
            </div>
            <h1 className="font-display text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
              Every step has<br />a <span className="text-lime-300">story.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/60 sm:text-lg">
              We're 645 Run Club — a community built around movement, meaningful connections, and the belief that a healthier India starts with one step.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#our-story" className="inline-flex items-center gap-2 rounded-xl bg-lime-300 px-5 py-3.5 text-sm font-extrabold text-[#14201b] transition hover:-translate-y-0.5 hover:bg-lime-200">
                Discover our story <span aria-hidden="true">↓</span>
              </a>
              <span className="text-xs font-medium text-white/40">Sunday mornings · Dwarka, Delhi</span>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-0 right-[8%] hidden select-none font-display text-[190px] font-black leading-none text-white/[0.025] lg:block">645</div>
      </section>

      <section id="our-story" className="section scroll-mt-24">
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-lime-300">01 / The beginning</p>
            <h2 className="font-display text-3xl font-black leading-tight text-white sm:text-4xl">A little movement.<br /><span className="text-lime-300">A big difference.</span></h2>
            <p className="mt-5 text-sm leading-7 text-white/55">
              645 Run Club is a community-driven initiative that encourages people across all age groups to build a healthier lifestyle, one Sunday at a time. Every Sunday morning, runners gather at Dwarka Sector 19B Park to improve their fitness, meet like-minded people, and build a routine that lasts.
            </p>
            <div className="mt-7 flex items-center gap-3 border-l-2 border-lime-300 pl-4">
              <span className="text-2xl font-black tracking-tight text-lime-300">645</span>
              <p className="text-sm font-semibold text-white/75">Make India health conscious.</p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] border border-lime-300/10" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1d3329] via-[#14241e] to-[#101b18] p-7 sm:p-10">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-lime-200">The 645 spirit</span>
                <span className="text-2xl text-lime-300">✳</span>
              </div>
              <p className="mt-12 font-display text-4xl font-black leading-tight text-white sm:text-5xl">Run together.<br /><span className="text-lime-300">Grow together.</span></p>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/50">It doesn't matter how fast you run. What matters is that you show up, support each other, and keep going.</p>
              <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-5">
                <span className="text-xs font-semibold text-white/50">ONE COMMUNITY</span>
                <span className="text-xs font-semibold tracking-[0.18em] text-lime-300">645 RUN CLUB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section pt-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-xl">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-lime-300">02 / Our direction</p>
            <h2 className="font-display text-3xl font-black text-white sm:text-4xl">Purpose in every stride.</h2>
            <p className="mt-3 text-sm leading-6 text-white/50">A shared purpose keeps us moving — today, next Sunday, and for the long run.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <article className="group rounded-3xl border border-white/10 bg-[#12201d] p-6 transition duration-300 hover:-translate-y-1 hover:border-lime-300/30 sm:p-8">
              <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-xl text-lime-300">◎</div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-lime-300">Where we're headed</p>
              <h3 className="font-display text-2xl font-extrabold text-white">Our Vision</h3>
              <ul className="mt-6 space-y-4">
                {vision.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-white/65">
                    <span className="mt-1 text-lime-300">↗</span><span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="group rounded-3xl border border-white/10 bg-[#12201d] p-6 transition duration-300 hover:-translate-y-1 hover:border-lime-300/30 sm:p-8">
              <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-xl text-lime-300">✦</div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-lime-300">What we do every day</p>
              <h3 className="font-display text-2xl font-extrabold text-white">Our Mission</h3>
              <ul className="mt-6 space-y-4">
                {mission.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-white/65">
                    <span className="mt-1 text-lime-300">✓</span><span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section pt-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-lime-300">03 / Moments together</p>
            <h2 className="font-display text-3xl font-black text-white sm:text-4xl">The community in motion.</h2>
            <p className="mt-3 text-sm text-white/50">Every run brings new memories, friendships, and reasons to come back.</p>
          </div>
          <PhotoGallery />
        </div>
      </section>

      <section className="section pt-4">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-lime-300">04 / What we stand for</p>
            <h2 className="font-display text-3xl font-black text-white sm:text-4xl">Our core values.</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/50">The habits and principles that make 645 more than just a place to run.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, index) => (
              <div key={value.title} className="rounded-2xl border border-white/10 bg-[#12201d] p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-lime-300/30">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-300/10 font-display text-2xl font-bold text-lime-300">{value.icon}</div>
                <p className="mb-2 text-[10px] font-bold tracking-[0.18em] text-white/30">0{index + 1}</p>
                <h3 className="font-display text-lg font-bold text-white">{value.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/45">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-4">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-lime-300/20 bg-gradient-to-r from-lime-300/15 via-[#16271f] to-[#12201d] px-6 py-10 text-center sm:px-10 sm:py-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-lime-300">Your next chapter starts here</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-black text-white sm:text-4xl">One Sunday can start a lifelong habit.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/55">Come for the run. Stay for the people. Let's make every step count.</p>
          <a href="/join" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-lime-300 px-6 py-3.5 text-sm font-extrabold text-[#14201b] transition hover:-translate-y-0.5 hover:bg-lime-200">Join the community <span aria-hidden="true">→</span></a>
        </div>
      </section>
    </div>
  );
}
