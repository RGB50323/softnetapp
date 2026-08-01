import { describe, it, expect } from "vitest";
import { getProductStatus, getCoverageDays } from "./products";

describe("getProductStatus", () => {
  it("returns 'critico' when stock is below weekly demand", () => {
    expect(getProductStatus(5, 10)).toBe("critico");
  });

  it("returns 'bajo' when stock is between 1x and 2x weekly demand", () => {
    expect(getProductStatus(15, 10)).toBe("bajo");
  });

  it("returns 'saludable' when stock is between 2x and 4x weekly demand", () => {
    expect(getProductStatus(25, 10)).toBe("saludable");
  });

  it("returns 'exceso' when stock is 4x or more weekly demand", () => {
    expect(getProductStatus(40, 10)).toBe("exceso");
  });

  it("returns 'saludable' when weekly demand is 0 (edge case)", () => {
    expect(getProductStatus(0, 0)).toBe("saludable");
    expect(getProductStatus(100, 0)).toBe("saludable");
  });
});

describe("getCoverageDays", () => {
  it("calculates coverage correctly", () => {
    expect(getCoverageDays(60, 30)).toBe(14);
  });

  it("returns null when weekly demand is 0", () => {
    expect(getCoverageDays(50, 0)).toBeNull();
  });
});