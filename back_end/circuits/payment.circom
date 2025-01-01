pragma circom 2.0.0;

include "./circomlib/circuits/poseidon.circom";

template Payment() {
    signal input oldBalance;        // User's current balance
    signal input transaction;       // Transaction amount
    signal input serverHash;        // Server-provided hash of old balance
    signal output isValid;          // 1 if transaction is valid, 0 otherwise
    signal output newBalance;       // User's new balance
    signal output newBalanceHash;   // Poseidon hash of the new balance

    signal isTransactionNonNegative; // 1 if transaction >= 0, 0 otherwise
    signal isBalanceNonNegative;    // 1 if newBalance >= 0, 0 otherwise

    // Constraints
    newBalance <== oldBalance - transaction;   // Calculate new balance

    // Ensure transaction is non-negative
    isTransactionNonNegative <-- transaction >= 0 ? 1 : 0;

    // Ensure new balance is non-negative
    isBalanceNonNegative <-- newBalance >= 0 ? 1 : 0;

    // `isValid` is true if both conditions are met
    isValid <== isTransactionNonNegative * isBalanceNonNegative;

    // Verify old balance hash
    component oldBalanceHash = Poseidon(1);
    oldBalanceHash.inputs[0] <== oldBalance;
    oldBalanceHash.out === serverHash;

    // Compute new balance hash
    component newHash = Poseidon(1);
    newHash.inputs[0] <== newBalance;
    newBalanceHash <== newHash.out;
}

template Payment1() {
    signal input oldBalance;        // User's current balance
    signal input transaction;    // Purchase amount
    signal input serverHash;        // Server-provided hash of old balance
    signal output isValid;          // 1 if transaction is valid, 0 otherwise
    signal output newBalance;       // User's new balance
    signal output newBalanceHash;   // Poseidon hash of the new balance

    // Constraints
    newBalance <== oldBalance - transaction;   // Calculate new balance

    isValid <-- oldBalance - transaction > 0 ? 1 : 0; 

    // Verify old balance hash
    component oldBalanceHash = Poseidon(1);
    oldBalanceHash.inputs[0] <== oldBalance;
    oldBalanceHash.out === serverHash;

    // Compute new balance hash
    component newHash = Poseidon(1);
    newHash.inputs[0] <== newBalance;
    newBalanceHash <== newHash.out;
}

component main = Payment();
