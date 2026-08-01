"use client";

import { useMemo } from "react";
import { useLanguage } from "@/lib/i18n/language-context";
import { Product, isExpiringSoon } from "@/lib/models/products";
import { Package, DollarSign, AlertTriangle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { KpiCard } from "@/components/ui/kpiCard";

interface Props {
  email: string;
  products: Product[];
}

export function DashboardClient({ email, products }: Props) {
  const { t } = useLanguage();

  // Total number of active SKUs (row count)
  const totalSkus = products.length;

  // Total inventory value: sum of (stock * unit_cost) across all products
  const totalInventoryValue = useMemo(
    () => products.reduce((sum, p) => sum + p.stock * p.unit_cost, 0),
    [products],
  );

  // Count of products expiring within the next 90 days
  const expiringSoonCount = useMemo(
    () => products.filter((p) => isExpiringSoon(p.expiration_date)).length,
    [products],
  );

  // Chart data: inventory value grouped by category
  const inventoryByCategory = useMemo(() => {
    const grouped: Record<string, number> = {};
    products.forEach((p) => {
      const value = p.stock * p.unit_cost;
      grouped[p.category] = (grouped[p.category] ?? 0) + value;
    });
    return Object.entries(grouped).map(([category, value]) => ({
      category,
      value: Number(value.toFixed(2)),
    }));
  }, [products]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {t("dashboard.welcome")}, {email}
            </h1>
          </div>
        </div>

        {/* KPI cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <KpiCard
            icon={<Package size={20} />}
            label={t("dashboard.totalSkus")}
            value={totalSkus.toString()}
            accentColor="orange"
          />
          <KpiCard
            icon={<DollarSign size={20} />}
            label={t("dashboard.totalInventoryValue")}
            value={`$${totalInventoryValue.toFixed(2)}`}
            accentColor="green"
          />
          <KpiCard
            icon={<AlertTriangle size={20} />}
            label={t("dashboard.expiringSoon")}
            value={expiringSoonCount.toString()}
            accentColor="red"
          />
        </div>

        {/* Inventory value by category chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-6">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
            {t("dashboard.chartTitle")}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inventoryByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                labelStyle={{ color: "#0f172a", fontWeight: 600 }}
                formatter={(value) => [
                  `$${Number(value).toFixed(2)}`,
                  t("dashboard.totalInventoryValue"),
                ]}
              />
              <Bar dataKey="value" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
