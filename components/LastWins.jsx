const LastWins = ({ wins }) => (
    <div className="col-lg-3 col-md-6">
      <div className="list-white-cart">
        <h4>Laatste Overwinningen</h4>
        <ul>
          {wins.map((win, index) => (
            <li key={index}>
              <div className="name-wraper">
                <img src="/images/flag9.svg" alt="Flag" />
                <h6>{win.name}</h6>
              </div>
            </li>
          ))}
        </ul>
        <a href="#" className="green-circle-btn">
          <img src="/images/arow.svg" alt="Arrow" />
        </a>
      </div>
    </div>
  );
  
  export default LastWins;
  