import React from 'react';
import './LoadingPage.css';

const LoadingPage = () => {
  return (
    <div className="loading-screen">
      <div className="text-center text-white">
        <h3>Xin hãy đợi một chút...</h3>
        <div className="spinner-border text-light mt-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
