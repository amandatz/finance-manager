import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/auth/api-error";
import { deleteFinancialAccount, listFinancialAccounts } from "@/lib/accounts/accounts-client";
import type { FinancialAccount } from "@/types/accounts";
import { AccountsPanel } from "./accounts-panel";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
}));

vi.mock("@/lib/accounts/accounts-client", () => ({
  listFinancialAccounts: vi.fn(),
  deleteFinancialAccount: vi.fn(),
}));

const listMock = vi.mocked(listFinancialAccounts);
const deleteMock = vi.mocked(deleteFinancialAccount);

function account(overrides: Partial<FinancialAccount> = {}): FinancialAccount {
  return {
    id: "acc-1",
    name: "Main Checking",
    type: 1,
    institutionName: "Itaú",
    ownerUserIds: ["user-1"],
    isActive: true,
    createdAt: "2026-10-25T12:00:00Z",
    updatedAt: null,
    ...overrides,
  };
}

describe("AccountsPanel", () => {
  let confirmSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    pushMock.mockClear();
    listMock.mockReset();
    deleteMock.mockReset();
    confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  afterEach(() => {
    confirmSpy.mockRestore();
  });

  it("shows a loading skeleton while fetching accounts", () => {
    listMock.mockReturnValue(new Promise(() => {}));

    render(<AccountsPanel />);

    expect(screen.getByTestId("accounts-loading")).toBeInTheDocument();
  });

  it("lists accounts after a successful fetch (AC 11)", async () => {
    listMock.mockResolvedValueOnce([account()]);

    render(<AccountsPanel />);

    expect(await screen.findByText("Main Checking")).toBeInTheDocument();
    expect(screen.getByText("Itaú")).toBeInTheDocument();
    expect(screen.getByText("Bank")).toBeInTheDocument();
  });

  it("shows an empty state with a CTA when there are no accounts (AC 11)", async () => {
    listMock.mockResolvedValueOnce([]);

    render(<AccountsPanel />);

    expect(await screen.findByText("No accounts yet")).toBeInTheDocument();
    expect(
      screen.getByText("Add your first account to start tracking where your money lives."),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /add account/i }).length).toBeGreaterThan(0);
  });

  it("shows a retry-able error banner on network/server failure without crashing (AC 15)", async () => {
    listMock.mockRejectedValueOnce(new ApiError("Something went wrong. Please try again.", 0));

    render(<AccountsPanel />);

    expect(await screen.findByText(/couldn't load your accounts/i)).toBeInTheDocument();

    listMock.mockResolvedValueOnce([account()]);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /retry/i }));

    expect(await screen.findByText("Main Checking")).toBeInTheDocument();
  });

  it("navigates to the filtered transactions listing when View transactions is selected", async () => {
    listMock.mockResolvedValueOnce([account()]);
    const user = userEvent.setup();

    render(<AccountsPanel />);

    await screen.findByText("Main Checking");
    await user.click(screen.getByRole("button", { name: /actions for main checking/i }));
    await user.click(await screen.findByRole("menuitem", { name: /view transactions/i }));

    expect(pushMock).toHaveBeenCalledWith("/dashboard/transactions?accountId=acc-1");
  });

  it("navigates to the edit route when Edit is selected (AC 13)", async () => {
    listMock.mockResolvedValueOnce([account()]);
    const user = userEvent.setup();

    render(<AccountsPanel />);

    await screen.findByText("Main Checking");
    await user.click(screen.getByRole("button", { name: /actions for main checking/i }));
    await user.click(await screen.findByRole("menuitem", { name: /edit/i }));

    expect(pushMock).toHaveBeenCalledWith("/dashboard/accounts/acc-1/edit");
  });

  it("asks for confirmation and removes the account from the list on delete (AC 14)", async () => {
    listMock.mockResolvedValueOnce([account()]);
    deleteMock.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();

    render(<AccountsPanel />);

    await screen.findByText("Main Checking");
    await user.click(screen.getByRole("button", { name: /actions for main checking/i }));
    await user.click(await screen.findByRole("menuitem", { name: /delete/i }));

    expect(confirmSpy).toHaveBeenCalledWith('Delete "Main Checking"? This can\'t be undone.');
    await waitFor(() => {
      expect(screen.queryByText("Main Checking")).not.toBeInTheDocument();
    });
    expect(deleteMock).toHaveBeenCalledWith("acc-1");
  });

  it("does not delete when the confirmation is cancelled", async () => {
    confirmSpy.mockReturnValue(false);
    listMock.mockResolvedValueOnce([account()]);
    const user = userEvent.setup();

    render(<AccountsPanel />);

    await screen.findByText("Main Checking");
    await user.click(screen.getByRole("button", { name: /actions for main checking/i }));
    await user.click(await screen.findByRole("menuitem", { name: /delete/i }));

    expect(deleteMock).not.toHaveBeenCalled();
    expect(screen.getByText("Main Checking")).toBeInTheDocument();
  });

  it("shows a non-blocking alert when delete fails (e.g. 404 non-owner) (AC 15)", async () => {
    listMock.mockResolvedValueOnce([account()]);
    deleteMock.mockRejectedValueOnce(new ApiError("Not found.", 404));
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const user = userEvent.setup();

    render(<AccountsPanel />);

    await screen.findByText("Main Checking");
    await user.click(screen.getByRole("button", { name: /actions for main checking/i }));
    await user.click(await screen.findByRole("menuitem", { name: /delete/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("Something went wrong. Please try again.");
    });
    expect(screen.getByText("Main Checking")).toBeInTheDocument();
    alertSpy.mockRestore();
  });
});
