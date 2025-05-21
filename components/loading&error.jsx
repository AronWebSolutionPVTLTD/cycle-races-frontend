
import React from 'react';

// Enhanced Loading component that matches the existing design aesthetic
// export const LoadingStats = () => (
//   <div className="loading-container text-center p-5 my-4 bg-light rounded shadow-sm">
//     <div className="spinner-border text-primary mb-3" role="status">
//       <span className="visually-hidden">Loading...</span>
//     </div>
//     <h3 className="text-muted">Loading statistics...</h3>
//     <p className="text-muted">Please wait while we fetch the latest data.</p>
//   </div>
// );

export const LoadingStats = () => (
  <div className="list-white-cart loading-container text-center p-4 my-3">
    <div className="d-flex flex-column align-items-center justify-content-center">
      {/* Custom loader with site's green color */}
      {/* <div className="spinner mb-3" style={{ width: '48px', height: '48px' }}>
        <img src="/images/loading-spinner.svg" alt="Loading" className="w-100 h-100" 
             onError={(e) => {
               e.target.onerror = null;
               e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'%3E%3Cpath fill='%2308a951' d='M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z' opacity='.25'/%3E%3Cpath fill='%2308a951' d='M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z'%3E%3CanimateTransform attributeName='transform' dur='0.75s' repeatCount='indefinite' type='rotate' values='0 12 12;360 12 12'/%3E%3C/path%3E%3C/svg%3E";
             }}
        />
      </div> */}
      {/* <h4 className="mb-2">Loading statistics</h4>
      <p className="text-muted small mb-3">We halen de laatste statistieken op</p> */}
      
      {/* Visual placeholders that match the page design */}
      <div className="w-100 placeholder-loading">
        <div className="loading-bar mb-2" style={{ height: '30px', width: '40%', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
        <div className="loading-bar mb-2" style={{ height: '30px', width: '75%', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
        <div className="loading-bar" style={{ height: '30px', width: '60%', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
      </div>
    </div>
    {/* <a href="#?" className="green-circle-btn disabled">
      <img src="/images/arow.svg" alt="" />
    </a> */}
  </div>
);

// Enhanced Error component that matches the existing design aesthetic
export const ErrorStats = ({ message }) => (
  <div className="error-container text-center p-5 my-4 bg-light rounded shadow-sm">
    <div className="mb-3">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2" className="mb-3">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <h3 className="text-danger">Error Loading Data</h3>
    <p className="text-muted">{message || "Failed to load statistics"}</p>
    <button 
      className="btn btn-outline-primary mt-3" 
      onClick={() => window.location.reload()}
    >
      Try Again
    </button>
  </div>
);

// Additional component: NoDataMessage to match the existing empty state design
export const NoDataMessage = ({ filterYear }) => (
  <div className="no-data-message text-center p-5 my-4 bg-light rounded shadow-sm">
    <div className="mb-3">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#aaaaaa" strokeWidth="1" className="mb-3">
        <circle cx="12" cy="12" r="10" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      </svg>
    </div>
    <h3 className="text-muted">No Data Available</h3>
    <p className="text-muted">
      No statistics found for this rider {filterYear !== 'All-time' ? `in ${filterYear}` : ''}.
    </p>
    <button 
      className="btn btn-outline-primary mt-3" 
      onClick={() => window.location.reload()}
    >
      Try Different Random Statistics
    </button>
  </div>
);

// Additional component: PartialDataWarning for showing partial success states
export const PartialDataWarning = ({ visibleCardCount, totalEndpoints, error }) => (
  <div className="warning-banner w-100 p-3 mb-4 alert alert-warning">
    <div className="d-flex justify-content-between align-items-center">
      <p className="mb-1">
        <strong>Partial Data Available:</strong> Showing {visibleCardCount} of {totalEndpoints} statistics.
      </p>
      <button 
        className="btn btn-sm btn-outline-secondary" 
        onClick={() => window.location.reload()}
      >
        Refresh
      </button>
    </div>
    {error && error.failedEndpoints && (
      <details>
        <summary className="cursor-pointer mt-2">View details</summary>
        <p className="mt-2 mb-0">
          Failed to load some statistics. Try refreshing for new random statistics.
        </p>
      </details>
    )}
  </div>
);

export const BoxSkeleton = () => {
  return (
    <div className="container-fluid py-3">
      <div className="row g-3">
        {/* Duarte Runner Card */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm" style={{ borderRadius: '0.5rem' }}>
            <div className="card-body">
              <div className="placeholder-glow">
                <span className="placeholder bg-dark col-6 mb-3"></span>
                <div className="mb-2">
                  <span className="placeholder col-12 mb-2" style={{ height: '20px', backgroundColor: '#999' }}></span>
                  <span className="placeholder col-12 mb-2" style={{ height: '20px', backgroundColor: '#999' }}></span>
                  <span className="placeholder col-12" style={{ height: '20px', backgroundColor: '#999' }}></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Oudste Speler Card */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm" style={{ borderRadius: '0.5rem' }}>
            <div className="card-body">
              <div className="placeholder-glow">
                <div className="d-flex align-items-center mb-3">
                  <span className="placeholder me-2" style={{ width: '60px', height: '16px', backgroundColor: '#999' }}></span>
                  <span className="placeholder bg-secondary col-7"></span>
                </div>
                 <div className="mb-2">
                  <span className="placeholder col-12 mb-2" style={{ height: '20px', backgroundColor: '#999' }}></span>
                  <span className="placeholder col-12 mb-2" style={{ height: '20px', backgroundColor: '#999' }}></span>
                
                </div>
                <div className="text-center">
                  <h1 className="display-4 text-secondary opacity-25">--</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jongste Team Card */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm" style={{ borderRadius: '0.5rem' }}>
            <div className="card-body">
              <div className="placeholder-glow">
                <div className="d-flex justify-content-center mb-2">
                  <span className="placeholder" style={{ width: '60px', height: '16px', backgroundColor: '#999' }}></span>
                </div>
                <div className="text-center">
                  <span className="placeholder col-6 mx-auto d-block mb-2" style={{ backgroundColor: '#999' }}></span>
                  <h1 className="display-4 text-secondary opacity-25">--</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Races Card */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm" style={{ borderRadius: '0.5rem' }}>
            <div className="card-body">
              {/* <div className="placeholder-glow text-center">
                <h1 className="display-4 text-secondary opacity-25">--</h1>
              </div> */}
                  <span className="placeholder bg-dark col-6 mb-3"></span>
                 <div className="mb-2">
                  <span className="placeholder col-12 mb-2" style={{ height: '20px', backgroundColor: '#999' }}></span>
                  <span className="placeholder col-12 mb-2" style={{ height: '20px', backgroundColor: '#999' }}></span>
                
                </div>
            </div>
          </div>
        </div>

        {/* Meest Aantal Deelnamers Card */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm" style={{ borderRadius: '0.5rem' }}>
            <div className="card-body">
              <div className="placeholder-glow">
                <div className="d-flex align-items-center mb-3">
                  <span className="placeholder me-2" style={{ width: '60px', height: '16px', backgroundColor: '#999' }}></span>
                  <span className="placeholder bg-secondary col-7"></span>
                </div>
                <div className="text-center">
                  <h1 className="display-4 text-secondary opacity-25">--</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Oudste Team Card */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm" style={{ borderRadius: '0.5rem' }}>
            <div className="card-body">
              <div className="placeholder-glow">
                <div className="d-flex justify-content-center mb-2">
                  <span className="placeholder" style={{ width: '60px', height: '16px', backgroundColor: '#999' }}></span>
                </div>
                <div className="mb-2">
                  <span className="placeholder col-12 mb-2" style={{ height: '20px', backgroundColor: '#999' }}></span>
                  <span className="placeholder col-12 mb-2" style={{ height: '20px', backgroundColor: '#999' }}></span>
                  <span className="placeholder col-12 mb-2" style={{ height: '20px', backgroundColor: '#999' }}></span>
                  <span className="placeholder col-12 mb-2" style={{ height: '20px', backgroundColor: '#999' }}></span>
                </div>
                <div className="text-center">
                  <h1 className="display-4 text-secondary opacity-25">--</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meest Opvallgende Overeenksmten Card */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm" style={{ borderRadius: '0.5rem' }}>
            <div className="card-body">
              <div className="placeholder-glow">
                <div className="d-flex align-items-center mb-3">
                  <span className="placeholder me-2" style={{ width: '60px', height: '16px', backgroundColor: '#999' }}></span>
                  <span className="placeholder bg-secondary col-7"></span>
                </div>
                <div className="text-center">
                  <h1 className="display-4 text-secondary opacity-25">--</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jongste Runner Card */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm" style={{ borderRadius: '0.5rem' }}>
            <div className="card-body">
              <div className="placeholder-glow">
                <div className="mb-2">
                  <span className="placeholder col-12 mb-2" style={{ height: '20px', backgroundColor: '#999' }}></span>
                  <span className="placeholder col-12 mb-2" style={{ height: '20px', backgroundColor: '#999' }}></span>
                  <span className="placeholder col-12" style={{ height: '20px', backgroundColor: '#999' }}></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Card */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm" style={{ borderRadius: '0.5rem' }}>
            <div className="card-body">
              <div className="placeholder-glow">
                <div className="d-flex justify-content-center mb-2">
                  <span className="placeholder" style={{ width: '60px', height: '16px', backgroundColor: '#999' }}></span>
                </div>
                <div className="text-center">
                  <h1 className="display-4 text-secondary opacity-25">--</h1>
                </div>
                <span className="placeholder col-12" style={{ height: '38px', backgroundColor: '#999' }}></span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export const TwoSectionSkeleton = () => {
  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Left Card: Most Wins */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm" style={{ borderRadius: '1rem' }}>
            <div className="mb-3">
              <span className="placeholder col-10 mb-2" style={{ height: '18px', backgroundColor: '#999' }}></span>
              <span className="placeholder col-8" style={{ height: '18px', backgroundColor: '#999' }}></span>
            </div>

            {[1, 2, 3].map((_, i) => (
              <div className="d-flex align-items-center mb-3" key={i}>
                {/* <span
                  className="placeholder rounded-circle me-2"
                  style={{ width: '24px', height: '24px', backgroundColor: '#bbb' }}
                ></span> */}
                <span className="placeholder col-7 me-2" style={{ height: '16px', backgroundColor: '#aaa' }}></span>
                <span className="ms-auto placeholder col-2" style={{ height: '16px', backgroundColor: '#bbb' }}></span>
              </div>
            ))}

            <div className="d-flex justify-content-end">
              <span
                className="placeholder rounded-circle"
                style={{ width: '36px', height: '36px', backgroundColor: '#c1c1c1' }}
              ></span>
            </div>
          </div>
        </div>

        {/* Right Section: Team Top in Stages */}
        <div className="col-md-8">
          <div className="mb-3">
            <span className="placeholder col-6" style={{ height: '30px', backgroundColor: '#999' }}></span>
          </div>

          {[1, 2, 3, 4].map((_, i) => (
            <div
              className="d-flex align-items-center justify-content-between py-2 border-bottom"
              key={i}
            >
              <span className="placeholder col-2" style={{ height: '16px',marginBottom:"10px", backgroundColor: '#aaa' }}></span>
              <span className="placeholder col-3" style={{ height: '16px', backgroundColor: '#999' }}></span>
              <span className="placeholder col-3" style={{ height: '16px', backgroundColor: '#999' }}></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TwoSectionSkeleton2 = () => {
  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Left Card: Most Wins */}

             <div className="col-md-6">
          <div className="mb-3">
            <span className="placeholder col-6" style={{ height: '30px', backgroundColor: '#999' }}></span>
          </div>

          {[1, 2, 3, 4].map((_, i) => (
            <div
              className="d-flex align-items-center justify-content-between py-2 border-bottom"
              key={i}
            >
              <span className="placeholder col-2" style={{ height: '16px',marginBottom:"10px", backgroundColor: '#aaa' }}></span>
              <span className="placeholder col-3" style={{ height: '16px', backgroundColor: '#999' }}></span>
              <span className="placeholder col-3" style={{ height: '16px', backgroundColor: '#999' }}></span>
            </div>
          ))}
        </div>

      

        {/* Right Section: Team Top in Stages */}
     <div className="col-md-3">
          <div className="card p-3 shadow-sm" style={{ borderRadius: '1rem' }}>
            <div className="mb-3">
              <span className="placeholder col-10 mb-2" style={{ height: '18px', backgroundColor: '#999' }}></span>
              <span className="placeholder col-8" style={{ height: '18px', backgroundColor: '#999' }}></span>
            </div>

            {[1, 2, 3].map((_, i) => (
              <div className="d-flex align-items-center mb-3" key={i}>
                {/* <span
                  className="placeholder rounded-circle me-2"
                  style={{ width: '24px', height: '24px', backgroundColor: '#bbb' }}
                ></span> */}
                <span className="placeholder col-7 me-2" style={{ height: '16px', backgroundColor: '#aaa' }}></span>
                <span className="ms-auto placeholder col-2" style={{ height: '16px', backgroundColor: '#bbb' }}></span>
              </div>
            ))}

            <div className="d-flex justify-content-end">
              <span
                className="placeholder rounded-circle"
                style={{ width: '36px', height: '36px', backgroundColor: '#c1c1c1' }}
              ></span>
            </div>
          </div>
          
        </div>
          <div className="col-md-3">
          <div className="card p-3 shadow-sm" style={{ borderRadius: '1rem' }}>
            <div className="mb-3">
              <span className="placeholder col-10 mb-2" style={{ height: '18px', backgroundColor: '#999' }}></span>
              <span className="placeholder col-8" style={{ height: '18px', backgroundColor: '#999' }}></span>
            </div>

            {[1, 2, 3].map((_, i) => (
              <div className="d-flex align-items-center mb-3" key={i}>
                {/* <span
                  className="placeholder rounded-circle me-2"
                  style={{ width: '24px', height: '24px', backgroundColor: '#bbb' }}
                ></span> */}
                <span className="placeholder col-7 me-2" style={{ height: '16px', backgroundColor: '#aaa' }}></span>
                <span className="ms-auto placeholder col-2" style={{ height: '16px', backgroundColor: '#bbb' }}></span>
              </div>
            ))}

            <div className="d-flex justify-content-end">
              <span
                className="placeholder rounded-circle"
                style={{ width: '36px', height: '36px', backgroundColor: '#c1c1c1' }}
              ></span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export const ListSkeleton = () => {
  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Left Table Skeleton */}
        <div className="col-md-8">
          {/* Header */}
          <div className="d-flex fw-bold mb-3">
            {['Date', 'Race', 'Winner', 'Team'].map((header, idx) => (
              <div key={idx} className="col text-uppercase" style={{ color: '#ccc', fontSize: '14px' }}>
                {header}
              </div>
            ))}
          </div>

          {/* Table Rows */}
          {[...Array(10)].map((_, idx) => (
            <div className="d-flex align-items-center py-2 border-bottom" key={idx}>
              {/* Date */}
              <div className="col">
                <span className="placeholder col-6" style={{ height: '14px', backgroundColor: '#aaa' }}></span>
              </div>
              {/* Race */}
              <div className="col">
                <span className="placeholder col-8" style={{ height: '14px', backgroundColor: '#999' }}></span>
              </div>
              {/* Winner */}
              <div className="col d-flex align-items-center gap-2">
                <span
                  className="placeholder rounded-circle"
                  style={{ width: '20px', height: '20px', backgroundColor: '#bbb' }}
                ></span>
                <span className="placeholder col-6" style={{ height: '14px', backgroundColor: '#999' }}></span>
              </div>
              {/* Team */}
              <div className="col">
                <span className="placeholder col-7" style={{ height: '14px', backgroundColor: '#aaa' }}></span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="col-md-4 d-flex flex-column gap-4">
          {[1, 2, 3].map((_, i) => (
            <div
              className="card p-3 shadow-sm d-flex flex-column justify-content-between"
              style={{ borderRadius: '1rem', minHeight: '180px' }}
              key={i}
            >
              <div className="mb-3">
                <span className="placeholder col-10 mb-2" style={{ height: '16px', backgroundColor: '#999' }}></span>
                <span className="placeholder col-6" style={{ height: '16px', backgroundColor: '#999' }}></span>
              </div>

              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex flex-column">
                  <span className="placeholder col-8 mb-1" style={{ height: '14px', backgroundColor: '#bbb' }}></span>
                  <span className="placeholder col-4" style={{ height: '20px', backgroundColor: '#ccc' }}></span>
                </div>
                <div className="d-flex align-items-center">
                  <span
                    className="placeholder rounded-circle me-2"
                    style={{ width: '48px', height: '48px', backgroundColor: '#bbb' }}
                  ></span>
                  <span
                    className="placeholder rounded-circle"
                    style={{ width: '24px', height: '24px', backgroundColor: '#999' }}
                  ></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default {
  LoadingStats,
  ErrorStats,
  NoDataMessage,
  PartialDataWarning,
  BoxSkeleton,
  TwoSectionSkeleton,
  ListSkeleton
};


// import React from 'react';

// // Enhanced Loading component that matches the existing Wielerstats design aesthetic
// export const LoadingStats = () => (
//   <div className="list-white-cart loading-container text-center p-4 my-3">
//     <div className="d-flex flex-column align-items-center justify-content-center">
//       {/* Custom loader with site's green color */}
//       <div className="spinner mb-3" style={{ width: '48px', height: '48px' }}>
//         <img src="/images/loading-spinner.svg" alt="Loading" className="w-100 h-100" 
//              onError={(e) => {
//                e.target.onerror = null;
//                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'%3E%3Cpath fill='%2308a951' d='M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z' opacity='.25'/%3E%3Cpath fill='%2308a951' d='M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z'%3E%3CanimateTransform attributeName='transform' dur='0.75s' repeatCount='indefinite' type='rotate' values='0 12 12;360 12 12'/%3E%3C/path%3E%3C/svg%3E";
//              }}
//         />
//       </div>
//       <h4 className="mb-2">Loading statistics</h4>
//       <p className="text-muted small mb-3">We halen de laatste statistieken op</p>
      
//       {/* Visual placeholders that match the page design */}
//       <div className="w-100 placeholder-loading">
//         <div className="loading-bar mb-2" style={{ height: '24px', width: '70%', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
//         <div className="loading-bar mb-2" style={{ height: '24px', width: '85%', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
//         <div className="loading-bar" style={{ height: '24px', width: '60%', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
//       </div>
//     </div>
//     <a href="#?" className="green-circle-btn disabled">
//       <img src="/images/arow.svg" alt="" />
//     </a>
//   </div>
// );

// // Enhanced Error component that matches the existing Wielerstats design aesthetic
// export const ErrorStats = ({ message }) => (
//   <div className="list-white-cart error-container text-center p-4 my-3">
//     <div className="d-flex flex-column align-items-center justify-content-center">
//       {/* Custom error icon with site's styling */}
//       <div className="error-icon mb-3" style={{ width: '48px', height: '48px' }}>
//         <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2">
//           <circle cx="12" cy="12" r="10" />
//           <line x1="12" y1="8" x2="12" y2="12" />
//           <line x1="12" y1="16" x2="12.01" y2="16" />
//         </svg>
//       </div>
//       <h4 className="mb-2">Fout bij laden</h4>
//       <p className="text-muted small mb-3">{message || "Kan statistieken niet laden"}</p>
      
//       <button 
//         className="btn btn-sm" 
//         style={{ backgroundColor: '#08a951', color: 'white', borderRadius: '50px', padding: '8px 20px' }}
//         onClick={() => window.location.reload()}
//       >
//         Opnieuw proberen
//       </button>
//     </div>
//   </div>
// );

// // No Data Message component that matches the existing Wielerstats design
// export const NoDataMessage = ({ filterYear }) => (
//   <div className="list-white-cart no-data-message text-center p-4 my-3">
//     <div className="d-flex flex-column align-items-center justify-content-center">
//       <div className="no-data-icon mb-3" style={{ width: '48px', height: '48px' }}>
//         <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#aaaaaa" strokeWidth="1.5">
//           <path d="M21 6h-5m-8 0H3" />
//           <path d="M3 12h18" />
//           <path d="M12 18H3" />
//           <path d="M8 6v12" />
//           <path d="M17 14l4 4" />
//           <path d="M21 14l-4 4" />
//         </svg>
//       </div>
//       <h4 className="mb-2">Geen gegevens beschikbaar</h4>
//       <p className="text-muted small mb-3">
//         Geen statistieken gevonden {filterYear !== 'All-time' ? `in ${filterYear}` : ''}
//       </p>
      
//       <button 
//         className="btn btn-sm" 
//         style={{ backgroundColor: '#08a951', color: 'white', borderRadius: '50px', padding: '8px 20px' }}
//         onClick={() => window.location.reload()}
//       >
//         Andere statistieken proberen
//       </button>
//     </div>
//     <a href="#?" className="green-circle-btn">
//       <img src="/images/arow.svg" alt="" />
//     </a>
//   </div>
// );

// // Partial Data Warning banner with site's styling
// export const PartialDataWarning = ({ visibleCardCount, totalEndpoints, error }) => (
//   <div className="list-white-cart w-100 p-3 mb-4" style={{ borderLeft: '4px solid #ffc107' }}>
//     <div className="d-flex justify-content-between align-items-center">
//       <div>
//         <h6 className="mb-1 font-weight-bold">Gedeeltelijke gegevens beschikbaar</h6>
//         <p className="mb-0 small text-muted">
//           Toont {visibleCardCount} van {totalEndpoints} statistieken
//         </p>
//       </div>
//       <button 
//         className="btn btn-sm"
//         style={{ backgroundColor: '#08a951', color: 'white', borderRadius: '50px', padding: '6px 16px' }}
//         onClick={() => window.location.reload()}
//       >
//         Vernieuwen
//       </button>
//     </div>
//     {error && error.failedEndpoints && (
//       <details className="mt-2 small">
//         <summary className="cursor-pointer text-muted">Details bekijken</summary>
//         <p className="mt-2 mb-0 text-muted">
//           Kon niet alle statistieken laden. Vernieuw voor nieuwe willekeurige statistieken.
//         </p>
//       </details>
//     )}
//   </div>
// );

// export default {
//   LoadingStats,
//   ErrorStats,
//   NoDataMessage,
//   PartialDataWarning
// };

// DashboardSkeleton.js
