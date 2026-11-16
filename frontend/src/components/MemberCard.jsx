export default function MemberCard({ member }) {
  const initials = (member.name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="rounded-xl border border-white/10 bg-[#202420] p-5 transition-colors hover:border-primary/40">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">{initials || "645"}</div>
        <div className="min-w-0"><h3 className="truncate font-display font-semibold text-white">{member.name}</h3><p className="mt-1 text-xs text-offwhite/40">Member since {member.memberSince}</p></div>
      </div>
      <div className="mt-5 grid grid-cols-2 border-t border-white/10 pt-4">
        <div><p className="font-display text-xl font-bold text-white">{member.runsCompleted}</p><p className="mt-1 text-xs text-offwhite/45">Runs completed</p></div>
        <div className="border-l border-white/10 pl-4"><p className="font-display text-xl font-bold text-white">{member.distanceKm} <span className="text-xs font-normal text-offwhite/45">km</span></p><p className="mt-1 text-xs text-offwhite/45">Distance covered</p></div>
      </div>
    </article>
  );
}