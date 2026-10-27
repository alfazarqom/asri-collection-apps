import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
};

const SUCCESS_CACHE_CONTROL = "public, max-age=60, s-maxage=60";
const ERROR_CACHE_CONTROL = "no-store";

// Explicit allowlist from the audited public.products schema.
// Do not use select("*") on a public endpoint.
const PRODUCT_COLUMNS = [
  "id",
  "source_product_id",
  "title",
  "brand",
  "price",
  "sale_price",
  "currency",
  "description",
  "sku",
  "category",
  "availability",
  "stock_quantity",
  "colors",
  "sizes",
  "image_url",
  "additional_image_urls",
  "labels",
  "created_at",
  "updated_at",
].join(",");

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Cache-Control": status >= 200 && status < 300
        ? SUCCESS_CACHE_CONTROL
        : ERROR_CACHE_CONTROL,
    },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: {
        ...corsHeaders,
        "Cache-Control": ERROR_CACHE_CONTROL,
      },
    });
  }

  if (req.method !== "GET") {
    return jsonResponse(
      { error: "Method not allowed. Use GET." },
      405,
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing Supabase environment configuration.");
    return jsonResponse(
      { error: "Server configuration error." },
      500,
    );
  }

  const url = new URL(req.url);
  const rawLimit = url.searchParams.get("limit") ?? "100";
  const rawOffset = url.searchParams.get("offset") ?? "0";

  if (!/^\d+$/.test(rawLimit) || !/^\d+$/.test(rawOffset)) {
    return jsonResponse(
      { error: "limit and offset must be non-negative integers." },
      400,
    );
  }

  const requestedLimit = Number(rawLimit);
  const requestedOffset = Number(rawOffset);

  if (
    !Number.isSafeInteger(requestedLimit) ||
    requestedLimit < 1 ||
    requestedLimit > 100
  ) {
    return jsonResponse(
      { error: "limit must be an integer between 1 and 100." },
      400,
    );
  }

  if (
    !Number.isSafeInteger(requestedOffset) ||
    requestedOffset < 0
  ) {
    return jsonResponse(
      { error: "offset must be a non-negative safe integer." },
      400,
    );
  }

  const endOffset = requestedOffset + requestedLimit - 1;
  if (!Number.isSafeInteger(endOffset)) {
    return jsonResponse(
      { error: "offset and limit exceed the supported range." },
      400,
    );
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // "planned" uses the query planner's estimate instead of an exact
    // row count on every catalog request. The total is explicitly marked
    // as an estimate in the response contract.
    const { data, error, count } = await supabase
      .from("products")
      .select(PRODUCT_COLUMNS, { count: "planned" })
      .order("id", { ascending: true })
      .range(requestedOffset, endOffset);

    if (error) {
      console.error("get-products query failed:", error.message);
      return jsonResponse(
        { error: "Unable to fetch products." },
        500,
      );
    }

    const products = data ?? [];

    return jsonResponse({
      success: true,
      data: products,
      pagination: {
        limit: requestedLimit,
        offset: requestedOffset,
        total: count ?? null,
        totalIsEstimate: true,
        returned: products.length,
      },
    });
  } catch (error) {
    console.error("get-products unexpected error:", error);
    return jsonResponse(
      { error: "Internal server error." },
      500,
    );
  }
});
