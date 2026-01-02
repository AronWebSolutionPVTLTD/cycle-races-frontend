// components/TeamCard.jsx
import Link from "next/link";
import Flag from "react-world-flags";
import { renderFlag } from "./RenderFlag";

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
          <>   {flag && (
            <> {renderFlag(flag)}</>
       )}
          <Link href={teamUrl} className="link">
         
              <div className="text-uppercase">
                {teamName}
              </div>
          </Link>
          </>
        ) : (
          <>
            {flag && (
              <> {renderFlag(flag)}</>
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

