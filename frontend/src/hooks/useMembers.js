import { useState, useEffect, useMemo } from "react";
// import { fetchMembers } from "../api/api.js";
import fallbackMembers from "../data/members.js";

export default function useMembers() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadMembers = async () => {
      setLoading(true);
      try {
        const { data } = await fetchMembers();
        if (isMounted) {
          setMembers(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setMembers(fallbackMembers);
          setError("Showing sample data because the API could not be reached.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadMembers();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return members;

    return members.filter((member) => member.name.toLowerCase().includes(query));
  }, [members, search]);

  return { members: filteredMembers, search, setSearch, loading, error };
}
