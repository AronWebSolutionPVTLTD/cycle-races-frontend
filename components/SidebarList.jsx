import Link from "next/link";
import { renderFlag } from "./RenderFlag";
export default function SidebarList({ title, riders, link }) {

  return (
    <div className="list-white-cart">
      <Link href={`/${link}`} className="pabs" />
      <h4>{title}</h4>
      <ul>
        {riders.map((rider, index) => {
          const isRider = rider.rider_id !== undefined && rider.rider_id !== null;
          const itemLink = isRider
            ? `/riders/${rider.rider_id}`
            : `/teams/${encodeURIComponent(rider.name)}`;

          return (
            <li key={index}>
              <strong>{index + 1}.</strong>
              <div className="name-wraper">
                <Link href={itemLink} className="pabs" />
                <> {renderFlag(rider?.flag)}</>
                <h6 className="clamp-text">{rider.name}</h6>

              </div>
              <span>{rider.age}</span>
            </li>
          );
        })}
      </ul>
      <Link href={`/${link}`} className="green-circle-btn">
        <img src="/images/arow.svg" alt="arrow" />
      </Link>
    </div>
  )
}

