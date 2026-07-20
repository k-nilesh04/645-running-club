import PhotoGallery from "../components/PhotoGallery";

const coreValues = [
  { icon: "Health", title: "Health" },
  { icon: "Team", title: "Community" },
  { icon: "Run", title: "Discipline" },
  { icon: "Habit", title: "Consistency" },
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
  "Build a self-sustaining ecosystem of health advocates.",
  "Become the benchmark for community-driven fitness initiatives.",
  "Turn daily routines into lifelong healthy lifestyles.",
];


export default function About() {
  return (
    <div>
      <section
        className="py-24 text-center px-6"
        style={{
          backgroundImage: "linear-gradient(180deg, rgba(15,157,88,0.15), rgba(26,26,26,1))",
        }}
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white">About Us</h1>
        <p className="text-offwhite/60 mt-3">The story behind the Sunday runs</p>
      </section>

      <section className="section">
        <div className="card max-w-3xl mx-auto">
          <h2 className="section-title">Our Story</h2>
          <p className="text-offwhite/80 leading-relaxed">
            645 Dwarka Chapter Running Club is a community-driven initiative that encourages people
            across all age groups to build a healthier lifestyle, one Sunday at a time. Every Sunday
            morning, runners gather at Dwarka Sector 24 Park to improve their fitness, meet like-minded
            people, and build a routine that lasts.
          </p>
          <p className="text-offwhite/80 leading-relaxed mt-4">
            Make India health conscious.
          </p>
        </div>
      </section>

      <section className="section grid md:grid-cols-2 gap-6">

        <div className="card">
          <h3 className="font-display text-xl font-bold text-white mb-2">Vision</h3>
          <ul className="space-y-1 text-offwhite/80">
            {vision.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 className="font-display text-xl font-bold text-white mb-2">Mission</h3>
          <ul className="space-y-1 text-offwhite/80">
            {mission.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>

      </section>

      <PhotoGallery />

      <section className="section">
        <h2 className="section-title text-center mb-10">Core Values</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {coreValues.map((value) => (
            <div key={value.title} className="card text-center">
              <p className="font-display text-primary font-bold mb-2">{value.icon}</p>
              <p className="font-display font-medium text-white">{value.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
