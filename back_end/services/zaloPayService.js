const axios = require('axios').default; // Gửi request HTTP
const CryptoJS = require('crypto-js'); // Tạo HMAC-SHA256
const moment = require('moment'); // Xử lý thời gian

// APP INFO
const config = {
    app_id: "2554", // Thay bằng app_id của bạn
    key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn", // Thay bằng key1
    key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf", // Thay bằng key2
    endpoint: "https://sb-openapi.zalopay.vn/v2/create", // Endpoint API
};

// Hàm tạo giao dịch thanh toán
const createOrder = async (amount, description, bankCode = "zalopayapp") => {
    try {
        const embed_data = {
            // redirecturl : ''
        };
        const items = [{}];
        const transID = Math.floor(Math.random() * 1000000);

        const order = {
            app_id: config.app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
            app_user: "user123",
            app_time: Date.now(), // miliseconds
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: 50000,
            description: `Lazada - Payment for the order #${transID}`,
            bank_code: "zalopayapp",
        };
        

        // Tạo chữ ký (mac)
        const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        // Gửi request tới ZaloPay
        const response = await axios.post(config.endpoint, null, { params: order });
        return response.data; // Trả về kết quả
    } catch (error) {
        console.error("Error creating order:", error);
        throw new Error("Failed to create ZaloPay order.");
    }
};

module.exports = { createOrder };
