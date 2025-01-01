import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";
import PaymentForm from "./PaymentForm";
import TransactionHistory from "./TransactionHistory";

const UserPanel = ({
  user,
  onLogout,
  handleProofSubmission,
  snackbarOpen,
  handleCloseSnackbar,
  snackbarMessage,
  snackbarSeverity,
  isAdmin,
}) => {
  const [openDialog, setOpenDialog] = useState(false); // State to control the Dialog visibility

  // Handle opening and closing the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "#3f51b5", boxShadow: 2 }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: "bold", fontSize: "1.2rem" }}
          >
            Welcome, {user.name}
          </Typography>
          <Button
            color="inherit"
            onClick={onLogout}
            sx={{ fontWeight: "bold", textTransform: "none" }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 4 }}>
        <PaymentForm
          onSubmitProof={handleProofSubmission}
          serverHash={user.balance}
        />
      </Box>

      {/* Button to open the transaction history dialog */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDialog}
          sx={{
            padding: "12px 24px",
            borderRadius: 25,
            boxShadow: 2,
            "&:hover": {
              backgroundColor: "#1a237e",
              boxShadow: 4,
            },
          }}
        >
          Transaction History
        </Button>
      </Box>

      {/* Dialog to display transaction history */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="lg"
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 3,
        }}
      >
        <DialogTitle sx={{ backgroundColor: "#3f51b5", color: "white" }}>
          Lịch sử giao dịch
        </DialogTitle>
        <Divider sx={{ borderBottomWidth: 2 }} />
        <DialogContent sx={{ padding: "20px" }}>
          <TransactionHistory user={user} isAdmin={isAdmin} />
        </DialogContent>
        <DialogActions
          sx={{ padding: "10px 20px", backgroundColor: "#f5f5f5" }}
        >
          <Button
            onClick={handleCloseDialog}
            color="primary"
            sx={{
              backgroundColor: "#3f51b5",
              color: "white",
              "&:hover": {
                backgroundColor: "#1a237e",
              },
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ marginTop: "80px" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%", backgroundColor: "#edf7eb" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserPanel;
