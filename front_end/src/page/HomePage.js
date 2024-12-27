import React, { useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, TextField, Button, Box, Snackbar } from '@mui/material';
import { Alert } from '@mui/lab';
import { generateProof } from '../utils/snarkUtils'; 

const HomePage = () => {
  const [balance, setBalance] = useState(1000);  // Số dư mặc định (sử dụng số dư thực tế từ backend)
  const [transactionAmount, setTransactionAmount] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransaction = async (e) => {
    e.preventDefault();

    if (Number(balance) < Number(transactionAmount)) {
      setError('Số dư không đủ để thực hiện giao dịch.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Giả sử generateProof là hàm tạo proof và publicSignals
      const { proof, publicSignals } = await generateProof({
        a: balance,
        b: transactionAmount,
      });

      // Gửi proof và publicSignals lên backend (gửi đến API /payment)
      // await submitProofToBackend(proof, publicSignals);
      setSuccessMessage('Giao dịch thành công!');

      // Cập nhật số dư (giả sử giảm số dư cho giao dịch)
      setBalance(balance - transactionAmount);
    } catch (err) {
      console.error('Lỗi tạo ZKP:', err);
      setError('Có lỗi khi tạo chứng minh ZKP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
      <Grid container spacing={3}>
        {/* Card hiển thị thông tin người dùng */}
        <Grid item xs={12} md={6}>
          <Card sx={{ minHeight: '250px' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Thông Tin Người Dùng
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Tên người dùng:</strong> Nguyễn Văn A
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Số dư tài khoản:</strong> {balance} VND
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card chức năng thanh toán */}
        <Grid item xs={12} md={6}>
          <Card sx={{ minHeight: '250px' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Chức Năng Thanh Toán
              </Typography>
              <form onSubmit={handleTransaction}>
                <TextField
                  label="Số tiền giao dịch"
                  type="number"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                />
                {error && <Typography color="error">{error}</Typography>}
                {successMessage && <Typography color="success">{successMessage}</Typography>}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                  <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Thanh Toán'}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Hiển thị thông báo lỗi hoặc thành công */}
      <Snackbar
        open={!!error || !!successMessage}
        autoHideDuration={6000}
        onClose={() => setError('') || setSuccessMessage('')}
      >
        <Alert severity={error ? 'error' : 'success'} sx={{ width: '100%' }}>
          {error || successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HomePage;
