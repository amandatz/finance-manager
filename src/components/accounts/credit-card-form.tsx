"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ApiError } from "@/lib/auth/api-error";
import { createCreditCard, listFinancialAccounts, updateCreditCard } from "@/lib/accounts/accounts-client";
import type { CreditCard, FinancialAccount } from "@/types/accounts";

interface FieldErrors {
  brand?: string;
  creditLimit?: string;
  statementClosingDay?: string;
  paymentDueDay?: string;
  settlementAccountId?: string;
}

const VALIDATION_FIELD_MAP: Record<string, keyof FieldErrors> = {
  Brand: "brand",
  CreditLimit: "creditLimit",
  StatementClosingDay: "statementClosingDay",
  PaymentDueDay: "paymentDueDay",
};

const DAY_RANGE_ERROR = "Enter a day between 1 and 31.";
const LIMIT_ERROR = "Enter an amount greater than 0.";
const DUE_DAY_EQUALS_CLOSING_ERROR = "Payment due day must be different from the statement closing day.";
const SETTLEMENT_ACCOUNT_ERROR = "This account is no longer available. Choose another one or leave it blank.";
const GENERIC_ERROR = "Something went wrong. Please try again.";
const NO_SETTLEMENT_ACCOUNT = "";

function isValidDay(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 31;
}

export function CreditCardForm({ card }: { card?: CreditCard }) {
  const router = useRouter();
  const isEditing = Boolean(card);

  const [brand, setBrand] = useState(card?.brand ?? "");
  const [creditLimit, setCreditLimit] = useState(card ? String(card.creditLimit) : "");
  const [statementClosingDay, setStatementClosingDay] = useState(card ? String(card.statementClosingDay) : "");
  const [paymentDueDay, setPaymentDueDay] = useState(card ? String(card.paymentDueDay) : "");
  const [settlementAccountId, setSettlementAccountId] = useState(NO_SETTLEMENT_ACCOUNT);
  const [activeAccounts, setActiveAccounts] = useState<FinancialAccount[]>([]);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    listFinancialAccounts()
      .then((accounts) => {
        setActiveAccounts(accounts);
        if (card?.settlementAccountId && accounts.some((a) => a.id === card.settlementAccountId)) {
          setSettlementAccountId(card.settlementAccountId);
        }
      })
      .catch(() => {
        setActiveAccounts([]);
      });
    // Re-run only when editing a different card — settlementAccountId pre-selection
    // depends on `card`, not on anything that changes during this form's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card?.id]);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    const limit = Number(creditLimit);
    if (!creditLimit.trim() || !Number.isFinite(limit) || limit <= 0) {
      errors.creditLimit = LIMIT_ERROR;
    }

    const closingDay = Number(statementClosingDay);
    if (!statementClosingDay.trim() || !isValidDay(closingDay)) {
      errors.statementClosingDay = DAY_RANGE_ERROR;
    }

    const dueDay = Number(paymentDueDay);
    if (!paymentDueDay.trim() || !isValidDay(dueDay)) {
      errors.paymentDueDay = DAY_RANGE_ERROR;
    } else if (!errors.statementClosingDay && closingDay === dueDay) {
      errors.paymentDueDay = DUE_DAY_EQUALS_CLOSING_ERROR;
    }

    if (brand.length > 50) {
      errors.brand = "Brand must be at most 50 characters.";
    }

    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setFormError(null);
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      const payload = {
        creditLimit: Number(creditLimit),
        statementClosingDay: Number(statementClosingDay),
        paymentDueDay: Number(paymentDueDay),
        brand: brand.trim() ? brand : undefined,
        settlementAccountId: settlementAccountId || null,
      };
      if (isEditing && card) {
        await updateCreditCard(card.id, payload);
      } else {
        await createCreditCard(payload);
      }
      router.push("/dashboard/accounts/cards");
    } catch (error) {
      handleSubmitError(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSubmitError(error: unknown) {
    if (!(error instanceof ApiError) || error.status !== 400) {
      setFormError(GENERIC_ERROR);
      return;
    }

    if (error.errors) {
      const nextErrors: FieldErrors = {};
      for (const [key, messages] of Object.entries(error.errors)) {
        const field = VALIDATION_FIELD_MAP[key];
        if (field) nextErrors[field] = messages[0];
      }
      setFieldErrors(nextErrors);
      return;
    }

    if (error.propertyName === "paymentDueDay") {
      setFieldErrors((prev) => ({ ...prev, paymentDueDay: DUE_DAY_EQUALS_CLOSING_ERROR }));
      return;
    }

    if (error.message.toLowerCase().includes("settlementaccountid")) {
      setFieldErrors((prev) => ({ ...prev, settlementAccountId: SETTLEMENT_ACCOUNT_ERROR }));
      setSettlementAccountId(NO_SETTLEMENT_ACCOUNT);
      return;
    }

    setFormError(GENERIC_ERROR);
  }

  return (
    <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
      <FormField label="Brand" error={fieldErrors.brand} helperText="e.g. Visa, Mastercard, Elo">
        <Input value={brand} onChange={(event) => setBrand(event.target.value)} maxLength={50} />
      </FormField>
      <FormField label="Credit limit" error={fieldErrors.creditLimit} required>
        <Input
          type="number"
          min="0.01"
          step="0.01"
          value={creditLimit}
          onChange={(event) => setCreditLimit(event.target.value)}
        />
      </FormField>
      <FormField label="Statement closing day" error={fieldErrors.statementClosingDay} required>
        <Input
          type="number"
          min="1"
          max="31"
          value={statementClosingDay}
          onChange={(event) => setStatementClosingDay(event.target.value)}
        />
      </FormField>
      <FormField label="Payment due day" error={fieldErrors.paymentDueDay} required>
        <Input
          type="number"
          min="1"
          max="31"
          value={paymentDueDay}
          onChange={(event) => setPaymentDueDay(event.target.value)}
        />
      </FormField>
      <FormField label="Settlement account" error={fieldErrors.settlementAccountId}>
        <Select value={settlementAccountId} onChange={(event) => setSettlementAccountId(event.target.value)}>
          <option value={NO_SETTLEMENT_ACCOUNT}>No settlement account</option>
          {activeAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </Select>
      </FormField>

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Link href="/dashboard/accounts/cards" className="inline-flex">
          <Button type="button" variant="ghost">
            Cancel
          </Button>
        </Link>
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? (isSubmitting ? "Saving…" : "Save changes") : isSubmitting ? "Creating…" : "Create credit card"}
        </Button>
      </div>
    </form>
  );
}
