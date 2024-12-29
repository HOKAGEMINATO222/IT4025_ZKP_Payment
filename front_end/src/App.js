import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import PaymentForm from "./components/PaymentForm";

const App = () => {
  const [user, setUser] = useState(null); // User state
  const [loginError, setLoginError] = useState(""); // Error state for login
  const [users, setUsers] = useState([]); // Admin: List of users
  const [openDialog, setOpenDialog] = useState(false); // Dialog state for new user
  const [newUser, setNewUser] = useState({
    name: "",
    password: "",
    balance: "",
  });
  const [loading, setLoading] = useState(true); // Loading state on app load
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Snackbar type: success/error

  // Check authentication on app load
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/user/authenticate",
          {
            method: "GET",
            credentials: "include", // Include cookies
          }
        );

        if (response.ok) {
          const result = await response.json();
          setUser(result.user); // Set user state if authenticated
        } else {
          console.warn("User not authenticated.");
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    authenticateUser();
  }, []);

  // Fetch users for admin view
  useEffect(() => {
    if (user && user.type === "admin") {
      const fetchUsers = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/api/admin/users",
            {
              method: "GET",
              credentials: "include", // Include cookies for authentication
            }
          );
          const result = await response.json();
          if (response.ok) {
            setUsers(result.users);
          }
        } catch (err) {
          console.error("Error fetching users:", err);
        }
      };

      fetchUsers();
    }
  }, [user]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
        credentials: "include",
      });

      const result = await response.json();
      console.log("Login response:", result);
      if (response.ok) {
        setUser(result.user); // Update user state
      } else {
        setLoginError(result.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("An error occurred. Please try again.");
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null); // Clear user state
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Handle Admin: Create New User
  const handleCreateUser = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/create-user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
          credentials: "include",
        }
      );

      if (response.ok) {
        setUsers((prevUsers) => [...prevUsers, newUser]); // Update users list
        setOpenDialog(false); // Close dialog
        setNewUser({ name: "", password: "", balance: "" }); // Reset form
      }
    } catch (err) {
      console.error("Error creating user:", err);
    }
  };

  const handleProofSubmission = async (proof, publicSignals, transactionAmount) => {
    try {
      const response = await fetch("http://localhost:5000/payment", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proof, publicSignals, transactionAmount, userId: user.id,}),
      });

      const result = await response.json();

      console.log("Payment verification result:", result);

      if (result.isValid) { 
        setUser((prevUser) => ({
          ...prevUser,
          balance: result.updatedBalance, // Update balance
        }));
        setSnackbarMessage("Payment successful! Balance updated.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Payment verification failed.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error("Error during verification:", err);
      setSnackbarMessage("An error occurred during payment processing.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };  

  // Show loading spinner while authenticating
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show Login Form if not authenticated
  if (!user) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        {loginError && <Alert severity="error">{loginError}</Alert>}
        <form onSubmit={handleLogin}>
          <TextField
            name="name"
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </Box>
    );
  }

  // Show Admin Panel
  if (user.type === "admin") {
    return (
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Admin Panel
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Box padding={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            Create User
          </Button>
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Create New User</DialogTitle>
            <DialogContent>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <TextField
                label="Password"
                fullWidth
                margin="normal"
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, password: e.target.value }))
                }
              />
              <TextField
                label="Balance"
                fullWidth
                margin="normal"
                type="number"
                value={newUser.balance}
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, balance: e.target.value }))
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={handleCreateUser} variant="contained">
                Create
              </Button>
            </DialogActions>
          </Dialog>
          <TableContainer component={Paper} sx={{ marginTop: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Password</TableCell>
                  <TableCell>Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.name}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.password}</TableCell>
                    <TableCell>{user.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    );
  }

  // Show User Panel
  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {user.name}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
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

export default App;
