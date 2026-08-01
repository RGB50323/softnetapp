import { createClient } from "@/lib/supabase/server";
import { Product } from "@/lib/models/products";
import { ProductsTable } from "./products-table";
import { ProductsTitle } from "./products-title";

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <p className="text-red-600">
          Error al cargar productos: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <ProductsTitle />
      <ProductsTable initialProducts={(products as Product[]) ?? []} />
    </div>
  );
}