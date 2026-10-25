"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/auth/api-error";
import { login } from "@/lib/auth/auth-client";
import { storeTokens } from "@/lib/auth/token-storage";

interface FieldErrors {
  email?: string;
  password?: string;
}

const REQUIRED_FIELD_MESSAGE = "Campo obrigatório";
const GENERIC_SERVER_ERROR = "Não foi possível entrar. Tente novamente.";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!email.trim()) errors.email = REQUIRED_FIELD_MESSAGE;
    if (!password.trim()) errors.password = REQUIRED_FIELD_MESSAGE;
    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    const errors = validate();
    setFieldErrors(errors);
    setFormError(null);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const tokens = await login({ email, password });
      storeTokens(tokens);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setFormError("Email ou senha inválidos");
      } else {
        setFormError(GENERIC_SERVER_ERROR);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
          <CardDescription>Acesse sua conta para continuar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
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
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FormField>
            {formError && (
              <p role="alert" className="text-sm text-destructive">
                {formError}
              </p>
            )}
            <Button type="submit" loading={isSubmitting} className="w-full">
              Entrar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/register" className={buttonVariants({ variant: "link", size: "sm" })}>
            Criar conta
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
