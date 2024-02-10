import type { APIRoute } from "astro";
import { supabase } from "../../lib/supabase";

export const GET: APIRoute = async ({cookies}) => {
  
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  // Check for tokens
  if (!accessToken || !refreshToken) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized",
      }),
      { status: 401 },
    );
  }

  // Verify the tokens
  const { error: AuthError } = await supabase.auth.setSession({
    access_token: accessToken.value,
    refresh_token: refreshToken.value,
  })

  if (AuthError) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized"
      }),
      { status: 401 },
    );
  }
  
  const { data, error } = await supabase
    .from("guestbook")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { status: 500 },
    );
  }

  return new Response(JSON.stringify(data));
};

export const POST: APIRoute = async ({ request, cookies }) => {

  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");

  // Check for tokens
  if (!accessToken || !refreshToken) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized",
      }),
      { status: 401 },
    );
  }

  // Verify the tokens
  const { error: AuthError } = await supabase.auth.setSession({
    access_token: accessToken.value,
    refresh_token: refreshToken.value,
  })

  if (AuthError) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized"
      }),
      { status: 401 },
    );
  }
  
  const { name, message } = await request.json();
  const { data, error } = await supabase
    .from("guestbook")
    .insert({ name, message })
    .select();

  if (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { status: 500 },
    );
  }

  return new Response(JSON.stringify(data));
};
