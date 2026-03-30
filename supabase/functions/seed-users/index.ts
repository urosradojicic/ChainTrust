import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const testUsers = [
    { email: "admin@chainmetrics.io", password: "admin123", role: "admin" },
    { email: "investor@chainmetrics.io", password: "investor1", role: "investor" },
    { email: "startup@chainmetrics.io", password: "startup1", role: "startup" },
  ];

  const results = [];

  for (const u of testUsers) {
    // Create user via admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { display_name: u.email.split("@")[0] },
    });

    if (error) {
      results.push({ email: u.email, error: error.message });
      continue;
    }

    // Assign role
    const { error: roleError } = await supabase
      .from("user_roles")
      .insert({ user_id: data.user.id, role: u.role });

    results.push({
      email: u.email,
      userId: data.user.id,
      role: u.role,
      roleError: roleError?.message || null,
    });
  }

  return new Response(JSON.stringify({ results }, null, 2), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
