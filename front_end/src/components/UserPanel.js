import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import PaymentForm from "./PaymentForm";

const UserPanel = ({
  user,
  onLogout,
  handleProofSubmission,
  snackbarOpen,
  handleCloseSnackbar,
  snackbarMessage,
  snackbarSeverity,
}) => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {user.name}
          </Typography>
          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <div>
        <PaymentForm
          onSubmitProof={handleProofSubmission}
          balance={user.balance}
        />
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserPanel;
