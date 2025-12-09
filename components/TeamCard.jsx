// components/TeamCard.jsx
import Link from "next/link";
import Flag from "react-world-flags";

export default function TeamCard({ teamName, year, flag, teamId }) {
  const isValidTeamId = typeof teamId === "string" || typeof teamId === "number";

  return (
    <li className="hoverState-li custom-list-el ss">
      {isValidTeamId && (
        <Link href={`/teams/${teamId}`} className="pabs" />
      )}
      <h5 className="rider--name fw-900">
        {isValidTeamId ? (
          <Link href={`/teams/${teamId}`} className="link">
            {flag && (
              <Flag 
                code={flag.toUpperCase()} 
                style={{ width: '30px', height: '20px', marginRight: '10px' }} 
              />
            )}
            {teamName}
          </Link>
        ) : (
          <>
            {flag && (
              <Flag 
                code={flag.toUpperCase()} 
                style={{ width: '30px', height: '20px', marginRight: '10px' }} 
              />
            )}
            {teamName}
          </>
        )}
      </h5>
      {year && <h6 className="team-name">{year}</h6>}
      {isValidTeamId && (
        <a href={`/teams/${teamId}`} className="r-details d-none">
          <img src="images/hover-arow.svg" alt="" />
        </a>
      )}
    </li>
  );
}

