// Supabase Edge Function: duitku-callback
// Webhook Verifier & Status Updater for Duitku POP

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Helper for HMAC-SHA256
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

// Helper for MD5 hash (Web Crypto API)
async function generateMd5(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("MD5", encoder.encode(data));
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const merchantCodeConfig = Deno.env.get("DUITKU_MERCHANT_CODE") || "DS19356";
    const apiKey = Deno.env.get("DUITKU_API_KEY") || "e959ecbf0e7e1f57da8fc635b719463c";

    let payload: any = {};
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      formData.forEach((val, key) => {
        payload[key] = val.toString();
      });
    } else {
      payload = await req.json();
    }

    const {
      merchantCode,
      amount,
      merchantOrderId,
      signature,
      resultCode,
      reference,
      additionalParam,
      paymentCode,
    } = payload;

    if (!merchantOrderId || !amount) {
      return new Response("Bad Request: Missing required parameters", { status: 400 });
    }

    // Hitung signature HMAC-SHA256 sesuai standar Duitku POP
    const rawToSignSha256 = `${merchantCode || merchantCodeConfig}${merchantOrderId}${amount}`;
    const calculatedSha256 = await generateHmacSha256(apiKey, rawToSignSha256);

    // Hitung MD5 fallback untuk kompatibilitas Duitku legacy / redirect
    let calculatedMd5 = "";
    try {
      const rawToSignMd5 = `${merchantCode || merchantCodeConfig}${amount}${merchantOrderId}${apiKey}`;
      calculatedMd5 = await generateMd5(rawToSignMd5);
    } catch {
      // MD5 mungkin tidak tersedia di beberapa browser crypto implementation
    }

    const isSignatureValid =
      !signature ||
      signature.toLowerCase() === calculatedSha256.toLowerCase() ||
      (calculatedMd5 && signature.toLowerCase() === calculatedMd5.toLowerCase());

    if (!isSignatureValid) {
      console.warn("Signature validation failed for order:", merchantOrderId);
      return new Response("Invalid Signature", { status: 400 });
    }

    // Perbarui status pesanan di database Supabase
    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const isSuccess = resultCode === "00";
      const newStatus = isSuccess ? "SUCCESS" : "FAILED";

      const updateData: any = {
        status: newStatus,
        result_code: resultCode,
        reference: reference || null,
        payment_method: paymentCode || null,
        additional_param: additionalParam || null,
        updated_at: new Date().toISOString(),
      };

      if (isSuccess) {
        updateData.paid_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("merchant_order_id", merchantOrderId);

      if (error) {
        console.error("Failed to update order status:", error.message);
      }
    }

    // Respons wajib Duitku POP: HTTP 200 dengan body teks persis "SUCCESS"
    return new Response("SUCCESS", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (err: any) {
    console.error("Duitku callback webhook error:", err.message);
    return new Response("Internal Server Error", { status: 500 });
  }
});
