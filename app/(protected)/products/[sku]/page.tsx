import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./product-details";

interface PageProps {
  params: Promise<{ sku: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { sku } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("sku", sku)
    .single();

  if (error || !product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}