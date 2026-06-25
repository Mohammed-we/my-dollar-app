import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("currencies")
      .select("*")
      .order("id");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطأ غير متوقع";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, name, buy_price, sell_price } = body;

    if (!id || name == null || buy_price == null || sell_price == null) {
      return NextResponse.json(
        { error: "بيانات غير مكتملة" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("currencies")
      .update({
        name,
        buy_price: Number(buy_price),
        sell_price: Number(sell_price),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: "لم يتم العثور على العملة أو فشل التحديث" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطأ غير متوقع";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
