/**
 * Centralized API Client & Network Boundary
 * Normalizes HTTP requests, headers, timeout handling, and typed error responses.
 */

export interface ApiConfig {
  baseUrl?: string;
  timeoutMs?: number;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  public status: number;
  public code?: string;
  public details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: (import.meta as any).env?.VITE_API_BASE_URL || "/api/v1",
  timeoutMs: 8000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export class ApiClient {
  private config: ApiConfig;

  constructor(config?: ApiConfig) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  public async get<T>(path: string, queryParams?: Record<string, string | number | boolean | undefined>, signal?: AbortSignal): Promise<T> {
    const url = this.buildUrl(path, queryParams);
    return this.request<T>(url, { method: "GET", signal });
  }

  public async post<T, B = unknown>(path: string, body?: B, signal?: AbortSignal): Promise<T> {
    const url = this.buildUrl(path);
    return this.request<T>(url, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  }

  private buildUrl(path: string, queryParams?: Record<string, string | number | boolean | undefined>): string {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const base = this.config.baseUrl?.endsWith("/") ? this.config.baseUrl.slice(0, -1) : this.config.baseUrl;
    const fullUrl = `${base}${cleanPath}`;

    if (!queryParams || Object.keys(queryParams).length === 0) {
      return fullUrl;
    }

    const searchParams = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        searchParams.append(key, String(val));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${fullUrl}?${queryString}` : fullUrl;
  }

  private async request<T>(url: string, init: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs);

    const mergedSignal = init.signal
      ? (anySignal(init.signal, controller.signal) as AbortSignal)
      : controller.signal;

    try {
      const response = await fetch(url, {
        ...init,
        signal: mergedSignal,
        headers: {
          ...this.config.headers,
          ...init.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }
        throw new ApiError(
          errorData.message || `Request failed with status ${response.status}`,
          response.status,
          errorData.code,
          errorData
        );
      }

      return (await response.json()) as T;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        throw new ApiError("Network request timed out or was aborted", 408, "TIMEOUT");
      }
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(err.message || "An unexpected network error occurred", 500, "NETWORK_ERROR");
    }
  }
}

function anySignal(...signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  for (const sig of signals) {
    if (sig.aborted) {
      controller.abort();
      return controller.signal;
    }
    sig.addEventListener("abort", () => controller.abort(), { once: true });
  }
  return controller.signal;
}

export const defaultApiClient = new ApiClient();
