import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import { createHmac } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Razorpay-Signature",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
    const signature = req.headers.get("X-Razorpay-Signature");

    if (!webhookSecret) {
      return new Response(
        JSON.stringify({ error: "Webhook not configured" }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body = await req.text();

    if (signature) {
      const expectedSignature = createHmac("sha256", webhookSecret)
        .update(body)
        .digest("hex");

      if (expectedSignature !== signature) {
        return new Response(
          JSON.stringify({ error: "Invalid webhook signature" }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      const userId = payment.notes?.userId;

      if (!userId) {
        return new Response(
          JSON.stringify({ error: "No user ID in payment notes" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ is_premium: true })
        .eq("id", userId);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: "Failed to update user premium status" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "Premium activated" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: "Event received but not processed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal error", details: err.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
