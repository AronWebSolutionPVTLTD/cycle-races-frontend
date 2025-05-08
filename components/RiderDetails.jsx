const RiderDetails = ({ rider }) => (
    <div className="col-lg-12">
      <div className="top-wraper">
        <ul className="breadcrumb">
          <li><a href="/">home</a></li>
          <li><a href="/riders">riders</a></li>
          <li>{rider.name}</li>
        </ul>
        <div className="wraper">
          <img src={rider.image} alt={rider.name} />
          <h1>{rider.name}</h1>
        </div>
        <ul className="plyr-dtls">
          <li>
            <img src="/images/flag1.svg" alt="Country" />
            <span>{rider.country}</span>
          </li>
          <li>{rider.dob} ({rider.age})</li>
          <li>{rider.city}</li>
        </ul>
      </div>
    </div>
  );
  
  export default RiderDetails;
  