import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/product-form";
import { PageTitle } from "@/components/ui/page-title";

interface PageProps {
  params: Promise<{ sku: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
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

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <PageTitle i18nKey="productForm.editTitle" />
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <ProductForm initialData={product} />
        </div>
      </div>
    </div>
  );
}