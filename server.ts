import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Status check if Duitku credentials are configured
app.get("/api/duitku/config-status", (_req, res) => {
  const merchantCode = process.env.DUITKU_MERCHANT_CODE || "";
  const apiKey = process.env.DUITKU_API_KEY || "";
  const isConfigured = Boolean(
    merchantCode &&
    apiKey &&
    !merchantCode.includes("YOUR_") &&
    !apiKey.includes("YOUR_")
  );

  res.json({
    configured: isConfigured,
    merchantCode: isConfigured ? merchantCode.slice(0, 3) + "***" : null,
    environment: process.env.DUITKU_ENV || "sandbox",
  });
});

// Endpoint: Create Invoice Duitku POP
app.post("/api/duitku/create-invoice", async (req, res) => {
  try {
    const merchantCode = req.body.merchantCode || process.env.DUITKU_MERCHANT_CODE;
    const apiKey = req.body.apiKey || process.env.DUITKU_API_KEY;
    const environment = process.env.DUITKU_ENV || "sandbox";

    const merchantOrderId = req.body.merchantOrderId || req.body.orderId;
    const amount = req.body.amount || req.body.paymentAmount;
    const productDetails = req.body.productDetails;
    const customerName = req.body.customerName || req.body.customerVaName || req.body.name;
    const customerEmail = req.body.customerEmail || req.body.email;
    const customerPhone = req.body.customerPhone || req.body.phoneNumber || req.body.phone;
    const returnUrl = req.body.returnUrl;
    const callbackUrl = req.body.callbackUrl;
    const items = req.body.items || [];

    if (!merchantOrderId || !amount) {
      return res.status(400).json({
        statusCode: "01",
        statusMessage: "Parameter merchantOrderId dan amount wajib disertakan.",
      });
    }

    // Jika merchantCode atau apiKey belum diisi di environment
    if (!merchantCode || !apiKey || merchantCode.includes("YOUR_") || apiKey.includes("YOUR_")) {
      return res.status(400).json({
        statusCode: "01",
        statusMessage:
          "DUITKU_MERCHANT_CODE dan DUITKU_API_KEY belum dikonfigurasi di server environment (.env). Diperlukan akun Sandbox/Production aktif dari Duitku untuk membuat invoice riil.",
        needsCredentials: true,
      });
    }

    const timestamp = Date.now().toString();
    // Official Duitku POP signature formula: stringToSign = merchantCode + timestamp
    const stringToSign = `${merchantCode}${timestamp}`;
    const signature = crypto.createHmac("sha256", apiKey).update(stringToSign).digest("hex");

    const duitkuUrl =
      environment === "production"
        ? "https://api-prod.duitku.com/api/merchant/createInvoice"
        : "https://api-sandbox.duitku.com/api/merchant/createInvoice";

    const hostUrl = process.env.APP_URL || `http://localhost:${PORT}`;

    const payload = {
      paymentAmount: Math.round(Number(amount)),
      merchantOrderId,
      productDetails: productDetails || "Pesanan Asri Collection",
      email: customerEmail || "customer@asricollection.id",
      phoneNumber: customerPhone || "081234567890",
      additionalParam: "",
      merchantUserInfo: customerName || "Customer",
      customerVaName: customerName || "Customer Asri Collection",
      callbackUrl: callbackUrl || `${hostUrl}/api/duitku/callback`,
      returnUrl: returnUrl || `${hostUrl}/orders?orderId=${merchantOrderId}`,
      expiryPeriod: 1440, // 24 jam dalam menit
      itemDetails: items.map((item: any) => ({
        name: item.title,
        price: Math.round(Number(item.price)),
        quantity: item.quantity,
      })),
    };

    const response = await fetch(duitkuUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-duitku-merchantcode": merchantCode,
        "x-duitku-timestamp": timestamp,
        "x-duitku-signature": signature,
      },
      body: JSON.stringify(payload),
    });

    const rawResponseText = await response.text();
    let responseData: any = null;

    try {
      responseData = JSON.parse(rawResponseText);
    } catch {
      return res.status(response.status || 401).json({
        success: false,
        statusCode: response.status.toString(),
        statusMessage: `Duitku Gateway menolak otentikasi (${rawResponseText || "Unauthorized"}). Pastikan Merchant Code (${merchantCode}) dan API Key sesuai dengan akun Sandbox Duitku Anda.`,
        raw: rawResponseText,
      });
    }

    if (responseData.statusCode === "00") {
      return res.json({
        success: true,
        merchantCode: responseData.merchantCode,
        reference: responseData.reference,
        paymentUrl: responseData.paymentUrl,
        vaNumber: responseData.vaNumber || "",
        qrString: responseData.qrString || "",
        statusCode: responseData.statusCode,
        statusMessage: responseData.statusMessage,
      });
    } else {
      return res.status(400).json({
        success: false,
        statusCode: responseData.statusCode || "01",
        statusMessage:
          responseData.statusMessage ||
          "Duitku menolak pembuatan invoice. Periksa kesesuaian Merchant Code dan API Key Sandbox Anda.",
        raw: responseData,
      });
    }
  } catch (error: any) {
    console.error("Error creating Duitku invoice:", error.message || error);
    return res.status(500).json({
      success: false,
      statusCode: "500",
      statusMessage: error.message || "Gagal menghubungi server Duitku.",
    });
  }
});

// Endpoint: Webhook Callback Duitku POP
app.post("/api/duitku/callback", (req, res) => {
  try {
    const merchantCode = process.env.DUITKU_MERCHANT_CODE || "";
    const apiKey = process.env.DUITKU_API_KEY || "";

    const {
      merchantCode: reqMerchantCode,
      amount,
      merchantOrderId,
      signature,
      resultCode,
      reference,
    } = req.body;

    if (!merchantOrderId || !amount) {
      return res.status(400).send("Bad Request");
    }

    // Hitung SHA256 signature sesuai dokumentasi Duitku POP
    const rawSha256 = `${reqMerchantCode || merchantCode}${merchantOrderId}${amount}`;
    const calculatedSha256 = crypto
      .createHmac("sha256", apiKey)
      .update(rawSha256)
      .digest("hex");

    // Hitung MD5 signature fallback
    const rawMd5 = `${reqMerchantCode || merchantCode}${amount}${merchantOrderId}${apiKey}`;
    const calculatedMd5 = crypto.createHash("md5").update(rawMd5).digest("hex");

    const isValid =
      !signature ||
      signature.toLowerCase() === calculatedSha256.toLowerCase() ||
      signature.toLowerCase() === calculatedMd5.toLowerCase();

    if (!isValid) {
      console.warn("Duitku callback signature invalid for order:", merchantOrderId);
      return res.status(400).send("Invalid Signature");
    }

    console.log(`[Duitku Webhook] Order ${merchantOrderId} result: ${resultCode} (Ref: ${reference})`);

    // Sesuai dokumentasi Duitku POP, response wajib HTTP 200 dengan body text: SUCCESS
    return res.status(200).send("SUCCESS");
  } catch (err: any) {
    console.error("Duitku webhook error:", err);
    return res.status(500).send("Internal Server Error");
  }
});

// Mount Vite middleware in dev or serve dist in production
async function startServer() {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Asri Collection Storefront running on http://0.0.0.0:${PORT}`);
  });
}

// Only start standalone HTTP server when not running in Vercel serverless
if (!process.env.VERCEL) {
  startServer();
}

export default app;
