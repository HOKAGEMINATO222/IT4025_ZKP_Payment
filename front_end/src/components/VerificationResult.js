import React from 'react';

const VerificationResult = ({ result }) => {
  if (result === null) return null;

  return (
    <div>
      <h3>Kết quả xác minh:</h3>
      {result ? (
        <p style={{ color: 'green' }}>Chứng minh hợp lệ!</p>
      ) : (
        <p style={{ color: 'red' }}>Chứng minh không hợp lệ!</p>
      )}
    </div>
  );
};

export default VerificationResult;
