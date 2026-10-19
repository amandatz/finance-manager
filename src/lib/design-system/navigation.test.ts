import { describe, expect, it } from "vitest";
import { DS_NAV, findActiveNavItem } from "./navigation";

describe("findActiveNavItem", () => {
  it("finds the nav item matching the given pathname", () => {
    const first = DS_NAV[0].items[0];
    expect(findActiveNavItem(first.href)).toEqual(first);
  });

  it("returns undefined for an unknown pathname", () => {
    expect(findActiveNavItem("/design-system/does-not-exist")).toBeUndefined();
  });
});
