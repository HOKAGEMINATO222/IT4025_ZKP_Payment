circom payment.circom --r1cs --wasm --sym
cd payment_js
node generate_witness.js payment.wasm ../input.json witness.wtns
cd ..
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v
snarkjs groth16 setup payment.r1cs pot12_final.ptau payment_0000.zkey
snarkjs zkey contribute payment_0000.zkey payment_0001.zkey --name="1st Contributor Name" -v
snarkjs zkey export verificationkey payment_0001.zkey verification_key.json
snarkjs groth16 prove payment_0001.zkey payment_js/witness.wtns proof.json public.json
snarkjs groth16 verify verification_key.json public.json proof.json