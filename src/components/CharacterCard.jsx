import { Link } from "react-router-dom";

export default function CharacterCard({ character }) {
  return (
    <Link to={`/characters/${character.id}`} className="card">
      <img
        src={character.image}
        alt={character.name}
        className="card-img"
        loading="lazy"
      />
      <div className="card-body">
        <div className="card-title">
          <span>{character.name}</span>
          <span className="subtle">{character.status}</span>
        </div>
        <div className="card-meta">{character.species}</div>
      </div>
    </Link>
  );
}
