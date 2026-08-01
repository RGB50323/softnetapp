/**
 * Possible status values
 */
export type ProductStatus = "critico" | "bajo" | "saludable" | "exceso";

/**
 * Product model matching the assigned schema
 */
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  unit_cost: number;
  price: number;
  weekly_demand: number;
  expiration_date: string | null;
}

/**
 * Calculates the product's status based on stock and weekly demand
 * @param stock current stock quantity
 * @param weeklyDemand estimated weekly demand
 * @returns the resulting status value
 */
export function getProductStatus(
  stock: number,
  weeklyDemand: number
): ProductStatus {
  if (weeklyDemand === 0) return "saludable";
  if (stock < weeklyDemand) return "critico";
  if (stock < 2 * weeklyDemand) return "bajo";
  if (stock < 4 * weeklyDemand) return "saludable";
  return "exceso";
}

/**
 * Display labels for each possible product status
 */
export const STATUS_LABELS: Record<ProductStatus, string> = {
  critico: "Crítico",
  bajo: "Bajo",
  saludable: "Saludable",
  exceso: "Exceso",
};

/**
 * Badge colors assigned to each status
 */
export const STATUS_COLORS: Record<ProductStatus, string> = {
  critico: "bg-red-100 text-red-700 border border-red-300",
  bajo: "bg-orange-100 text-orange-700 border border-orange-300",
  saludable: "bg-green-100 text-green-700 border border-green-300",
  exceso: "bg-blue-100 text-blue-700 border border-blue-300",
};

/**
 * Calculates coverage in days: (stock / weekly_demand) * 7.
 * If weekly_demand is 0, returns null (undefined/infinite coverage).
 */
export function getCoverageDays(
  stock: number,
  weeklyDemand: number
): number | null {
  if (weeklyDemand === 0) return null;
  return (stock / weeklyDemand) * 7;
}

/**
 * Checks whether a product is close to expiring (90 days).
 */
export function isExpiringSoon(expirationDate: string | null): boolean {
  if (!expirationDate) return false;
  const today = new Date();
  const expDate = new Date(expirationDate);
  const diffDays = (expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays < 90;
}