import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { generateProof } from "../utils/snarkUtils";

const PaymentForm = ({ onSubmitProof, serverHash }) => {
  const [transaction, setTransaction] = useState("");
  const [oldBalance, setOldBalance] = useState("");
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { proof, publicSignals } = await generateProof({
        oldBalance: oldBalance,
        transaction: transaction, // Align with the circuit's input naming
        serverHash: serverHash,
      });
      onSubmitProof(proof, publicSignals, transaction);
    } catch (err) {
      console.error("Error creating ZKP proof:", err);
      setError("Invalid transaction!");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        padding: 2,
        border: "1px solid #ddd",
        borderRadius: 2,
        boxShadow: 2,
        mt: 3,
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        ZKP Payment
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Current Balance"
          type="number"
          fullWidth
          margin="normal"
          value={oldBalance}
          onChange={(e) => setOldBalance(e.target.value)}
          required
        />
        <TextField
          label="Transaction Amount"
          type="number"
          fullWidth
          margin="normal"
          value={transaction}
          onChange={(e) => setTransaction(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Submit Payment
        </Button>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentForm;
