import {
  HealthResponse,
  ScoreResponse,
  SuspiciousTransactionListResponse,
  TransactionPayload,
} from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  return response.json() as Promise<T>;
}

export async function fetchHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`, {
    cache: "no-store",
  });
  return handleResponse<HealthResponse>(response);
}

export async function scoreTransaction(
  payload: TransactionPayload
): Promise<ScoreResponse> {
  const response = await fetch(`${API_BASE_URL}/score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleResponse<ScoreResponse>(response);
}

export async function fetchSuspiciousTransactions(): Promise<SuspiciousTransactionListResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/suspicious`, {
    cache: "no-store",
  });

  return handleResponse<SuspiciousTransactionListResponse>(response);
}