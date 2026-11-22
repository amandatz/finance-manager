import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { switchHousehold } from "@/lib/auth/auth-client";
import { getStoredTokens } from "@/lib/auth/token-storage";
import { createHousehold, listMyHouseholds } from "@/lib/households/households-client";
import type { HouseholdMembership } from "@/types/auth";
import SelectHouseholdPage from "./page";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
}));

vi.mock("@/lib/households/households-client", () => ({
  listMyHouseholds: vi.fn(),
  createHousehold: vi.fn(),
}));

vi.mock("@/lib/auth/auth-client", () => ({
  switchHousehold: vi.fn(),
}));

const listMock = vi.mocked(listMyHouseholds);
const createMock = vi.mocked(createHousehold);
const switchMock = vi.mocked(switchHousehold);

function membership(overrides: Partial<HouseholdMembership> = {}): HouseholdMembership {
  return {
    householdId: "household-1",
    householdName: "Família Silva",
    role: 1,
    ...overrides,
  };
}

describe("SelectHouseholdPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    pushMock.mockClear();
    listMock.mockReset();
    createMock.mockReset();
    switchMock.mockReset();
  });

  it("shows a loading skeleton while fetching households", () => {
    listMock.mockReturnValue(new Promise(() => {}));

    render(<SelectHouseholdPage />);

    expect(screen.getByTestId("households-loading")).toBeInTheDocument();
  });

  it("lists households with a role badge after a successful fetch", async () => {
    listMock.mockResolvedValueOnce([
      membership({ householdId: "household-1", householdName: "Família Silva", role: 1 }),
      membership({ householdId: "household-2", householdName: "Casa da praia", role: 0 }),
    ]);

    render(<SelectHouseholdPage />);

    expect(await screen.findByText("Família Silva")).toBeInTheDocument();
    expect(screen.getByText("Casa da praia")).toBeInTheDocument();
    expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(screen.getByText("Member")).toBeInTheDocument();
  });

  it("shows the short empty message and only the create button when there are no households", async () => {
    listMock.mockResolvedValueOnce([]);

    render(<SelectHouseholdPage />);

    expect(
      await screen.findByText(/você ainda não faz parte de nenhum household/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /criar novo household/i })).toBeInTheDocument();
  });

  it("shows a retry-able error and keeps the create button available when the list fails", async () => {
    listMock.mockRejectedValueOnce(new Error("network error"));

    render(<SelectHouseholdPage />);

    expect(await screen.findByText(/não foi possível carregar seus households/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /criar novo household/i })).toBeEnabled();

    listMock.mockResolvedValueOnce([membership()]);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /tentar novamente/i }));

    expect(await screen.findByText("Família Silva")).toBeInTheDocument();
  });

  it("selects a household, stores tokens, and redirects to /dashboard", async () => {
    listMock.mockResolvedValueOnce([membership()]);
    switchMock.mockResolvedValueOnce({ accessToken: "a", refreshToken: "r", householdId: "household-1" });
    const user = userEvent.setup();

    render(<SelectHouseholdPage />);

    await user.click(await screen.findByRole("button", { name: /família silva/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
    expect(switchMock).toHaveBeenCalledWith({ householdId: "household-1" });
    expect(getStoredTokens()).toEqual({ accessToken: "a", refreshToken: "r", householdId: "household-1" });
  });

  it("disables the other household buttons while a selection is pending", async () => {
    listMock.mockResolvedValueOnce([
      membership({ householdId: "household-1", householdName: "Família Silva" }),
      membership({ householdId: "household-2", householdName: "Casa da praia" }),
    ]);
    switchMock.mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();

    render(<SelectHouseholdPage />);

    await user.click(await screen.findByRole("button", { name: /família silva/i }));

    expect(screen.getByRole("button", { name: /casa da praia/i })).toBeDisabled();
  });

  it("shows a generic error inline when selecting a household fails, without navigating", async () => {
    listMock.mockResolvedValueOnce([membership()]);
    switchMock.mockRejectedValueOnce(new Error("boom"));
    const user = userEvent.setup();

    render(<SelectHouseholdPage />);

    await user.click(await screen.findByRole("button", { name: /família silva/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/algo deu errado/i);
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("opens the create-household form, validates the name, and creates on submit", async () => {
    listMock.mockResolvedValueOnce([membership()]);
    createMock.mockResolvedValueOnce({ accessToken: "a", refreshToken: "r", householdId: "household-2" });
    const user = userEvent.setup();

    render(<SelectHouseholdPage />);

    await screen.findByText("Família Silva");
    await user.click(screen.getByRole("button", { name: /criar novo household/i }));

    expect(screen.getByRole("heading", { name: /criar novo household/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^criar$/i }));
    expect(await screen.findByText(/campo obrigatório/i)).toBeInTheDocument();
    expect(createMock).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText(/^nome \*?$/i), "Casa nova");
    await user.click(screen.getByRole("button", { name: /^criar$/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
    expect(createMock).toHaveBeenCalledWith({ householdName: "Casa nova" });
  });

  it("cancels the create-household form and returns to the already-loaded list", async () => {
    listMock.mockResolvedValueOnce([membership()]);
    const user = userEvent.setup();

    render(<SelectHouseholdPage />);

    await screen.findByText("Família Silva");
    await user.click(screen.getByRole("button", { name: /criar novo household/i }));
    await user.type(screen.getByLabelText(/^nome \*?$/i), "Casa nova");
    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(screen.getByText("Família Silva")).toBeInTheDocument();
    expect(listMock).toHaveBeenCalledTimes(1);
  });

  it("shows a generic error inline when creating fails, keeping the typed name", async () => {
    listMock.mockResolvedValueOnce([]);
    createMock.mockRejectedValueOnce(new Error("boom"));
    const user = userEvent.setup();

    render(<SelectHouseholdPage />);

    await screen.findByRole("button", { name: /criar novo household/i });
    await user.click(screen.getByRole("button", { name: /criar novo household/i }));
    const nameInput = screen.getByLabelText(/^nome \*?$/i);
    await user.type(nameInput, "Casa nova");
    await user.click(screen.getByRole("button", { name: /^criar$/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/algo deu errado/i);
    expect(nameInput).toHaveValue("Casa nova");
    expect(pushMock).not.toHaveBeenCalled();
  });
});
