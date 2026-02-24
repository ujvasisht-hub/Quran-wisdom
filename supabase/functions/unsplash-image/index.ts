import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    let query = "serene nature landscape";
    let accessKey = Deno.env.get("UNSPLASH_ACCESS_KEY") ?? "";

    if (req.method === "POST") {
      try {
        const body = await req.json();
        if (body.searchTerm) {
          query = body.searchTerm;
        }
      } catch { /* use defaults */ }
    }

    if (!accessKey) {
      return new Response(
        JSON.stringify({ error: "Unsplash API key not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const page = (dayOfYear % 10) + 1;

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=portrait&per_page=1&page=${page}`;

    const response = await fetch(url, {
      headers: { Authorization: `Client-ID ${accessKey}` },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Unsplash API error" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const photo = data.results?.[0];

    if (!photo) {
      return new Response(
        JSON.stringify({ error: "No image found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = {
      url: photo.urls?.regular ?? photo.urls?.full,
      photographer: photo.user?.name ?? "Unknown",
      photographerUrl: photo.user?.links?.html
        ? `${photo.user.links.html}?utm_source=daily_quranic_wisdom&utm_medium=referral`
        : "https://unsplash.com",
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (_err) {
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
