import { useState, useEffect, useMemo } from "react";
import fallbackMembers from "../data/members.js";

export default function useMembers() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMembers(fallbackMembers);
    setError("Backend does not expose a members list API yet.");
    setLoading(false);
  }, []);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return members;

    return members.filter((member) => member.name.toLowerCase().includes(query));
  }, [members, search]);

  return { members: filteredMembers, search, setSearch, loading, error };
}
