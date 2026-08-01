"use client";

import { useState, useMemo } from "react";
import {
  Product,
  getProductStatus,
  ProductStatus,
} from "../../../lib/models/products";
import { SearchBar } from "@/components/ui/searchBar";
import { Dropdown } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-context";
import { StatusBadge } from "@/components/ui/badge";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProductsTableProps {
  initialProducts: Product[];
}

export function ProductsTable({ initialProducts }: ProductsTableProps) {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">(
    "all",
  );
  const router = useRouter();
  const [skuToDelete, setSkuToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Translated labels for each status, used both in the dropdown options and the table badges
  const statusLabels: Record<ProductStatus, string> = {
    critico: t("products.status.critico"),
    bajo: t("products.status.bajo"),
    saludable: t("products.status.saludable"),
    exceso: t("products.status.exceso"),
  };

  // Unique list of categories derived from the data, used to populate the category dropdown
  const categories = useMemo(() => {
    const unique = new Set(initialProducts.map((p) => p.category));
    return Array.from(unique).sort();
  }, [initialProducts]);

  // Client-side filtering: search text (name/SKU) + category + computed status.
  // All filtering happens in memory since the full product list is already loaded.
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      const status = getProductStatus(product.stock, product.weekly_demand);
      const matchesStatus = statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [initialProducts, search, categoryFilter, statusFilter]);

  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // Total number of pages based on the FILTERED results, not the full list
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // Slice of filteredProducts corresponding to the current page only
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  const hasActiveFilters =
    search !== "" || categoryFilter !== "all" || statusFilter !== "all";

  const handleClearFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!skuToDelete) return;
    setDeleting(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("sku", skuToDelete);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t("products.deleteSuccess"));
      router.refresh();
    }

    setDeleting(false);
    setSkuToDelete(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setCurrentPage(1);
            }}
            placeholder={t("products.searchPlaceholder")}
          />

          <Dropdown
            label={
              categoryFilter === "all"
                ? t("products.filterCategory")
                : categoryFilter
            }
            active={categoryFilter !== "all"}
            value={categoryFilter}
            onChange={(value) => {
              setCategoryFilter(value);
              setCurrentPage(1);
            }}
            options={[
              { value: "all", label: t("products.allCategories") },
              ...categories.map((c) => ({ value: c, label: c })),
            ]}
          />

          <Dropdown
            label={
              statusFilter === "all"
                ? t("products.filterStatus")
                : statusLabels[statusFilter as ProductStatus]
            }
            active={statusFilter !== "all"}
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value as ProductStatus | "all");
              setCurrentPage(1);
            }}
            options={[
              { value: "all", label: t("products.allStatuses") },
              {
                value: "critico",
                label: statusLabels.critico,
                dot: "bg-red-500",
              },
              { value: "bajo", label: statusLabels.bajo, dot: "bg-orange-500" },
              {
                value: "saludable",
                label: statusLabels.saludable,
                dot: "bg-green-500",
              },
              {
                value: "exceso",
                label: statusLabels.exceso,
                dot: "bg-blue-500",
              },
            ]}
          />
        </div>

        <Button
          type="button"
          variant="secondary"
          disabled={!hasActiveFilters}
          onClick={handleClearFilters}
          className="text-sm py-2.5"
        >
          {t("products.clearFilters")}
        </Button>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-700">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">
                {t("products.columns.sku")}
              </th>
              <th className="text-left px-4 py-3 font-semibold">
                {t("products.columns.name")}
              </th>
              <th className="text-left px-4 py-3 font-semibold">
                {t("products.columns.category")}
              </th>
              <th className="text-right px-4 py-3 font-semibold">
                {t("products.columns.stock")}
              </th>
              <th className="text-right px-4 py-3 font-semibold">
                {t("products.columns.unitCost")}
              </th>
              <th className="text-right px-4 py-3 font-semibold">
                {t("products.columns.price")}
              </th>
              <th className="text-right px-4 py-3 font-semibold">
                {t("products.columns.weeklyDemand")}
              </th>
              <th className="text-left px-4 py-3 font-semibold">
                {t("products.columns.status")}
              </th>
              <th className="text-center px-4 py-3 font-semibold">
                {t("products.columns.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center px-4 py-6 text-slate-500"
                >
                  {t("products.noResults")}
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => {
                const status = getProductStatus(
                  product.stock,
                  product.weekly_demand,
                );
                return (
                  <tr
                    key={product.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium">{product.sku}</td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3 text-right">{product.stock}</td>
                    <td className="px-4 py-3 text-right">
                      ${product.unit_cost.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {product.weekly_demand}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={status}
                        label={statusLabels[status]}
                      />
                    </td>
                    <td className="px-4 py-3 text-center flex gap-2 justify-center">
                      <Link
                        href={`/products/${product.sku}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                        aria-label={t("products.viewDetail")}
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/products/${product.sku}/edit`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                        aria-label={t("products.editProduct")}
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setSkuToDelete(product.sku)}
                        className="cursor-pointer inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                        aria-label={t("products.deleteProduct")}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls, only shown when there's more than one page */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-slate-500">
            {t("pagination.page")} {currentPage} {t("pagination.of")}{" "}
            {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="text-sm py-2"
            >
              {t("pagination.previous")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="text-sm py-2"
            >
              {t("pagination.next")}
            </Button>
          </div>
        </div>
      )}
      <Modal
        open={skuToDelete !== null}
        title={t("products.deleteProduct")}
        description={t("products.confirmDelete")}
        confirmLabel={t("products.deleteConfirmButton")}
        cancelLabel={t("productForm.cancel")}
        onConfirm={handleConfirmDelete}
        onCancel={() => setSkuToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
