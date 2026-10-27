// Supabase Edge Function: duitku-create-invoice
// Deno runtime + Web Crypto API

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Generate HMAC-SHA256 hex string using Web Crypto API
async function generateHmacSha256(key: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const merchantCode = Deno.env.get("DUITKU_MERCHANT_CODE") || "DS19356";
    const apiKey = Deno.env.get("DUITKU_API_KEY") || "e959ecbf0e7e1f57da8fc635b719463c";
    const environment = Deno.env.get("DUITKU_ENV") || "sandbox";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();

    const {
      merchantOrderId,
      amount,
      productDetails,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingFee = 0,
      discountAmount = 0,
      notes = "",
      items = [],
      callbackUrl,
      returnUrl,
    } = body;

    if (!merchantOrderId || !amount || !customerName || !customerPhone) {
      return new Response(
        JSON.stringify({ error: "Data pesanan tidak lengkap (merchantOrderId, amount, customerName, customerPhone wajib diisi)." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const timestamp = Date.now().toString();
    // Official Duitku POP signature formula: dataToSign = merchantCode + timestamp
    const dataToSign = `${merchantCode}${timestamp}`;
    const signature = await generateHmacSha256(apiKey, dataToSign);

    const duitkuUrl = environment === "production"
      ? "https://api-prod.duitku.com/api/merchant/createInvoice"
      : "https://api-sandbox.duitku.com/api/merchant/createInvoice";

    const payload = {
      paymentAmount: Math.round(Number(amount)),
      merchantOrderId: merchantOrderId,
      productDetails: productDetails || "Pesanan Busana Asri Collection",
      email: customerEmail || "guest@asricollection.id",
      phoneNumber: customerPhone,
      additionalParam: "",
      merchantUserInfo: customerName,
      customerVaName: customerName,
      callbackUrl: callbackUrl || `${supabaseUrl}/functions/v1/duitku-callback`,
      returnUrl: returnUrl || "https://asricollection.id/orders",
      expiryPeriod: 1440, // 24 jam
      itemDetails: items.map((item: any) => ({
        name: item.title,
        price: Math.round(Number(item.price)),
        quantity: item.quantity,
      })),
    };

    let duitkuResponseData: any = null;
    let paymentUrl = "";
    let reference = "";
    let vaNumber = "";
    let qrString = "";

    try {
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

      const rawText = await response.text();
      try {
        duitkuResponseData = JSON.parse(rawText);
      } catch {
        console.warn("Duitku returned non-JSON response:", rawText);
        duitkuResponseData = { statusCode: response.status.toString(), statusMessage: rawText };
      }

      if (duitkuResponseData && duitkuResponseData.statusCode === "00") {
        paymentUrl = duitkuResponseData.paymentUrl || "";
        reference = duitkuResponseData.reference || "";
        vaNumber = duitkuResponseData.vaNumber || "";
        qrString = duitkuResponseData.qrString || "";
      }
    } catch (err: any) {
      console.warn("Duitku API fetch failed or offline mode:", err.message);
    }

    // Catat ke tabel database Supabase jika configured
    if (supabaseUrl && supabaseServiceKey) {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          merchant_order_id: merchantOrderId,
          reference: reference || null,
          amount: Number(amount) - Number(shippingFee) + Number(discountAmount),
          shipping_fee: Number(shippingFee),
          discount_amount: Number(discountAmount),
          total_amount: Number(amount),
          product_details: productDetails,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          shipping_address: shippingAddress,
          notes: notes,
          status: "PENDING",
          payment_url: paymentUrl,
          va_number: vaNumber,
          qr_string: qrString,
        })
        .select()
        .single();

      if (orderData && items.length > 0) {
        const orderItems = items.map((item: any) => ({
          order_id: orderData.id,
          product_id: item.productId || null,
          title: item.title,
          price: Number(item.price),
          quantity: item.quantity,
          variant: item.variant || "",
          thumbnail: item.thumbnail || "",
          subtotal: Number(item.price) * item.quantity,
        }));
        await supabase.from("order_items").insert(orderItems);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        merchantOrderId,
        reference,
        paymentUrl,
        vaNumber,
        qrString,
        rawResponse: duitkuResponseData,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Gagal memproses pembuatan invoice Duitku POP." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
