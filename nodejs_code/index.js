const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config(); // Load environment variables from .env file

const app = express();

app.use(express.json());
app.use(cors());

const port = 3000;
const host = "192.168.29.209";
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

const generateRazorpaySignature = (order_id, payment_id, secret) => {
  const signaturePayload = `${order_id}|${payment_id}`;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(signaturePayload);
  const generatedSignature = hmac.digest("hex");
  return generatedSignature;
};

const verifySignature = (payload, signature, secret) => {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const generatedSignature = hmac.digest('hex');
  console.log('gensign: ', generatedSignature);
  return generatedSignature === signature;
};

app.get("/", (req, res, next) => {
  res.status(200).send("razorpay test");
});

app.post("/order", async (req, res, next) => {
  try {
    const data = req.body;
    console.log(req.body);

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID, // Use process.env to access environment variables
      key_secret: razorpayKeySecret, // Use process.env to access environment variables
    });

    const options = {
      amount: data.amount,
      currency: data.currency,
    };

    instance.orders.create(options, (err, order) => {
      if (err) {
        console.error("Razorpay Error:", err);
        res.status(500).json({ error: err });
      } else {
        console.log("Razorpay Order:", order);
        res.status(200).send(order);
      }
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

// This route can be called when the payment is confirmed, and you have the payment_id
app.post("/confirm-payment", (req, res) => {
  try {
    const { order_id, payment_id } = req.body;

    // Generate the signature using both order_id and payment_id
    const generatedSignature = generateRazorpaySignature(
      order_id,
      payment_id,
      razorpayKeySecret
    );

    // Now, you can compare the generated signature with the one received
    const razorpay_signature = req.body.razorpay_signature;

    if (generatedSignature === razorpay_signature) {
      // Signature is valid, process the payment
      console.log("Payment successful!");
      res.status(200).send("Payment successful!");
    } else {
      // Invalid signature, reject the request
      console.log("Invalid signature. Payment failed.");
      res.status(400).send("Invalid signature. Payment failed.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to handle Razorpay webhook notifications
app.post('/razorpay-webhook', (req, res) => {
    const payload = JSON.stringify(req.body);
    const signature = req.get('x-razorpay-signature');
    console.log('sign: ', signature);
    // // Verify the signature for security
    // if (!verifySignature(payload, signature, razorpayKeySecret)) {
    //   console.error('Invalid Razorpay signature. Ignoring webhook.');
    //   return res.status(400).send('Invalid signature');
    // }

    // Process the webhook payload and update payment status in your system
    console.log('Webhook received:', req.body);

    res.status(200).send('Webhook received successfully');
});

// app.listen(port, host, () => {
//   console.log(`Server is running at ${port}`);
// });

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
