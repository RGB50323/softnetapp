import { ProductForm } from "@/components/product-form";
import { PageTitle } from "@/components/ui/page-title";

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <PageTitle i18nKey="productForm.newTitle" />
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <ProductForm />
        </div>
      </div>
    </div>
  );
}