import { ProductForm } from "@/components/product-form";

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Nuevo producto
        </h1>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <ProductForm />
        </div>
      </div>
    </div>
  );
}