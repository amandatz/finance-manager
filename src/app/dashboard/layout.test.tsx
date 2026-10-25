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

  it("renders children when a session is stored", async () => {
    storeTokens({ accessToken: "access-123", refreshToken: "refresh-456" });

    const { findByText } = render(
      <DashboardLayout>
        <div>Protected content</div>
      </DashboardLayout>,
    );

    expect(await findByText("Protected content")).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
