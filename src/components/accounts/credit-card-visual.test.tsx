import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CreditCardVisual, CreditCardVisualSkeleton } from "./credit-card-visual";

describe("CreditCardVisual", () => {
  it("shows the brand, limit, and due day when provided", () => {
    render(
      <CreditCardVisual brand="Visa" creditLimit={5000} paymentDueDay={10} settlementAccountName="Main Checking" />,
    );

    expect(screen.getByText("Visa")).toBeInTheDocument();
    expect(screen.getByText("$5,000.00")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Settles to Main Checking")).toBeInTheDocument();
  });

  it('shows "Credit card" as a generic placeholder when brand is null', () => {
    render(<CreditCardVisual brand={null} creditLimit={800} paymentDueDay={5} settlementAccountName={null} />);

    expect(screen.getByText("Credit card")).toBeInTheDocument();
  });

  it('shows "No settlement account" neutrally when there is no settlement account', () => {
    render(<CreditCardVisual brand="Visa" creditLimit={5000} paymentDueDay={10} settlementAccountName={null} />);

    expect(screen.getByText("No settlement account")).toBeInTheDocument();
  });

  it("shows em dashes for missing limit/due day (empty form preview)", () => {
    render(<CreditCardVisual brand={null} creditLimit={null} paymentDueDay={null} settlementAccountName={null} />);

    expect(screen.getAllByText("—")).toHaveLength(2);
  });

  it("hides the masked card number from assistive tech", () => {
    render(<CreditCardVisual brand="Visa" creditLimit={5000} paymentDueDay={10} settlementAccountName={null} />);

    const maskedNumber = screen.getByText("•••• •••• •••• ••••");
    expect(maskedNumber).toHaveAttribute("aria-hidden", "true");
  });

  it("renders actions when provided", () => {
    render(
      <CreditCardVisual
        brand="Visa"
        creditLimit={5000}
        paymentDueDay={10}
        settlementAccountName={null}
        actions={<button aria-label="Actions for Visa">...</button>}
      />,
    );

    expect(screen.getByRole("button", { name: "Actions for Visa" })).toBeInTheDocument();
  });
});

describe("CreditCardVisualSkeleton", () => {
  it("renders a presentational skeleton", () => {
    render(<CreditCardVisualSkeleton />);

    const skeletons = document.querySelectorAll('[role="presentation"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
