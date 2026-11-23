import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { HouseholdExpenseSplitMember } from "@/types/households";
import { MemberSplitCard } from "./member-split-card";

function member(overrides: Partial<HouseholdExpenseSplitMember> = {}): HouseholdExpenseSplitMember {
  return {
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
    ...overrides,
  };
}

describe("MemberSplitCard", () => {
  it("renders income, household expenses, expected and deviation with a descriptive progress label", () => {
    render(<MemberSplitCard member={member()} />);

    expect(screen.getByText("Amanda")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?5\.200,00/)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?2\.100,00/)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?2\.142,00/)).toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: "Amanda's income, 63% of household total" })).toBeInTheDocument();
  });

  it("shows an 'On target' badge within the ±5pp threshold, never styled as destructive", () => {
    render(<MemberSplitCard member={member({ deviationShare: -0.01 })} />);
    expect(screen.getByText("On target")).toBeInTheDocument();
    expect(screen.getByText("On target")).not.toHaveClass("text-status-danger");
  });

  it("shows an 'Above expected' badge beyond the +5pp threshold, never styled as destructive", () => {
    render(<MemberSplitCard member={member({ deviation: 420, deviationShare: 0.08 })} />);
    expect(screen.getByText("Above expected")).toBeInTheDocument();
    expect(screen.getByText("Above expected")).not.toHaveClass("text-status-danger");
  });

  it("shows a 'Below expected' badge beyond the -5pp threshold, never styled as destructive", () => {
    render(<MemberSplitCard member={member({ deviation: -420, deviationShare: -0.08 })} />);
    expect(screen.getByText("Below expected")).toBeInTheDocument();
    expect(screen.getByText("Below expected")).not.toHaveClass("text-status-danger");
  });

  it("marks incomplete members with a badge and 'No data' instead of zero", () => {
    render(
      <MemberSplitCard
        member={member({
          income: null,
          incomeShare: null,
          householdExpense: null,
          householdExpenseShare: null,
          expectedHouseholdExpense: null,
          deviation: null,
          deviationShare: null,
          hasIncompleteData: true,
        })}
      />,
    );

    expect(screen.getByText("Incomplete data")).toBeInTheDocument();
    expect(screen.getAllByText("No data")).toHaveLength(4);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
