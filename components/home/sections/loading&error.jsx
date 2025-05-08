import React from 'react';

// Loading component for statistics section
export const LoadingStats = () => (
  <div className="col-12 text-center py-5">
    <div className="spinner-border text-success" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="mt-3">Loading statistics...</p>
  </div>
);

// Error component for statistics section
export const ErrorStats = ({ message }) => (
  <div className="col-12 text-center py-5">
    <div className="alert alert-danger" role="alert">
      <h3>Error Loading Data</h3>
      <p>{message}</p>
    </div>
  </div>
);