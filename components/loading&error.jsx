
import React from 'react';

export const LoadingStats = () => (
  <div className="list-white-cart loading-container text-center p-4 my-3">
    <div className="d-flex flex-column align-items-center justify-content-center">
      <div className="w-100 placeholder-loading">
        <div className="loading-bar mb-2" style={{ height: '30px', width: '40%', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
        <div className="loading-bar mb-2" style={{ height: '30px', width: '75%', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
        <div className="loading-bar" style={{ height: '30px', width: '60%', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
      </div>
    </div>
  </div>
);

export const Loading = () => (
  <div className=" loading-container text-center p-4 my-3">
    <div className="d-flex flex-column align-items-center justify-content-center">

      <div className="w-100 placeholder-loading">
        <div className="loading-bar mb-2" style={{ height: '30px', width: '40%', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
        <div className="loading-bar mb-2" style={{ height: '30px', width: '75%', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
        <div className="loading-bar" style={{ height: '30px', width: '60%', backgroundColor: '#f0f0f0', borderRadius: '4px' }}></div>
      </div>
    </div>
  </div>
);

export const ErrorMessage = ({ errorType = "general" }) => {
  const errorMessages = {
    api_error: "API Error",
    no_data: "No Data Available",
    no_endpoint_data: "No Endpoint Data",
    null_data: "Data Not Found",
    empty_array: "No Records Found",
    empty_object: "No Information Available",
    processing_error: "Data Processing Error",
    no_data_found: "No Records Found",
    general: "No Data Available",
  };

  return (
    <div className="text-danger text-center py-3 noData-error">
      {errorMessages[errorType] || errorMessages.general}
    </div>
  );
};

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
    <div className="container py-3">
      <div className="row g-3">
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

        <div className="col-md-4">
          <div className="card h-100 shadow-sm" style={{ borderRadius: '0.5rem' }}>
            <div className="card-body">
              <span className="placeholder bg-dark col-6 mb-3"></span>
              <div className="mb-2">
                <span className="placeholder col-12 mb-2" style={{ height: '20px', backgroundColor: '#999' }}></span>
                <span className="placeholder col-12 mb-2" style={{ height: '20px', backgroundColor: '#999' }}></span>

              </div>
            </div>
          </div>
        </div>

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
export const BoxSkeleton2 = () => {
  return (
    <div className="container py-3">
      <div className="row g-3">
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

        <div className="col-md-4">
          <div className="card h-100 shadow-sm" style={{ borderRadius: '0.5rem' }}>
            <div className="card-body">
              <span className="placeholder bg-dark col-6 mb-3"></span>
              <div className="mb-2">
                <span className="placeholder col-12 mb-2" style={{ height: '20px', backgroundColor: '#999' }}></span>
                <span className="placeholder col-12 mb-2" style={{ height: '20px', backgroundColor: '#999' }}></span>

              </div>
            </div>
          </div>
        </div>

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
      </div>
    </div>
  );
};

export const TwoSectionSkeleton = () => {
  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm" style={{ borderRadius: '1rem' }}>
            <div className="mb-3">
              <span className="placeholder col-10 mb-2" style={{ height: '18px', backgroundColor: '#999' }}></span>
              <span className="placeholder col-8" style={{ height: '18px', backgroundColor: '#999' }}></span>
            </div>

            {[1, 2, 3].map((_, i) => (
              <div className="d-flex align-items-center mb-3" key={i}>
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

        <div className="col-md-8">
          <div className="mb-3">
            <span className="placeholder col-6" style={{ height: '30px', backgroundColor: '#999' }}></span>
          </div>

          {[1, 2, 3, 4].map((_, i) => (
            <div
              className="d-flex align-items-center justify-content-between py-2 border-bottom"
              key={i}
            >
              <span className="placeholder col-2" style={{ height: '16px', marginBottom: "10px", backgroundColor: '#aaa' }}></span>
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
        <div className="col-md-6">
          <div className="mb-3">
            <span className="placeholder col-6" style={{ height: '30px', backgroundColor: '#999' }}></span>
          </div>

          {[1, 2, 3, 4].map((_, i) => (
            <div
              className="d-flex align-items-center justify-content-between py-2 border-bottom"
              key={i}
            >
              <span className="placeholder col-2" style={{ height: '16px', marginBottom: "10px", backgroundColor: '#aaa' }}></span>
              <span className="placeholder col-3" style={{ height: '16px', backgroundColor: '#999' }}></span>
              <span className="placeholder col-3" style={{ height: '16px', backgroundColor: '#999' }}></span>
            </div>
          ))}
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow-sm" style={{ borderRadius: '1rem' }}>
            <div className="mb-3">
              <span className="placeholder col-10 mb-2" style={{ height: '18px', backgroundColor: '#999' }}></span>
              <span className="placeholder col-8" style={{ height: '18px', backgroundColor: '#999' }}></span>
            </div>

            {[1, 2, 3].map((_, i) => (
              <div className="d-flex align-items-center mb-3" key={i}>
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
    <div className="container ">
      <div className="col-md-12">
        {[...Array(10)].map((_, idx) => (
          <div className="d-flex align-items-center py-2 border-bottom" key={idx}>
            <div className="col d-flex align-items-center gap-2">
              <span
                className="placeholder "
                style={{ width: '30px', height: '30px', backgroundColor: '#bbb', marginBottom: "20px" }}
              ></span>
              <span className="placeholder col-6" style={{ height: '20px', backgroundColor: '#999', marginBottom: "20px" }}></span>
            </div>
            <div className="col">
              <span className="placeholder col-7" style={{ height: '20px', backgroundColor: '#aaa', marginBottom: "20px" }}></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="col-md-12 d-flex flex-column gap-4">
      {[1, 2, 3].map((_, i) => (
        <div
          className="card p-3 shadow-sm d-flex flex-column justify-content-between"
          style={{ borderRadius: '1rem', minHeight: '250px' }}
          key={i}
        >
          <div className="mb-3">
            <span className="placeholder col-10 mb-2" style={{ height: '16px', backgroundColor: '#999' }}></span>
            <span className="placeholder col-6" style={{ height: '16px', backgroundColor: '#999', marginLeft: "5px" }}></span>
            <br />
            <span className="placeholder col-6" style={{ height: '16px', backgroundColor: '#999', marginLeft: "5px" }}></span>
            <br />
            <span className="placeholder col-6" style={{ height: '16px', backgroundColor: '#999', marginLeft: "5px" }}></span>
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
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default {
  LoadingStats,
  ErrorStats,
  NoDataMessage,
  PartialDataWarning,
  BoxSkeleton,
  BoxSkeleton2,
  TwoSectionSkeleton,
  ListSkeleton,
  CardSkeleton,
  ErrorMessage,
  Loading
};
