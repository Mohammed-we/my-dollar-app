import { createClient } from '@supabase/supabase-js';

// هكذا يقرأ المشروع المفاتيح من ملف .env.local تلقائياً
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);