"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/language-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/models/products";
import { Package, DollarSign } from "lucide-react";

interface ProductFormProps {
  initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const isEditing = !!initialData;

  const [sku, setSku] = useState(initialData?.sku ?? "SKU-");
  const [name, setName] = useState(initialData?.name ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "");
  const [stock, setStock] = useState(initialData?.stock?.toString() ?? "");
  const [unitCost, setUnitCost] = useState(
    initialData?.unit_cost?.toString() ?? "",
  );
  const [price, setPrice] = useState(initialData?.price?.toString() ?? "");
  const [weeklyDemand, setWeeklyDemand] = useState(
    initialData?.weekly_demand?.toString() ?? "",
  );
  const [expirationDate, setExpirationDate] = useState(
    initialData?.expiration_date ?? "",
  );
  const today = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const stockNum = Number(stock);
    const unitCostNum = Number(unitCost);
    const priceNum = Number(price);
    const weeklyDemandNum = Number(weeklyDemand);

    if (
      !sku ||
      !name ||
      !category ||
      !stock ||
      !unitCost ||
      !price ||
      !weeklyDemand ||
      !expirationDate
    ) {
      toast.error(t("productForm.errorRequiredFields"));
      return;
    }

    if (
      isNaN(stockNum) ||
      isNaN(unitCostNum) ||
      isNaN(priceNum) ||
      isNaN(weeklyDemandNum)
    ) {
      toast.error(t("productForm.errorInvalidNumbers"));
      return;
    }

    if (
      stockNum < 0 ||
      unitCostNum < 0 ||
      priceNum < 0 ||
      weeklyDemandNum < 0
    ) {
      toast.error(t("productForm.errorNegativeValues"));
      return;
    }

    if (new Date(expirationDate) < new Date(today)) {
      toast.error(t("productForm.errorPastDate"));
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (!isEditing) {
      const { data: existing } = await supabase
        .from("products")
        .select("sku")
        .eq("sku", sku)
        .maybeSingle();

      if (existing) {
        toast.error(t("productForm.errorDuplicateSku"));
        setLoading(false);
        return;
      }
    }

    const payload = {
      sku,
      name,
      category,
      stock: stockNum,
      unit_cost: unitCostNum,
      price: priceNum,
      weekly_demand: weeklyDemandNum,
      expiration_date: expirationDate || null,
    };

    const { error } = isEditing
      ? await supabase
          .from("products")
          .update(payload)
          .eq("sku", initialData!.sku)
      : await supabase.from("products").insert(payload);

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success(
      isEditing
        ? t("productForm.successUpdated")
        : t("productForm.successCreated"),
    );
    router.push("/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">
      <section>
        <div className="flex items-center gap-2 mb-5">
          <Package size={18} className="text-orange-500" />
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            {t("productForm.sectionGeneral")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Input
            id="sku"
            label={`${t("productForm.sku")} *`}
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            disabled={isEditing}
          />
          <Input
            id="name"
            label={`${t("productForm.name")} *`}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            id="category"
            label={`${t("productForm.category")} *`}
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Input
            id="expirationDate"
            label={`${t("productForm.expirationDate")} *`}
            type="date"
            value={expirationDate ?? ""}
            onChange={(e) => setExpirationDate(e.target.value)}
            min={today}
          />
        </div>
      </section>

      <div className="border-t border-slate-100" />

      <section>
        <div className="flex items-center gap-2 mb-5">
          <DollarSign size={18} className="text-orange-500" />
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
            {t("productForm.sectionInventory")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Input
            id="stock"
            label={`${t("productForm.stock")} *`}
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <Input
            id="weeklyDemand"
            label={`${t("productForm.weeklyDemand")} *`}
            type="number"
            value={weeklyDemand}
            onChange={(e) => setWeeklyDemand(e.target.value)}
          />
          <Input
            id="unitCost"
            label={`${t("productForm.unitCost")} *`}
            type="number"
            value={unitCost}
            onChange={(e) => setUnitCost(e.target.value)}
          />
          <Input
            id="price"
            label={`${t("productForm.price")} *`}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </section>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/products")}
        >
          {t("productForm.cancel")}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? t("productForm.saving")
            : isEditing
              ? t("productForm.saveChanges")
              : t("productForm.create")}
        </Button>
      </div>
    </form>
  );
}
