import { ApiError, toApiError } from "@/lib/auth/api-error";
import { getAccessToken } from "@/lib/auth/token-storage";
import type { Category, CategoryRequest, TransactionEntry, TransactionListParams, TransactionRequest } from "@/types/ledger";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5228/api/v1";

function authHeaders(): HeadersInit {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { ...authHeaders(), ...init?.headers },
    });
  } catch {
    throw new ApiError("Something went wrong. Please try again.", 0);
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function buildQuery(params: TransactionListParams): string {
  const query = new URLSearchParams();
  if (params.accountId) query.set("accountId", params.accountId);
  if (params.categoryId) query.set("categoryId", params.categoryId);
  if (params.type !== undefined) query.set("type", String(params.type));
  if (params.dateFrom) query.set("dateFrom", params.dateFrom);
  if (params.dateTo) query.set("dateTo", params.dateTo);
  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

export function listTransactions(params: TransactionListParams = {}): Promise<TransactionEntry[]> {
  return request<TransactionEntry[]>(`/transactions${buildQuery(params)}`);
}

export function getTransaction(id: string): Promise<TransactionEntry> {
  return request<TransactionEntry>(`/transactions/${id}`);
}

export function createTransaction(data: TransactionRequest): Promise<TransactionEntry> {
  return request<TransactionEntry>("/transactions", { method: "POST", body: JSON.stringify(data) });
}

export function updateTransaction(id: string, data: Omit<TransactionRequest, "financialAccountId">): Promise<TransactionEntry> {
  return request<TransactionEntry>(`/transactions/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteTransaction(id: string): Promise<void> {
  return request<void>(`/transactions/${id}`, { method: "DELETE" });
}

export function listCategories(type?: Category["type"]): Promise<Category[]> {
  const query = type !== undefined ? `?type=${type}` : "";
  return request<Category[]>(`/categories${query}`);
}

export function getCategory(id: string): Promise<Category> {
  return request<Category>(`/categories/${id}`);
}

export function createCategory(data: CategoryRequest): Promise<Category> {
  return request<Category>("/categories", { method: "POST", body: JSON.stringify(data) });
}

export function updateCategory(id: string, data: CategoryRequest): Promise<Category> {
  return request<Category>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteCategory(id: string): Promise<void> {
  return request<void>(`/categories/${id}`, { method: "DELETE" });
}
