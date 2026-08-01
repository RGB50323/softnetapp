/**
 * Posibles valores de estado
 */
export type ProductStatus = "critico" | "bajo" | "saludable" | "exceso";

/**
 * Modelo del producto acorde al asignado
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
 * Calcula el estado del producto mediante las variables de stock y demanda semanal
 * @param stock cantidad de producto
 * @param weeklyDemand demanda semanal del producto
 * @returns el valor del estado
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
 * Labels de cada posible estado que puede adquirir un producto
 */
export const STATUS_LABELS: Record<ProductStatus, string> = {
  critico: "Crítico",
  bajo: "Bajo",
  saludable: "Saludable",
  exceso: "Exceso",
};

/**
 * Colores asignados en forma de badge a cada estado
 */
export const STATUS_COLORS: Record<ProductStatus, string> = {
  critico: "bg-red-100 text-red-700 border border-red-300",
  bajo: "bg-orange-100 text-orange-700 border border-orange-300",
  saludable: "bg-green-100 text-green-700 border border-green-300",
  exceso: "bg-blue-100 text-blue-700 border border-blue-300",
};

/**
 * Calcula la cobertura en días: (stock / weekly_demand) * 7.
 * Si weekly_demand es 0, retorna null (cobertura indefinida/infinita).
 */
export function getCoverageDays(
  stock: number,
  weeklyDemand: number
): number | null {
  if (weeklyDemand === 0) return null;
  return (stock / weeklyDemand) * 7;
}

/**
 * Verifica si un producto está próximo a vencer (30 días).
 */
export function isExpiringSoon(expirationDate: string | null): boolean {
  if (!expirationDate) return false;
  const today = new Date();
  const expDate = new Date(expirationDate);
  const diffDays = (expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays < 90;
}