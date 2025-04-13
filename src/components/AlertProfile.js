// src/components/AlertProfile.js
import React from 'react';

const AlertProfile = ({ alertCounts }) => {
  return (
    <div>
      <h2>Alert Counts</h2>
      {alertCounts.map(([alert, count]) => (
        <div key={alert} style={{ marginBottom: '0.5rem' }}>
          {alert}: {count}
        </div>
      ))}
    </div>
  );
};

export default AlertProfile;
