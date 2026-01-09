import Link from "next/link";
import Flag from "react-world-flags";

export default function RiderCard({ name, team, flag, riderId }) {
  const isValidRiderId =
    typeof riderId === "string" || typeof riderId === "number";


  return (
    <li className="hoverState-li custom-list-el ss">
      <Link href={`/riders/${riderId}`} className="pabs" />
      <h5 className="rider--name fw-900">

        <Flag code={flag.toUpperCase()} style={{ width: '30px', height: '20px', marginRight: '10px' }} />
        <Link
          href={`/riders/${riderId}`}
          className="link"
        >
          <div className="text-uppercase">{name}</div>
        </Link>
      </h5>
      <h6 className="team-name"> <Link
        href={`/teams/${team}`}
        className="link"
      >{team}</Link></h6>
      <a href={`/riders/${riderId}`} className="r-details d-none">
        <img src="images/hover-arow.svg" alt="" />
      </a>
    </li>
  );
}
