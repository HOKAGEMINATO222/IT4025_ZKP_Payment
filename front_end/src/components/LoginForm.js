import React from "react";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";

const LoginForm = ({ onLogin, loginError }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        backgroundColor: "#f4f6f8",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px", // Đảm bảo form không quá rộng
          padding: "30px", // Thêm padding để tạo không gian
          border: "1px solid #ddd", // Viền nhẹ cho form
          borderRadius: "8px", // Bo tròn các góc của form
          backgroundColor: "#fff", // Nền màu trắng cho form
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Hiệu ứng bóng cho form
        }}
      >
        {/* Căn giữa tiêu đề Login */}
        <Typography
          variant="h4"
          sx={{
            marginBottom: "20px",
            fontWeight: "bold",
            color: "#3f51b5",
            textAlign: "center", // Căn giữa tiêu đề
          }}
        >
          Login
        </Typography>

        {/* Hiển thị thông báo lỗi nếu có */}
        {loginError && (
          <Alert
            severity="error"
            sx={{
              width: "96%",
              marginBottom: "20px", // Thêm khoảng cách dưới để không bị dính vào các input
              borderRadius: "8px",
              padding: "10px", // Thêm padding cho Alert để không quá chật
              fontSize: "16px", // Chỉnh font size cho dễ đọc
            }}
          >
            {loginError}
          </Alert>
        )}

        <form onSubmit={onLogin} style={{ width: "100%" }}>
          <TextField
            name="name"
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{
              borderRadius: "8px",
              "& .MuiInputBase-root": {
                borderRadius: "8px",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderRadius: "8px",
                },
              },
            }}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            sx={{
              borderRadius: "8px",
              "& .MuiInputBase-root": {
                borderRadius: "8px",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderRadius: "8px",
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              borderRadius: "25px",
              padding: "12px",
              marginTop: "20px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "#1a237e",
                boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default LoginForm;
