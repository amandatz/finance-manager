import { describe, expect, it } from "vitest";
import {
  formatHouseholdCurrency,
  formatSignedHouseholdCurrency,
  formatSharePercent,
  formatSignedSharePercent,
  readDeviation,
  shiftPeriod,
} from "./format";

describe("formatHouseholdCurrency", () => {
  it("formats an amount as BRL", () => {
    expect(formatHouseholdCurrency(5200)).toMatch(/R\$\s?5\.200,00/);
  });
});

describe("formatSignedHouseholdCurrency", () => {
  it("prefixes positive amounts with a plus sign", () => {
    expect(formatSignedHouseholdCurrency(42)).toMatch(/^\+R\$\s?42,00$/);
  });

  it("prefixes negative amounts with a minus sign and formats the absolute value", () => {
    expect(formatSignedHouseholdCurrency(-42)).toMatch(/^-R\$\s?42,00$/);
  });

  it("treats zero as positive", () => {
    expect(formatSignedHouseholdCurrency(0)).toMatch(/^\+R\$\s?0,00$/);
  });
});

describe("formatSharePercent", () => {
  it("rounds a fractional share to the nearest percent", () => {
    expect(formatSharePercent(0.634)).toBe("63%");
  });
});

describe("formatSignedSharePercent", () => {
  it("prefixes a positive share with a plus sign", () => {
    expect(formatSignedSharePercent(0.03)).toBe("+3%");
  });

  it("keeps the minus sign for a negative share", () => {
    expect(formatSignedSharePercent(-0.08)).toBe("-8%");
  });

  it("treats zero as positive", () => {
    expect(formatSignedSharePercent(0)).toBe("+0%");
  });
});

describe("shiftPeriod", () => {
  it("moves forward within the same year", () => {
    expect(shiftPeriod("2026-03", 1)).toBe("2026-04");
  });

  it("moves backward within the same year", () => {
    expect(shiftPeriod("2026-03", -1)).toBe("2026-02");
  });

  it("rolls over into the next year", () => {
    expect(shiftPeriod("2026-12", 1)).toBe("2027-01");
  });

  it("rolls back into the previous year", () => {
    expect(shiftPeriod("2026-01", -1)).toBe("2025-12");
  });
});

describe("readDeviation", () => {
  it("reads as on-target within the ±5pp threshold", () => {
    expect(readDeviation(0.03)).toBe("on-target");
    expect(readDeviation(-0.03)).toBe("on-target");
    expect(readDeviation(0)).toBe("on-target");
  });

  it("reads as above beyond the +5pp threshold", () => {
    expect(readDeviation(0.08)).toBe("above");
  });

  it("reads as below beyond the -5pp threshold", () => {
    expect(readDeviation(-0.08)).toBe("below");
  });
});
