const TeamInfo = ({ team }) => (
    <div className="col-lg-3 col-md-6">
      <div className="team-cart lime-green-team-cart">
        <a href="#" className="pabs"></a>
        <div className="text-wraper">
          <h4>Huidig Team</h4>
          <div className="name-wraper">
            <img src="/images/flag9.svg" alt="Flag" />
            <h6>{team.name}</h6>
          </div>
        </div>
        <h5><strong>{team.years}</strong> jaar</h5>
        <img src="/images/player7.png" alt="Team Logo" className="absolute-img" />
        <a href="#" className="green-circle-btn">
          <img src="/images/arow.svg" alt="Arrow" />
        </a>
      </div>
    </div>
  );
  
  export default TeamInfo;
  