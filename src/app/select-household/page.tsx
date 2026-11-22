"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { switchHousehold } from "@/lib/auth/auth-client";
import { storeTokens } from "@/lib/auth/token-storage";
import { createHousehold, listMyHouseholds } from "@/lib/households/households-client";
import type { HouseholdMembership } from "@/types/auth";

type ListState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; households: HouseholdMembership[] };

const REQUIRED_FIELD_MESSAGE = "Campo obrigatório";
const GENERIC_ACTION_ERROR = "Algo deu errado. Tente novamente.";

const HOUSEHOLD_ROLE_LABELS: Record<number, string> = {
  0: "Member",
  1: "Owner",
};

export default function SelectHouseholdPage() {
  const router = useRouter();
  const [listState, setListState] = useState<ListState>({ status: "loading" });
  const [retryCount, setRetryCount] = useState(0);
  const [mode, setMode] = useState<"list" | "create">("list");
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [householdName, setHouseholdName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    listMyHouseholds()
      .then((households) => {
        if (!cancelled) setListState({ status: "success", households });
      })
      .catch(() => {
        if (!cancelled) setListState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  function retryList() {
    setListState({ status: "loading" });
    setRetryCount((count) => count + 1);
  }

  async function handleSelect(household: HouseholdMembership) {
    if (selectingId) return;

    setActionError(null);
    setSelectingId(household.householdId);
    try {
      const tokens = await switchHousehold({ householdId: household.householdId });
      storeTokens(tokens);
      router.push("/dashboard");
    } catch {
      setActionError(GENERIC_ACTION_ERROR);
    } finally {
      setSelectingId(null);
    }
  }

  function openCreateForm() {
    setActionError(null);
    setNameError(null);
    setMode("create");
  }

  function cancelCreateForm() {
    setActionError(null);
    setNameError(null);
    setHouseholdName("");
    setMode("list");
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmittingRef.current) return;

    const trimmedName = householdName.trim();
    if (!trimmedName) {
      setNameError(REQUIRED_FIELD_MESSAGE);
      return;
    }
    setNameError(null);
    setActionError(null);

    isSubmittingRef.current = true;
    setIsCreating(true);
    try {
      const tokens = await createHousehold({ householdName: trimmedName });
      storeTokens(tokens);
      router.push("/dashboard");
    } catch {
      setActionError(GENERIC_ACTION_ERROR);
    } finally {
      isSubmittingRef.current = false;
      setIsCreating(false);
    }
  }

  const households = listState.status === "success" ? listState.households : [];
  const showEmptyMessage = listState.status === "success" && households.length === 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        {mode === "list" ? (
          <>
            <CardHeader>
              <CardTitle>Escolha um household</CardTitle>
              <CardDescription>
                {showEmptyMessage
                  ? "Você ainda não faz parte de nenhum household. Crie um para continuar."
                  : "Selecione um household para continuar, ou crie um novo."}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {listState.status === "loading" && (
                <div className="flex flex-col gap-2" data-testid="households-loading">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              )}

              {listState.status === "error" && (
                <div className="flex flex-col items-center gap-2 text-center">
                  <p className="text-sm text-muted-foreground">Não foi possível carregar seus households.</p>
                  <Button type="button" variant="outline" size="sm" onClick={retryList}>
                    Tentar novamente
                  </Button>
                </div>
              )}

              {listState.status === "success" &&
                households.map((household) => {
                  const isSelecting = selectingId === household.householdId;
                  const isDisabled = selectingId !== null;
                  return (
                    <button
                      key={household.householdId}
                      type="button"
                      disabled={isDisabled}
                      aria-busy={isSelecting || undefined}
                      aria-disabled={isDisabled && !isSelecting ? true : undefined}
                      onClick={() => handleSelect(household)}
                      className="flex w-full items-center justify-between rounded-card border border-border bg-surface px-4 py-3 text-left text-sm font-medium text-surface-foreground transition-colors duration-base hover:bg-accent/60 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span>{household.householdName}</span>
                      {isSelecting ? (
                        <span className="text-xs text-muted-foreground">Entrando…</span>
                      ) : (
                        <Badge variant="outline">{HOUSEHOLD_ROLE_LABELS[household.role] ?? household.role}</Badge>
                      )}
                    </button>
                  );
                })}

              {actionError && (
                <p role="alert" className="text-sm text-destructive">
                  {actionError}
                </p>
              )}
            </CardContent>
            <CardFooter className="justify-center">
              <Button type="button" className="w-full" onClick={openCreateForm}>
                Criar novo household
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Criar novo household</CardTitle>
              <CardDescription>Dê um nome ao seu household.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4" noValidate onSubmit={handleCreate}>
                <FormField label="Nome" error={nameError ?? undefined} required>
                  <Input
                    type="text"
                    autoComplete="off"
                    value={householdName}
                    onChange={(event) => setHouseholdName(event.target.value)}
                    disabled={isCreating}
                  />
                </FormField>
                {actionError && (
                  <p role="alert" className="text-sm text-destructive">
                    {actionError}
                  </p>
                )}
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={cancelCreateForm} disabled={isCreating}>
                    Cancelar
                  </Button>
                  <Button type="submit" loading={isCreating}>
                    {isCreating ? "Criando…" : "Criar"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
