import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/auth/api-error";
import { deleteCreditCard, listCreditCards, listFinancialAccounts } from "@/lib/accounts/accounts-client";
import type { CreditCard, FinancialAccount } from "@/types/accounts";
import { CreditCardsPanel } from "./credit-cards-panel";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
}));

vi.mock("@/lib/accounts/accounts-client", () => ({
  listCreditCards: vi.fn(),
  listFinancialAccounts: vi.fn(),
  deleteCreditCard: vi.fn(),
}));

const listCardsMock = vi.mocked(listCreditCards);
const listAccountsMock = vi.mocked(listFinancialAccounts);
const deleteMock = vi.mocked(deleteCreditCard);

function card(overrides: Partial<CreditCard> = {}): CreditCard {
  return {
    id: "card-1",
    brand: "Visa",
    creditLimit: 5000,
    statementClosingDay: 10,
    paymentDueDay: 20,
    settlementAccountId: "acc-1",
    ownerUserIds: ["user-1"],
    isActive: true,
    createdAt: "2026-10-25T12:00:00Z",
    updatedAt: null,
    ...overrides,
  };
}

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

describe("CreditCardsPanel", () => {
  let confirmSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    pushMock.mockClear();
    listCardsMock.mockReset();
    listAccountsMock.mockReset();
    deleteMock.mockReset();
    confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  afterEach(() => {
    confirmSpy.mockRestore();
  });

  it("lists credit cards with brand, limit, billing cycle, and settlement account (AC 17)", async () => {
    listCardsMock.mockResolvedValueOnce([card()]);
    listAccountsMock.mockResolvedValueOnce([account()]);

    render(<CreditCardsPanel />);

    expect(await screen.findByText("Visa")).toBeInTheDocument();
    expect(screen.getByText("$5,000.00")).toBeInTheDocument();
    expect(screen.getByText("Closes 10 · Due 20")).toBeInTheDocument();
    expect(screen.getByText("Main Checking")).toBeInTheDocument();
  });

  it('shows "Credit card" when brand is null', async () => {
    listCardsMock.mockResolvedValueOnce([card({ brand: null })]);
    listAccountsMock.mockResolvedValueOnce([]);

    render(<CreditCardsPanel />);

    expect(await screen.findByText("Credit card")).toBeInTheDocument();
  });

  it("shows a dash when there is no settlement account (store card, AC 21)", async () => {
    listCardsMock.mockResolvedValueOnce([card({ settlementAccountId: null })]);
    listAccountsMock.mockResolvedValueOnce([account()]);

    render(<CreditCardsPanel />);

    await screen.findByText("Visa");
    const row = screen.getByText("Visa").closest("tr");
    expect(row).toHaveTextContent("—");
  });

  it("shows a dash when the settlement account is archived (dangling reference)", async () => {
    listCardsMock.mockResolvedValueOnce([card({ settlementAccountId: "archived-acc" })]);
    listAccountsMock.mockResolvedValueOnce([account()]);

    render(<CreditCardsPanel />);

    await screen.findByText("Visa");
    const row = screen.getByText("Visa").closest("tr");
    expect(row).toHaveTextContent("—");
  });

  it("shows an empty state with a CTA when there are no cards", async () => {
    listCardsMock.mockResolvedValueOnce([]);
    listAccountsMock.mockResolvedValueOnce([]);

    render(<CreditCardsPanel />);

    expect(await screen.findByText("No credit cards yet")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /add credit card/i }).length).toBeGreaterThan(0);
  });

  it("shows a retry-able error banner on fetch failure", async () => {
    listCardsMock.mockRejectedValueOnce(new ApiError("Something went wrong.", 0));
    listAccountsMock.mockResolvedValueOnce([]);

    render(<CreditCardsPanel />);

    expect(await screen.findByText(/couldn't load your credit cards/i)).toBeInTheDocument();

    listCardsMock.mockResolvedValueOnce([card()]);
    listAccountsMock.mockResolvedValueOnce([account()]);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /retry/i }));

    expect(await screen.findByText("Visa")).toBeInTheDocument();
  });

  it("navigates to the card edit route when Edit is selected (AC 19)", async () => {
    listCardsMock.mockResolvedValueOnce([card()]);
    listAccountsMock.mockResolvedValueOnce([account()]);
    const user = userEvent.setup();

    render(<CreditCardsPanel />);

    await screen.findByText("Visa");
    await user.click(screen.getByRole("button", { name: /actions for visa/i }));
    await user.click(await screen.findByRole("menuitem", { name: /edit/i }));

    expect(pushMock).toHaveBeenCalledWith("/dashboard/accounts/cards/card-1/edit");
  });

  it("asks for confirmation and removes the card from the list on delete (AC 20)", async () => {
    listCardsMock.mockResolvedValueOnce([card()]);
    listAccountsMock.mockResolvedValueOnce([account()]);
    deleteMock.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();

    render(<CreditCardsPanel />);

    await screen.findByText("Visa");
    await user.click(screen.getByRole("button", { name: /actions for visa/i }));
    await user.click(await screen.findByRole("menuitem", { name: /delete/i }));

    expect(confirmSpy).toHaveBeenCalledWith("Delete this credit card? This can't be undone.");
    await waitFor(() => {
      expect(screen.queryByText("Visa")).not.toBeInTheDocument();
    });
    expect(deleteMock).toHaveBeenCalledWith("card-1");
  });
});
