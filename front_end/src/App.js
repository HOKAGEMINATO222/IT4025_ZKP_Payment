import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import AdminPanel from "./components/AdminPanel";
import UserPanel from "./components/UserPanel";

const App = () => {
  const [user, setUser] = useState(null); // User state
  const [loginError, setLoginError] = useState(""); // Login error state
  const [users, setUsers] = useState([]); // List of users for admin
  const [openDialog, setOpenDialog] = useState(false); // Admin dialog state
  const [newUser, setNewUser] = useState({
    name: "",
    password: "",
    balance: "",
  }); // New user data
  const [loading, setLoading] = useState(true); // Loading state
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Snackbar severity

  // Authenticate user on app load
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

  // Fetch users for admin
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
            setUsers(result.formattedUsers); // Set users state
          }
        } catch (err) {
          console.error("Error fetching users:", err);
        }
      };

      fetchUsers();
    }
  }, [user]);

  // Handle login
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
      if (response.ok) {
        setUser(result.user); // Update user state
      } else {
        setLoginError(result.message); // Set login error
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("An error occurred. Please try again.");
    }
  };

  // Handle logout
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

  // Handle admin creating a new user
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

  // Handle proof submission (user panel)
  const handleProofSubmission = async (
    proof,
    publicSignals,
    transactionAmount
  ) => {
    try {
      const response = await fetch("http://localhost:5000/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proof,
          publicSignals,
          transactionAmount,
          userId: user.id,
        }),
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

  // Handle closing the snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Show loading spinner while authenticating
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm onLogin={handleLogin} loginError={loginError} />;
  }

  // Show admin panel
  if (user.type === "admin") {
    return (
      <AdminPanel
        users={users}
        onLogout={handleLogout}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        newUser={newUser}
        setNewUser={setNewUser}
        handleCreateUser={handleCreateUser}
      />
    );
  }

  // Show user panel
  return (
    <UserPanel
      user={user}
      onLogout={handleLogout}
      handleProofSubmission={handleProofSubmission}
      snackbarOpen={snackbarOpen}
      handleCloseSnackbar={handleCloseSnackbar}
      snackbarMessage={snackbarMessage}
      snackbarSeverity={snackbarSeverity}
    />
  );
};

export default App;
