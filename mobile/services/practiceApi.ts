import type {
  CreatePracticeInput,
  Practice,
  UpdatePracticeInput,
} from "@/types/practice";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.0.239:8000";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const error = await response.json();
      message = error.detail ?? message;
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function getPractices(): Promise<Practice[]> {
  return request<Practice[]>("/practices");
}

export async function getPractice(id: number): Promise<Practice> {
  return request<Practice>(`/practices/${id}`);
}

export async function createPractice(
  data: CreatePracticeInput,
): Promise<Practice> {
  return request<Practice>("/practices", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePractice(
  id: number,
  data: UpdatePracticeInput,
): Promise<Practice> {
  return request<Practice>(`/practices/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function completePractice(id: number): Promise<Practice> {
  return request<Practice>(`/practices/${id}/complete`, {
    method: "PATCH",
  });
}

export async function deletePractice(id: number): Promise<void> {
  return request<void>(`/practices/${id}`, {
    method: "DELETE",
  });
}
