"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/auth/api-error";
import { register } from "@/lib/auth/auth-client";
import { storeTokens } from "@/lib/auth/token-storage";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

const REQUIRED_FIELD_MESSAGE = "Campo obrigatório";
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_TOO_SHORT_MESSAGE = `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres`;
const GENERIC_SERVER_ERROR = "Não foi possível criar sua conta. Tente novamente.";

// Validation Problem Details field keys are PascalCase per
// docs/api/frontend-auth-spec.md ("Validation error shape").
const VALIDATION_FIELD_MAP: Record<string, keyof FieldErrors> = {
  Name: "name",
  Email: "email",
  Password: "password",
};

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [emailInUse, setEmailInUse] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = REQUIRED_FIELD_MESSAGE;
    if (!email.trim()) errors.email = REQUIRED_FIELD_MESSAGE;
    if (!password.trim()) {
      errors.password = REQUIRED_FIELD_MESSAGE;
    } else if (password.length < PASSWORD_MIN_LENGTH) {
      errors.password = PASSWORD_TOO_SHORT_MESSAGE;
    }

    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmittingRef.current) return;

    const errors = validate();
    setFieldErrors(errors);
    setFormError(null);
    setEmailInUse(false);

    if (Object.keys(errors).length > 0) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      const tokens = await register({ name, email, password });
      storeTokens(tokens);
      router.push(tokens.householdId ? "/dashboard" : "/select-household");
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setEmailInUse(true);
      } else if (error instanceof ApiError && error.status === 400 && error.errors) {
        const nextErrors: FieldErrors = {};
        for (const [key, messages] of Object.entries(error.errors)) {
          const field = VALIDATION_FIELD_MAP[key];
          if (field) nextErrors[field] = messages[0];
        }
        setFieldErrors(nextErrors);
      } else if (error instanceof ApiError && error.status === 400) {
        setFormError(error.message);
      } else {
        setFormError(GENERIC_SERVER_ERROR);
      }
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>Cadastre-se para começar a usar o Finance Manager.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
            <FormField label="Nome" error={fieldErrors.name} required>
              <Input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </FormField>
            <FormField label="Email" error={fieldErrors.email} required>
              <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormField>
            <FormField label="Senha" error={fieldErrors.password} required>
              <Input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FormField>
            {emailInUse && (
              <p role="alert" className="text-sm text-destructive">
                Este email já está cadastrado.{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Entrar
                </Link>
              </p>
            )}
            {formError && (
              <p role="alert" className="text-sm text-destructive">
                {formError}
              </p>
            )}
            <Button type="submit" loading={isSubmitting} className="w-full">
              Criar conta
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/login" className={buttonVariants({ variant: "link", size: "sm" })}>
            Já tem uma conta? Entrar
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
