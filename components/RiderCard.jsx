// components/RiderCard.js
import Link from "next/link";
import Flag from "react-world-flags";

export default function RiderCard({ name, team, flag, riderId }) {
  const isValidRiderId =
    typeof riderId === "string" || typeof riderId === "number";


  return (
    <li>
      <h5>

  <Flag code={flag.toUpperCase()} style={{ width: '30px', height: '20px', marginRight: '10px' }} />

        {isValidRiderId ? (
          <Link href={`/riders/${riderId}`}>{name}</Link>
        ) : (
          { name }
        )}
      </h5>
      <h6>{team}</h6>
      <a href={`/riders/${riderId}`} className="r-details">
        <img src="images/hover-arow.svg" alt="" />
      </a>
      {/* {isValidRiderId ?(
      <Link href={`/riders/${riderId}`} className="r-details">
        <img src="/images/arow.svg" alt="Arrow"/>
      </Link>
    ) : (
      <span className="r-details">
        <img src="/images/arow.svg" alt="Arrow" />
      </span>
    )
    } */}
    </li>
  );
}
