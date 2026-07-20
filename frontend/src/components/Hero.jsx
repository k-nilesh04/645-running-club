import { NavLink } from "react-router-dom";

export default function Hero() {
  return (
    <section
      className="relative flex items-center justify-center text-center px-6 py-28 md:py-40 overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(26,26,26,0.75), rgba(26,26,26,0.95)), url('/hero.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-3xl">
        <p className="uppercase tracking-[0.3em] text-primary text-xs font-display font-semibold mb-4">
          Dwarka Sector 24 | Every Sunday | 6:45 AM
        </p>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold text-white leading-tight">
          645 Dwarka Chapter Running Club
        </h1>
        <p className="font-display text-lg md:text-2xl text-accent mt-4">
          Run Every Sunday. Stay Healthy. Inspire Others.
        </p>
        <NavLink to="/join" className="btn-primary mt-8 inline-block">
          Join Now
        </NavLink>
      </div>
    </section>
  );
}
