import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CodeBlock } from "./code-block";

describe("CodeBlock", () => {
  it("renders the given code", () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(screen.getByText("const x = 1;")).toBeInTheDocument();
  });

  it("exposes an accessible copy button", () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(screen.getByRole("button", { name: /copy code/i })).toBeInTheDocument();
  });
});
