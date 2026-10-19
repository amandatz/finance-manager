import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ThemeModeToggle } from "./theme-mode-toggle";

function renderToggle() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeModeToggle />
    </ThemeProvider>,
  );
}

describe("ThemeModeToggle", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark", "light");
  });

  afterEach(() => {
    document.documentElement.classList.remove("dark", "light");
  });

  it("exposes a 3-option radiogroup with system selected by default", async () => {
    renderToggle();
    const group = screen.getByRole("radiogroup", { name: /color theme/i });
    expect(group).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("radio", { name: /system/i })).toHaveAttribute("aria-checked", "true");
    });
    expect(screen.getByRole("radio", { name: /light/i })).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("radio", { name: /dark/i })).toHaveAttribute("aria-checked", "false");
  });

  it("selects dark mode on click and persists the choice", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(screen.getByRole("radio", { name: /dark/i }));

    await waitFor(() => {
      expect(screen.getByRole("radio", { name: /dark/i })).toHaveAttribute("aria-checked", "true");
    });
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("moves selection with arrow keys (roving tabindex)", async () => {
    const user = userEvent.setup();
    renderToggle();

    const systemRadio = await screen.findByRole("radio", { name: /system/i });
    systemRadio.focus();

    await user.keyboard("{ArrowRight}");

    await waitFor(() => {
      expect(screen.getByRole("radio", { name: /light/i })).toHaveAttribute("aria-checked", "true");
    });
    expect(screen.getByRole("radio", { name: /light/i })).toHaveFocus();
  });
});
