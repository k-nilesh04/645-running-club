import Hero from "../components/Hero.jsx";
import SubscriptionCard from "../components/SubscriptionCard.jsx";
import FAQ from "../components/FAQ.jsx";

const whyJoin = [
  { icon: "Run", title: "Weekly Sunday Runs" },
  { icon: "Fit", title: "Better Physical Health" },
  { icon: "Team", title: "Amazing Community" },
  { icon: "Goal", title: "Fitness Challenges" },
  { icon: "Gear", title: "Free Club Swags" },
];

const testimonials = [
  { name: "Rahul", quote: "I lost 8 kg after joining.", rating: 5 },
  { name: "Radhika", quote: "The Sunday runs became the best part of my week.", rating: 5 },
  { name: "Ankit", quote: "Made real friends while getting fit.", rating: 5 },
];

export default function Home() {
  return (
    <div>
      <Hero />

      <section className="section">
        <h2 className="section-title text-center">Why Join?</h2>
        <p className="text-offwhite/60 text-center mb-10">
          A community built around one simple habit: showing up every Sunday.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {whyJoin.map((item) => (
            <div key={item.title} className="card text-center">
              <p className="font-display text-primary font-bold mb-2">{item.icon}</p>
              <p className="text-sm font-display font-medium text-white">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="card max-w-2xl mx-auto text-center">
          <h3 className="section-title">Running Schedule</h3>
          <div className="grid grid-cols-2 gap-6 mt-6 text-sm">
            <div>
              <p className="text-offwhite/50">Meeting Time</p>
              <p className="font-display font-semibold text-primary text-lg">6:45 AM</p>
            </div>
            <div>
              <p className="text-offwhite/50">Location</p>
              <p className="font-display font-semibold text-primary text-lg">Dwarka Sector 23 Park</p>
            </div>
            <div className="col-span-2">
              <p className="text-offwhite/50">Distance Options</p>
              <p className="font-display font-semibold text-primary text-lg"> 3 KM / 5 KM / 10 KM</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section lg:px-20 md:px-10 sm:px-4">
        <div className="max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px]">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps?q=Lake,+Sector-23+-+Cycling+and+Walking+Track,+Dwarka,+Sector+23,+New+Delhi&output=embed"
              className="absolute top-0 left-0 w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>


      <section className="section">
        <h2 className="section-title text-center mb-10">Health Benefits</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["Improves Heart Health", "Burns Calories", "Reduces Stress", "Builds Discipline", "Meet Like-minded People"].map(
            (benefit) => (
              <div key={benefit} className="card text-center text-sm text-offwhite/90 flex items-center justify-center">
                <span className="text-primary mr-2 text-xs font-bold" aria-hidden="true">OK</span> {benefit}
              </div>
            )
          )}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title text-center mb-10">What Our Runners Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card">
              <p className="text-accent mb-3">{"*".repeat(t.rating)}</p>
              <p className="text-offwhite/90 italic mb-4">"{t.quote}"</p>
              <p className="font-display font-semibold text-white">- {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title text-center mb-6">Frequently Asked Questions</h2>
        <FAQ />
      </section>

    </div>
  );
}
