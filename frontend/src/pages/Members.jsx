import useMembers from "../hooks/useMembers.js";
import MemberCard from "../components/MemberCard.jsx";

export default function Members() {
  const { members, search, setSearch, loading } = useMembers();

  return (
    <section className="section min-h-[60vh]">
      <div className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">The people behind the miles</p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">Our members<span className="text-primary">.</span></h1>
          <p className="mt-3 text-sm text-offwhite/55">A community of runners, one Sunday at a time.</p>
        </div>
        <label className="w-full md:max-w-xs">
          <span className="mb-2 block text-xs text-offwhite/45">Find someone</span>
          <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#232323] px-4 py-3 text-sm text-white placeholder:text-offwhite/35 outline-none transition focus:border-primary" />
        </label>
      </div>

      {!loading && <p className="mb-5 text-xs text-offwhite/40">{members.length} {members.length === 1 ? "member" : "members"}</p>}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-48 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />)}</div>
      ) : members.length === 0 ? (
        <div className="border-y border-white/10 py-16 text-center"><p className="font-display text-xl font-semibold text-white">No members found</p><p className="mt-2 text-sm text-offwhite/45">Try another name.</p></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">{members.map((member, index) => <MemberCard key={member._id} member={member} rank={index + 1} />)}</div>
      )}
    </section>
  );
}