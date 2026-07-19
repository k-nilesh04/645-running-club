import { useState } from "react";

const faqs = [
  {
    q: "Where do we meet every Sunday?",
    a: "We meet at Dwarka Sector 23 Park at 6:45 AM. Look for the group in blue 645 DC Running Club tees.",
  },
  {
    q: "Do I need running experience to join?",
    a: "Not at all. We have 3 km, 5 km, and 10 km routes each week, so runners of every level can join in.",
  },
  {
    q: "What do I get with the premium subscription?",
    a: "Priority registration, fitness tracking, weekly motivation, and free club swags: a running t-shirt, wrist band, and many more.",
  },
  {
    q: "Is there a free way to participate?",
    a: "Yes! Showing up for the Sunday run is always free. The Rs 299/year plan is optional and unlocks swags and extra perks.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {faqs.map((item, index) => (
        <div key={item.q} className="card cursor-pointer" onClick={() => toggle(index)}>
          <div className="flex items-center justify-between gap-4">
            <p className="font-display font-medium text-white">{item.q}</p>
            <span className="text-primary text-xl">{openIndex === index ? "-" : "+"}</span>
          </div>
          {openIndex === index && <p className="text-sm text-offwhite/70 mt-3">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}
