import React, { useState } from 'react';
import PaymentForm from './components/PaymentForm';
import VerificationResult from './components/VerificationResult';

const App = () => {
  const [verificationResult, setVerificationResult] = useState(null);

  const handleProofSubmission = async (proof, publicSignals) => {
    try {
      const response = await fetch('http://localhost:5000/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proof, publicSignals }),
      });
      const result = await response.json();
      setVerificationResult(result.isValid);
    } catch (err) {
      console.error('Lỗi khi xác minh:', err);
      setVerificationResult(false);
    }
  };

  return (
    <div>
      <PaymentForm onSubmitProof={handleProofSubmission} />
      <VerificationResult result={verificationResult} />
    </div>
  );
};

export default App;
