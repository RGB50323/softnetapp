import { createClient } from "@/lib/supabase/server";
import { Product } from "@/lib/models/products";
import { DashboardClient } from "./dashboard-client";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: products } = await supabase.from("products").select("*");

  return (
    <DashboardClient
      email={user?.email ?? ""}
      products={(products as Product[]) ?? []}
    />
  );
}