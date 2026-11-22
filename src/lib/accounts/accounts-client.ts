import { authenticatedRequest } from "@/lib/api/authenticated-fetch";
import type { CreditCard, CreditCardRequest, FinancialAccount, FinancialAccountRequest } from "@/types/accounts";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5228/api/v1";

function request<T>(path: string, init?: RequestInit): Promise<T> {
  return authenticatedRequest<T>(API_BASE_URL, path, init);
}

export function listFinancialAccounts(): Promise<FinancialAccount[]> {
  return request<FinancialAccount[]>("/financial-accounts");
}

export function getFinancialAccount(id: string): Promise<FinancialAccount> {
  return request<FinancialAccount>(`/financial-accounts/${id}`);
}

export function createFinancialAccount(data: FinancialAccountRequest): Promise<FinancialAccount> {
  return request<FinancialAccount>("/financial-accounts", { method: "POST", body: JSON.stringify(data) });
}

export function updateFinancialAccount(id: string, data: FinancialAccountRequest): Promise<FinancialAccount> {
  return request<FinancialAccount>(`/financial-accounts/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteFinancialAccount(id: string): Promise<void> {
  return request<void>(`/financial-accounts/${id}`, { method: "DELETE" });
}

export function listCreditCards(): Promise<CreditCard[]> {
  return request<CreditCard[]>("/credit-cards");
}

export function getCreditCard(id: string): Promise<CreditCard> {
  return request<CreditCard>(`/credit-cards/${id}`);
}

export function createCreditCard(data: CreditCardRequest): Promise<CreditCard> {
  return request<CreditCard>("/credit-cards", { method: "POST", body: JSON.stringify(data) });
}

export function updateCreditCard(id: string, data: CreditCardRequest): Promise<CreditCard> {
  return request<CreditCard>(`/credit-cards/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteCreditCard(id: string): Promise<void> {
  return request<void>(`/credit-cards/${id}`, { method: "DELETE" });
}
