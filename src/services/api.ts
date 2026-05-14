const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error("VITE_API_URL não configurada no .env");
}

type ApiRequestOptions = RequestInit & {
  body?: BodyInit | null;
};

export async function apiRequest<T>(
  endpoint: string,
  options?: ApiRequestOptions,
): Promise<T> {
  const token = localStorage.getItem("@casa-finance:token");

  const response = await fetch(`${apiUrl}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Erro inesperado ao comunicar com a API.",
    );
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}