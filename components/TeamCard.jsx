// components/TeamCard.jsx
import Link from "next/link";
import Flag from "react-world-flags";

export default function TeamCard({ teamName, year, flag, teamId }) {
  const isValidTeam = teamName && teamName.trim().length > 0;
  // Use encodeURIComponent like races page
  const teamUrl = isValidTeam ? `/teams/${encodeURIComponent(teamName)}` : null;

  return (
    <li className="hoverState-li custom-list-el ss">  
      {isValidTeam && teamUrl && (
        <Link href={teamUrl} className="pabs" />
      )}
      <h5 className="rider--name fw-900">
        {isValidTeam && teamUrl ? (
          <Link href={teamUrl} className="link">
            {flag && (
              <Flag 
                code={flag.toUpperCase()} 
                style={{ width: '30px', height: '20px', marginRight: '10px'}} 
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
      {isValidTeam && teamUrl && (
        <Link href={teamUrl} className="r-details d-none">
          <img src="images/hover-arow.svg" alt="" />
        </Link>
      )}
    </li>
  );
}

