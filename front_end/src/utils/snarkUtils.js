import { groth16 } from 'snarkjs';

export async function generateProof(input) {

  const wasmUrl = 'http://localhost:5000/circuits/payment_js/payment.wasm';
  const zkeyUrl = 'http://localhost:5000/circuits/payment_0001.zkey';

  console.log('Input:', input);

  
  // Tải mạch và tạo witness
  try {
    // Tạo proof và publicSignals từ fullProve
    const { proof, publicSignals } = await groth16.fullProve(input, wasmUrl, zkeyUrl);
    console.log('Proof:', proof);
    console.log('Public signals:', publicSignals);
    
    // Trả về proof và public signals
    return { proof, publicSignals };
  } catch (error) {
    console.error('Lỗi khi tạo proof hoặc witness:', error);
    throw error;  // Ném lỗi ra ngoài nếu cần
  }
}
