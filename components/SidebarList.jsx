import Link from "next/link";
import Flag from "react-world-flags";
// components/SidebarList.js
export default function SidebarList({ title, riders, link }) {
console.log("riders",riders);
console.log("link",link);
console.log("title",title);

    return (
      <div className="list-white-cart">
        <Link href={`/${link}`} className="pabs" />
        <h4>{title}</h4>
        <ul>
          {riders.map((rider, index) => {
            // Determine if it's a rider or team based on presence of rider_id
            const isRider = rider.rider_id !== undefined && rider.rider_id !== null;
            const itemLink = isRider 
              ? `/riders/${rider.rider_id}` 
              : `/teams/${encodeURIComponent(rider.name)}`;

            return (
              <li key={index}>
                <strong>{index + 1}.</strong>
                <div className="name-wraper">
                  <Link href={itemLink} className="pabs" /> 

                  <Flag code={rider?.flag} style={{width:"20px",height:"20px",marginLeft:"10px"}} />
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
  
