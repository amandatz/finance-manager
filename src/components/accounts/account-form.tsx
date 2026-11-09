"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ApiError } from "@/lib/auth/api-error";
import { createFinancialAccount, updateFinancialAccount } from "@/lib/accounts/accounts-client";
import { FINANCIAL_ACCOUNT_TYPES, type FinancialAccount, type FinancialAccountTypeValue } from "@/types/accounts";

interface FieldErrors {
  name?: string;
  type?: string;
  institutionName?: string;
}

const VALIDATION_FIELD_MAP: Record<string, keyof FieldErrors> = {
  Name: "name",
  Type: "type",
  InstitutionName: "institutionName",
};

const GENERIC_ERROR = "Something went wrong. Please try again.";

export function AccountForm({ account }: { account?: FinancialAccount }) {
  const router = useRouter();
  const isEditing = Boolean(account);
  const [name, setName] = useState(account?.name ?? "");
  const [type, setType] = useState<FinancialAccountTypeValue>(account?.type ?? 1);
  const [institutionName, setInstitutionName] = useState(account?.institutionName ?? "");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmittingRef.current) return;

    setFieldErrors({});
    setFormError(null);

    if (!name.trim()) {
      setFieldErrors({ name: "Name is required." });
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      const payload = {
        name,
        type,
        institutionName: institutionName.trim() ? institutionName : undefined,
      };
      if (isEditing && account) {
        await updateFinancialAccount(account.id, payload);
      } else {
        await createFinancialAccount(payload);
      }
      router.push("/dashboard/accounts");
    } catch (error) {
      if (error instanceof ApiError && error.status === 400 && error.errors) {
        const nextErrors: FieldErrors = {};
        for (const [key, messages] of Object.entries(error.errors)) {
          const field = VALIDATION_FIELD_MAP[key];
          if (field) nextErrors[field] = messages[0];
        }
        setFieldErrors(nextErrors);
      } else {
        setFormError(GENERIC_ERROR);
      }
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
      <FormField label="Name" error={fieldErrors.name} required>
        <Input value={name} onChange={(event) => setName(event.target.value)} maxLength={100} />
      </FormField>
      <FormField
        label="Type"
        error={fieldErrors.type}
        required
        helperText={isEditing ? "The account type can't be changed after creation." : undefined}
      >
        <Select
          value={type}
          disabled={isEditing}
          onChange={(event) => setType(Number(event.target.value) as FinancialAccountTypeValue)}
        >
          {FINANCIAL_ACCOUNT_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label="Institution" error={fieldErrors.institutionName}>
        <Input value={institutionName} onChange={(event) => setInstitutionName(event.target.value)} maxLength={150} />
      </FormField>

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Link href="/dashboard/accounts" className="inline-flex">
          <Button type="button" variant="ghost">
            Cancel
          </Button>
        </Link>
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? (isSubmitting ? "Saving…" : "Save changes") : isSubmitting ? "Creating…" : "Create account"}
        </Button>
      </div>
    </form>
  );
}
