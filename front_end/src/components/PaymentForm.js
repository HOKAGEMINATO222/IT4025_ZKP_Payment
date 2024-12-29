import React, { useState } from "react";
import { generateProof } from "../utils/snarkUtils";
import "./PaymentForm.css"; // Import file CSS để style

const PaymentForm = ({ onSubmitProof, balance }) => {
  const [transaction, setTransaction] = useState("");
  const [error, setError] = useState("");
  
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (Number(balance) <= Number(transaction)) {
    //   setError("Số dư phải lớn hơn số tiền giao dịch!");
    //   return;
    // }

    console.log("Số dư:", balance);
    try {
      const { proof, publicSignals } = await generateProof({
        a: balance,
        b: transaction,
      });
      onSubmitProof(proof, publicSignals, transaction);
    } catch (err) {
      console.error("Lỗi tạo ZKP:", err);
      setError("Có lỗi khi tạo chứng minh ZKP!");
    }
  };

  return (
    <div className="payment-form">
      <h2 className="title">Thanh toán ZKP</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="balance">Số dư:</label>
          <input
            id="balance"
            type="number"
            value={balance || ""}
            className="input"
            required
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="transaction">Số tiền giao dịch:</label>
          <input
            id="transaction"
            type="number"
            value={transaction}
            onChange={(e) => setTransaction(e.target.value)}
            className="input"
            required
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="submit-btn">
          Tạo Chứng Minh
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
