import React from 'react'

const MostwinSection = () => {
  return (
    <section className="home-sec3 lazy">
    <div className="container">
        <div className="row">
            <div className="col-lg-9 mx-auto">
                <div className="add-wraper">
                    <a href="#?"><img src="/images/add3.png" alt="" /></a>
                </div>
            </div>
            <div className="col-lg-12">
                <div className="winning-box">
                    <div className="text-wraper">
                        <h3>meeste overwinningen</h3>
                        <h4>Gilberto Simoni</h4>
                    </div>
                    <span>3</span>
                    <img src="/images/player5.png" alt="" className="player-img" />
                </div>
            </div>
        </div>
    </div>
</section>
  )
}

export default MostwinSection