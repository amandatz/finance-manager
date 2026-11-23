import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getHouseholdExpenseSplit } from "@/lib/households/households-client";
import type { HouseholdExpenseSplitReport } from "@/types/households";
import { HouseholdSplitPanel } from "./household-split-panel";

vi.mock("@/lib/households/households-client", () => ({
  getHouseholdExpenseSplit: vi.fn(),
}));

vi.mock("@/lib/households/format", async () => {
  const actual = await vi.importActual<typeof import("@/lib/households/format")>("@/lib/households/format");
  return { ...actual, currentPeriod: () => "2026-11" };
});

const getHouseholdExpenseSplitMock = vi.mocked(getHouseholdExpenseSplit);

function report(overrides: Partial<HouseholdExpenseSplitReport> = {}): HouseholdExpenseSplitReport {
  return {
    year: 2026,
    month: 11,
    rule: 0,
    hasSufficientIncomeData: true,
    totalIncome: 8200,
    totalHouseholdExpense: 3400,
    members: [
      {
        userId: "user-1",
        name: "Amanda",
        income: 5200,
        incomeShare: 0.63,
        householdExpense: 2100,
        householdExpenseShare: 0.62,
        expectedHouseholdExpense: 2142,
        deviation: -42,
        deviationShare: -0.01,
        hasIncompleteData: false,
      },
      {
        userId: "user-2",
        name: "Parceiro",
        income: 3000,
        incomeShare: 0.37,
        householdExpense: 1300,
        householdExpenseShare: 0.38,
        expectedHouseholdExpense: 1258,
        deviation: 42,
        deviationShare: 0.03,
        hasIncompleteData: false,
      },
    ],
    ...overrides,
  };
}

describe("HouseholdSplitPanel", () => {
  beforeEach(() => {
    getHouseholdExpenseSplitMock.mockReset();
  });

  it("shows a loading skeleton while fetching", () => {
    getHouseholdExpenseSplitMock.mockReturnValue(new Promise(() => {}));

    render(<HouseholdSplitPanel />);

    expect(screen.getByTestId("household-split-loading")).toBeInTheDocument();
  });

  it("renders a card per member with income, expenses, expected and deviation after a successful fetch", async () => {
    getHouseholdExpenseSplitMock.mockResolvedValueOnce(report());

    render(<HouseholdSplitPanel />);

    expect(await screen.findByText("Amanda")).toBeInTheDocument();
    expect(screen.getByText("Parceiro")).toBeInTheDocument();
    expect(screen.getByText("Household income")).toBeInTheDocument();
    expect(screen.getAllByText("Household expenses").length).toBeGreaterThan(0);
    expect(screen.getByText("November 2026")).toBeInTheDocument();
  });

  it("shows the empty state when no one has recorded income for the period", async () => {
    getHouseholdExpenseSplitMock.mockResolvedValueOnce(
      report({ hasSufficientIncomeData: false, totalIncome: 0, members: [] }),
    );

    render(<HouseholdSplitPanel />);

    expect(await screen.findByText("No income recorded yet")).toBeInTheDocument();
  });

  it("marks a member's card as incomplete and shows 'No data' instead of a silent zero", async () => {
    getHouseholdExpenseSplitMock.mockResolvedValueOnce(
      report({
        members: [
          {
            userId: "user-1",
            name: "Amanda",
            income: 5200,
            incomeShare: 1,
            householdExpense: null,
            householdExpenseShare: null,
            expectedHouseholdExpense: null,
            deviation: null,
            deviationShare: null,
            hasIncompleteData: true,
          },
        ],
      }),
    );

    render(<HouseholdSplitPanel />);

    expect(await screen.findByText("Incomplete data")).toBeInTheDocument();
    expect(screen.getAllByText("No data").length).toBeGreaterThan(0);
  });

  it("shows the invite notice for a household with a single member", async () => {
    getHouseholdExpenseSplitMock.mockResolvedValueOnce(
      report({
        totalIncome: 5200,
        totalHouseholdExpense: 2100,
        members: [
          {
            userId: "user-1",
            name: "Amanda",
            income: 5200,
            incomeShare: 1,
            householdExpense: 2100,
            householdExpenseShare: 1,
            expectedHouseholdExpense: 2100,
            deviation: 0,
            deviationShare: 0,
            hasIncompleteData: false,
          },
        ],
      }),
    );

    render(<HouseholdSplitPanel />);

    expect(await screen.findByText(/invite other people in your household/i)).toBeInTheDocument();
  });

  it("shows a retry-able error banner when the request fails", async () => {
    getHouseholdExpenseSplitMock.mockRejectedValueOnce(new Error("network error"));

    render(<HouseholdSplitPanel />);

    expect(await screen.findByText(/couldn't load the household comparison/i)).toBeInTheDocument();

    getHouseholdExpenseSplitMock.mockResolvedValueOnce(report());
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /retry/i }));

    expect(await screen.findByText("Amanda")).toBeInTheDocument();
  });

  it("navigates to the previous and next month and refetches", async () => {
    getHouseholdExpenseSplitMock.mockResolvedValueOnce(report());
    const user = userEvent.setup();

    render(<HouseholdSplitPanel />);
    await screen.findByText("Amanda");

    getHouseholdExpenseSplitMock.mockResolvedValueOnce(report({ month: 10, year: 2026 }));
    await user.click(screen.getByRole("button", { name: /previous month/i }));

    expect(await screen.findByText("October 2026")).toBeInTheDocument();
    expect(getHouseholdExpenseSplitMock).toHaveBeenLastCalledWith("2026-10");

    getHouseholdExpenseSplitMock.mockResolvedValueOnce(report({ month: 11, year: 2026 }));
    await user.click(screen.getByRole("button", { name: /next month/i }));

    expect(await screen.findByText("November 2026")).toBeInTheDocument();
    expect(getHouseholdExpenseSplitMock).toHaveBeenLastCalledWith("2026-11");
  });
});
