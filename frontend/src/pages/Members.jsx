import useMembers from "../hooks/useMembers.js";
import MemberCard from "../components/MemberCard.jsx";

export default function Members() {
  const { members, search, setSearch, loading, error } = useMembers();

  return (
    <div className="section">
      <div className="text-center mb-10">
        <h1 className="section-title">Our Members</h1>
        <p className="text-offwhite/60">Runners who show up, Sunday after Sunday.</p>
      </div>

      <div className="max-w-md mx-auto mb-10">
        <input
          type="text"
          placeholder="Search members by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#232323] border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder:text-offwhite/40 focus:outline-none focus:border-primary"
        />
      </div>

      {error && <p className="text-center text-accent text-sm mb-6">{error}</p>}

      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-48" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <p className="text-center text-offwhite/50">No members match that search.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <MemberCard key={member._id} member={member} rank={index + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
