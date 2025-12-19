import { useEffect, useMemo, useState } from "react";
import CharacterCard from "../components/CharacterCard.jsx";

const API = "https://rickandmortyapi.com/api/character";

export default function Characters() {
  const [characters, setCharacters] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadCharacters() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(API, { signal: controller.signal });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);

        const data = await res.json();
        setCharacters(data.results || []);
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e.message || "Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadCharacters();
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const s = status.toLowerCase();

    return characters.filter((c) => {
      const matchesName = !q || c.name.toLowerCase().includes(q);
      const matchesStatus = s === "all" || (c.status || "").toLowerCase() === s;
      return matchesName && matchesStatus;
    });
  }, [characters, query, status]);

  return (
    <div className="container">
      <header className="header">
        <h1>Rick & Morty Explorer</h1>
        <p className="subtle">Search and click a character to view details.</p>
      </header>

      <div className="toolbar">
        <label className="field">
          <span>Search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a character name..."
          />
        </label>

        <label className="field">
          <span>Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="Alive">Alive</option>
            <option value="Dead">Dead</option>
            <option value="unknown">Unknown</option>
          </select>
        </label>
      </div>

      {loading && <div className="state">Loading characters...</div>}
      {error && <div className="state error">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="state">No characters found.</div>
      )}

      <section className="grid">
        {filtered.map((c) => (
          <CharacterCard key={c.id} character={c} />
        ))}
      </section>
    </div>
  );
}
