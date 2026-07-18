export default function MemberCard({ member, rank }) {
  const initials = member.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="card flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-200">
      {typeof rank === "number" && (
        <span className="self-start bg-accent text-dark text-xs font-display font-bold px-2 py-1 rounded-full mb-2">
          #{rank}
        </span>
      )}

      <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-display font-bold text-primary text-lg mb-3">
        {initials}
      </div>

      <h4 className="font-display mb-3 font-semibold text-white">{member.name}</h4>
      {/* <p className="text-xs text-offwhite/50 mb-3">Age {member.age}</p> */}

      <div className="grid grid-cols-2 gap-2 w-full text-xs text-offwhite/80">
        <div className="bg-dark/50 rounded-lg py-2">
          <p className="font-display font-bold text-primary">{member.runsCompleted}</p>
          <p>Runs</p>
        </div>
        <div className="bg-dark/50 rounded-lg py-2">
          <p className="font-display font-bold text-primary">{member.distanceKm} km</p>
          <p>Distance</p>
        </div>
      </div>

      <p className="text-xs text-offwhite/40 mt-3">Member since {member.memberSince}</p>
    </div>
  );
}
