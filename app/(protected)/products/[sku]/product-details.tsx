"use client";

import {
  Product,
  getProductStatus,
  isExpiringSoon,
} from "@/lib/models/products";
import { StatusBadge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n/language-context";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Field } from "@/components/ui/field";

interface Props {
  product: Product;
}

export function ProductDetailClient({ product }: Props) {
  const { t } = useLanguage();

  // Computed status based on stock vs weekly demand
  const status = getProductStatus(product.stock, product.weekly_demand);

  const statusLabels = {
    critico: t("products.status.critico"),
    bajo: t("products.status.bajo"),
    saludable: t("products.status.saludable"),
    exceso: t("products.status.exceso"),
  };

  // Coverage in days: (stock / weekly_demand) * 7. Null when weekly_demand is 0.
  const coverageDays =
    product.weekly_demand === 0
      ? null
      : (product.stock / product.weekly_demand) * 7;

  // Whether the product expires within the next 90 days
  const expiringSoon = isExpiringSoon(product.expiration_date);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Back to product list */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft size={16} />
          {t("products.backToList")}
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {/* Header: product name, SKU, and status badge */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {product.name}
              </h1>
              <p className="text-slate-500 text-sm">{product.sku}</p>
            </div>
            <StatusBadge status={status} label={statusLabels[status]} />
          </div>

          {/* Expiration warning banner, only shown if expiring within 90 days */}
          {expiringSoon && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3 mb-6 text-sm">
              <AlertTriangle size={18} />
              {t("products.expiringSoonWarning")}
            </div>
          )}

          {/* Product data fields grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            <Field
              label={t("products.columns.category")}
              value={product.category}
            />
            <Field label={t("products.columns.stock")} value={product.stock} />
            <Field
              label={t("products.columns.unitCost")}
              value={`$${product.unit_cost.toFixed(2)}`}
            />
            <Field
              label={t("products.columns.price")}
              value={`$${product.price.toFixed(2)}`}
            />
            <Field
              label={t("products.columns.weeklyDemand")}
              value={product.weekly_demand}
            />
            <Field
              label={t("products.expirationDate")}
              value={product.expiration_date ?? "-"}
            />
            <Field
              label={t("products.coverage")}
              value={
                coverageDays === null
                  ? t("products.noApplicable")
                  : `${coverageDays.toFixed(1)} ${t("products.days")}`
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}