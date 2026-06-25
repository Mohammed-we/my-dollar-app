import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error(
      "مفتاح Supabase السري غير موجود. أضف SUPABASE_SERVICE_ROLE_KEY أو SUPABASE_SECRET_KEY في .env.local"
    );
  }

  return createClient(url, key);
}
