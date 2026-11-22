import { render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { storeTokens } from "@/lib/auth/token-storage";
import DashboardLayout from "./layout";

const replaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ replace: replaceMock, push: vi.fn() }),
}));

vi.mock("@/components/dashboard/sidebar", () => ({
  Sidebar: () => null,
}));

vi.mock("@/components/dashboard/topbar", () => ({
  Topbar: () => null,
}));

describe("DashboardLayout session guard", () => {
  beforeEach(() => {
    window.localStorage.clear();
    replaceMock.mockClear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("redirects to /login when there is no stored session", async () => {
    const { queryByText } = render(
      <DashboardLayout>
        <div>Protected content</div>
      </DashboardLayout>,
    );

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/login");
    });
    expect(queryByText("Protected content")).not.toBeInTheDocument();
  });

  it("renders children when a session is stored with an active household", async () => {
    storeTokens({ accessToken: "access-123", refreshToken: "refresh-456", householdId: "household-1" });

    const { findByText } = render(
      <DashboardLayout>
        <div>Protected content</div>
      </DashboardLayout>,
    );

    expect(await findByText("Protected content")).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("redirects to /select-household when the session has no active household", async () => {
    storeTokens({ accessToken: "access-123", refreshToken: "refresh-456", householdId: null });

    const { queryByText } = render(
      <DashboardLayout>
        <div>Protected content</div>
      </DashboardLayout>,
    );

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/select-household");
    });
    expect(queryByText("Protected content")).not.toBeInTheDocument();
  });
});
