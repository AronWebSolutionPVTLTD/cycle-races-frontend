// import React from 'react';

// // Loading component for statistics section
// export const LoadingStats = () => (
//   <div className="col-12 text-center py-5">
//     <div className="spinner-border text-success" role="status">
//       <span className="visually-hidden">Loading...</span>
//     </div>
//     <p className="mt-3">Loading statistics...</p>
//   </div>
// );

// // Error component for statistics section
// export const ErrorStats = ({ message }) => (
//   <div className="col-12 text-center py-5">
//     <div className="alert alert-danger" role="alert">
//       <h3>Error Loading Data</h3>
//       <p>{message}</p>
//     </div>
//   </div>
// );

import React from 'react';

// Enhanced Loading component that matches the existing design aesthetic
export const LoadingStats = () => (
  <div className="loading-container text-center p-5 my-4 bg-light rounded shadow-sm">
    <div className="spinner-border text-primary mb-3" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <h3 className="text-muted">Loading rider statistics...</h3>
    <p className="text-muted">Please wait while we fetch the latest data.</p>
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
    <p className="text-muted">{message || "Failed to load rider statistics"}</p>
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

export default {
  LoadingStats,
  ErrorStats,
  NoDataMessage,
  PartialDataWarning
};