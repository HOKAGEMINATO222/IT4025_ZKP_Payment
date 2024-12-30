import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const TransactionHistory = ({ user, isAdmin }) => {
  const [transactions, setTransactions] = useState([]); // Transactions state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [selectedUserId, setSelectedUserId] = useState(user._id); // Selected user ID (for admin)

  // Fetch transactions
  const fetchTransactions = async (userId) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/balance/${userId}`,
        {
          method: "GET",
          credentials: "include", // Include cookies
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result);

        setTransactions(result); // Update transactions state
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch transactions.");
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch for user's transactions
  useEffect(() => {
    fetchTransactions(user.id); // Fetch for the current user or selected user
  }, [user.id]);

  // Admin: Handle user selection
  const handleUserSelection = (e) => {
    setSelectedUserId(e.target.value);
    fetchTransactions(e.target.value); // Fetch transactions for the selected user
  };

  return (
    <Box padding={3} sx={{ backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
      {isAdmin && (
        <Box mb={2}>
          <TextField
            label="User ID"
            variant="outlined"
            value={selectedUserId}
            onChange={handleUserSelection}
            fullWidth
            sx={{
              backgroundColor: "#fff",
              borderRadius: "4px",
              boxShadow: 1,
            }}
          />
        </Box>
      )}

      {loading ? (
        <Typography variant="h6" sx={{ textAlign: "center", color: "#888" }}>
          Loading...
        </Typography>
      ) : error ? (
        <Typography color="error" variant="body1" sx={{ textAlign: "center" }}>
          {error}
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: 2,
            maxHeight: 400,
            overflowY: "auto",
          }}
        >
          <Table>
            <TableHead sx={{ backgroundColor: "#3f51b5", color: "#fff" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                  Transaction ID
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                  Amount
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                  Type
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
                  Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions &&
                transactions.map((transaction) => (
                  <TableRow
                    key={transaction._id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <TableCell>{transaction._id}</TableCell>
                    <TableCell>${transaction.amount}</TableCell>
                    <TableCell>{transaction.transactionType}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color:
                            transaction.status === "success"
                              ? "green"
                              : transaction.status === "pending"
                              ? "orange"
                              : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {transaction.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.transactionDate).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TransactionHistory;
