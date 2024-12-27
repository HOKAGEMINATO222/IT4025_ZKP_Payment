pragma circom 2.0.0;

template Check(){
    signal input a;      // Số dư của người gửi
    signal input b;      // Số tiền giao dịch

    signal output is_valid;
    signal tmp;
    tmp  <-- a > b ? 1 : 0;
    is_valid <== tmp;
}


component main = Check();