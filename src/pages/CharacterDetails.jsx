import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function CharacterDetails() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadCharacter() {
      setLoading(true);
      setError("");
      setCharacter(null);

      try {
        const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          if (res.status === 404) throw new Error("Character not found.");
          throw new Error(`Request failed (${res.status})`);
        }

        const data = await res.json();
        setCharacter(data);
      } catch (e) {
        if (e.name !== "AbortError") {
          setError(e.message || "Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadCharacter();
    return () => controller.abort();
  }, [id]);

  return (
    <div className="container">
      <header className="header">
        <h1>Character Details</h1>
        <Link to="/characters" className="back-link">
          ← Back to list
        </Link>
      </header>

      {loading && <div className="state">Loading details...</div>}
      {error && <div className="state error">{error}</div>}

      {character && (
        <div className="details">
          <img
            src={character.image}
            alt={character.name}
            className="details-img"
          />

          <div>
            <h2>{character.name}</h2>
            <p><strong>Status:</strong> {character.status}</p>
            <p><strong>Species:</strong> {character.species}</p>
            <p><strong>Gender:</strong> {character.gender}</p>
            <p><strong>Origin:</strong> {character.origin?.name}</p>
            <p><strong>Location:</strong> {character.location?.name}</p>
            <p><strong>Episodes:</strong> {character.episode?.length ?? 0}</p>
          </div>
        </div>
      )}
    </div>
  );
}
