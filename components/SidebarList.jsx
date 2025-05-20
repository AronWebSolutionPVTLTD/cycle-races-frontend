import Link from "next/link";
import Flag from "react-world-flags";

// components/SidebarList.js
export default function SidebarList({ title, riders }) {

    return (
      <div className="list-white-cart">
        <h4>{title}</h4>
        <ul>
          {riders.map((rider, index) => (
            <li key={index}>
              <strong>{index + 1}.</strong>
              <div className="name-wraper">
                <Flag code={rider.flag} style={{width:"20px",height:"20px",marginLeft:"10px"}} />
                <h6>{rider.name}</h6>
              </div>
              <span>{rider.age}</span>
            </li>
          ))}
        </ul>
        <Link href="#" className="green-circle-btn">
          <img src="/images/arow.svg" alt="arrow" />
        </Link>
      </div>
    )
  }
  