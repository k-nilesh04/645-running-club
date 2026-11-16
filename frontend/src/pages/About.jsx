import PhotoGallery from "../components/PhotoGallery";

const coreValues = [
  { title: "Health", description: "Making an active lifestyle easier to maintain." },
  { title: "Community", description: "Meeting people and finding encouragement." },
  { title: "Discipline", description: "Keeping a promise to yourself each week." },
  { title: "Consistency", description: "Small efforts that add up over time." },
];

const mission = ["Encourage healthy habits.", "Promote consistency.", "Build confidence.", "Create friendships.", "Spread positivity."];
const vision = ["Create India's strongest running community.", "Become a benchmark for community-driven fitness.", "Turn simple routines into lifelong healthy habits."];

export default function About() {
  return (
    <div>
      <section className="border-b border-white/10 bg-[#171b18]">
        <div className="section py-16 md:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary">A community in Dwarka</p>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-6xl">We run for the feeling.<br /><span className="text-primary">We stay for the people.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-offwhite/60">645 Run Club brings people together to move, connect and make a healthier lifestyle part of the week.</p>
        </div>
      </section>

      <section id="our-story" className="section">
        <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr]">
          <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Our story</p><h2 className="section-title mt-3">It starts with showing up.</h2></div>
          <div className="max-w-2xl space-y-4 text-sm leading-7 text-offwhite/65">
            <p>645 Run Club is a community-driven initiative that encourages people across all age groups to build a healthier lifestyle, one Sunday at a time. Every Sunday morning, runners gather at Dwarka Sector 19B Park to improve their fitness, meet like-minded people, and build a routine that lasts.</p>
            <p className="border-l-2 border-primary pl-4 font-display text-xl font-semibold text-white">Make India health conscious.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/10">
        <div className="section">
          <div className="grid gap-10 md:grid-cols-2">
            <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Our vision</p><h2 className="section-title mt-3">What we're working towards.</h2><ul className="mt-6 space-y-4">{vision.map((item) => <li key={item} className="flex gap-3 border-b border-white/10 pb-3 text-sm leading-6 text-offwhite/70"><span className="text-primary">—</span>{item}</li>)}</ul></div>
            <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Our mission</p><h2 className="section-title mt-3">What we do along the way.</h2><ul className="mt-6 space-y-4">{mission.map((item) => <li key={item} className="flex gap-3 border-b border-white/10 pb-3 text-sm leading-6 text-offwhite/70"><span className="text-primary">—</span>{item}</li>)}</ul></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mb-7"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">The people and the moments</p><h2 className="section-title mt-3">A look at our Sundays.</h2></div>
        <PhotoGallery />
      </section>

      <section className="section pt-0">
        <div className="mb-8"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">What matters to us</p><h2 className="section-title mt-3">Four things we believe in.</h2></div>
        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {coreValues.map((value, index) => <article key={value.title} className="border-t border-white/10 py-5 sm:px-5"><p className="text-xs font-semibold text-primary">0{index + 1}</p><h3 className="mt-5 font-display text-xl font-semibold text-white">{value.title}</h3><p className="mt-2 text-sm leading-6 text-offwhite/55">{value.description}</p></article>)}
        </div>
      </section>

      <section className="section pt-0">
        <div className="flex flex-col gap-5 border-y border-primary/30 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="font-display text-2xl font-bold text-white">Want to join us next Sunday?</h2><p className="mt-2 text-sm text-offwhite/55">There's room for one more runner.</p></div>
          <a href="/join" className="btn-primary self-start sm:self-auto">Join 645 Run Club</a>
        </div>
      </section>
    </div>
  );
}