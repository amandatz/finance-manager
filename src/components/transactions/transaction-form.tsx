"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { listFinancialAccounts } from "@/lib/accounts/accounts-client";
import { ApiError } from "@/lib/auth/api-error";
import { hasAtMostTwoDecimalPlaces } from "@/lib/ledger/format";
import { createTransaction, listCategories, updateTransaction } from "@/lib/ledger/ledger-client";
import { CATEGORY_TYPES, type Category, type LedgerTypeValue, type TransactionEntry } from "@/types/ledger";
import type { FinancialAccount } from "@/types/accounts";

interface FieldErrors {
  financialAccountId?: string;
  categoryId?: string;
  amount?: string;
  date?: string;
  description?: string;
}

const VALIDATION_FIELD_MAP: Record<string, keyof FieldErrors> = {
  FinancialAccountId: "financialAccountId",
  CategoryId: "categoryId",
  Amount: "amount",
  Date: "date",
  Description: "description",
};

const GENERIC_ERROR = "Something went wrong. Please try again.";
const STALE_REFERENCE_ERROR = "One of the selected options is no longer available. Please review your choices and try again.";
const AMOUNT_ERROR = "Enter an amount greater than 0, with at most 2 decimal places.";

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function TransactionForm({ transaction }: { transaction?: TransactionEntry }) {
  const router = useRouter();
  const isEditing = Boolean(transaction);

  const [type, setType] = useState<LedgerTypeValue>(transaction?.type ?? 1);
  const [financialAccountId, setFinancialAccountId] = useState(transaction?.financialAccountId ?? "");
  const [categoryId, setCategoryId] = useState(transaction?.categoryId ?? "");
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : "");
  const [date, setDate] = useState(transaction?.date ?? todayDate());
  const [description, setDescription] = useState(transaction?.description ?? "");

  const [accounts, setAccounts] = useState<FinancialAccount[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([listFinancialAccounts(), listCategories()])
      .then(([accountsResult, categoriesResult]) => {
        if (cancelled) return;
        setAccounts(accountsResult);
        setCategories(categoriesResult);
      })
      .catch(() => {
        if (!cancelled) setFormError(GENERIC_ERROR);
      })
      .finally(() => {
        if (!cancelled) setLoadingOptions(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categoriesForType = categories.filter((category) => category.type === type);

  function handleTypeChange(nextType: LedgerTypeValue) {
    setType(nextType);
    const stillValid = categories.some((category) => category.id === categoryId && category.type === nextType);
    if (!stillValid) setCategoryId("");
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!financialAccountId) errors.financialAccountId = "Account is required.";
    if (!categoryId) errors.categoryId = "Category is required.";

    const numericAmount = Number(amount);
    if (!amount.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0 || !hasAtMostTwoDecimalPlaces(amount)) {
      errors.amount = AMOUNT_ERROR;
    }

    if (!date) errors.date = "Date is required.";
    if (description.length > 250) errors.description = "Description must be at most 250 characters.";

    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmittingRef.current) return;

    setFormError(null);
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      const basePayload = {
        categoryId,
        type,
        amount: Number(amount),
        currency: "BRL",
        date,
        description: description.trim() ? description : undefined,
        isHouseholdExpense: null,
      };
      if (isEditing && transaction) {
        await updateTransaction(transaction.id, basePayload);
      } else {
        await createTransaction({ ...basePayload, financialAccountId });
      }
      router.push("/dashboard/transactions");
    } catch (error) {
      handleSubmitError(error);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  function handleSubmitError(error: unknown) {
    if (!(error instanceof ApiError)) {
      setFormError(GENERIC_ERROR);
      return;
    }

    if (error.status === 400 && error.errors) {
      const nextErrors: FieldErrors = {};
      for (const [key, messages] of Object.entries(error.errors)) {
        const field = VALIDATION_FIELD_MAP[key];
        if (field) nextErrors[field] = messages[0];
      }
      setFieldErrors(nextErrors);
      return;
    }

    if (error.status === 400) {
      setFieldErrors((prev) => ({ ...prev, categoryId: error.message }));
      return;
    }

    if (error.status === 404) {
      setFormError(STALE_REFERENCE_ERROR);
      return;
    }

    setFormError(GENERIC_ERROR);
  }

  return (
    <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
      <FormField label="Type" required>
        <Select
          value={type}
          disabled={loadingOptions}
          onChange={(event) => handleTypeChange(Number(event.target.value) as LedgerTypeValue)}
        >
          {CATEGORY_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField
        label="Account"
        error={fieldErrors.financialAccountId}
        required
        helperText={
          isEditing
            ? "The account can't be changed after creating the transaction. Delete and recreate it against a different account if needed."
            : undefined
        }
      >
        <Select
          value={financialAccountId}
          disabled={isEditing || loadingOptions}
          onChange={(event) => setFinancialAccountId(event.target.value)}
        >
          <option value="">Select an account</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField
        label="Category"
        error={fieldErrors.categoryId}
        required
        helperText={categoriesForType.length === 0 && !loadingOptions ? "Select a type first" : undefined}
      >
        <Select
          value={categoryId}
          disabled={loadingOptions || categoriesForType.length === 0}
          aria-describedby={categoriesForType.length === 0 ? "category-placeholder-hint" : undefined}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          <option value="">Select a type first</option>
          {categoriesForType.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Amount" error={fieldErrors.amount} required>
        <Input
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </FormField>

      <FormField label="Date" error={fieldErrors.date} required>
        <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
      </FormField>

      <FormField label="Description" error={fieldErrors.description}>
        <Input value={description} onChange={(event) => setDescription(event.target.value)} maxLength={250} />
      </FormField>

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Link href="/dashboard/transactions" className="inline-flex">
          <Button type="button" variant="ghost">
            Cancel
          </Button>
        </Link>
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? (isSubmitting ? "Saving…" : "Save changes") : isSubmitting ? "Creating…" : "Create transaction"}
        </Button>
      </div>
    </form>
  );
}
