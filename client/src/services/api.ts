const BASE_URL = 'http://localhost:8080/api/v1';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body: any, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    }),

  put: <T = any>(endpoint: string, body: any, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    }),

  delete: <T = any>(endpoint: string, options?: RequestOptions): Promise<T> =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});

  if (!options.skipAuth) {
    const token = localStorage.getItem('arivo_access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 401 && !options.skipAuth) {
      // Access token expired, attempt token refresh
      const newToken = await handleTokenRefresh();
      if (newToken) {
        // Retry original request with new token
        headers.set('Authorization', `Bearer ${newToken}`);
        const retryResponse = await fetch(url, { ...options, headers });
        return handleResponse<T>(retryResponse);
      }
    }

    return handleResponse<T>(response);
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.message || `HTTP error! status: ${response.status}`;
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

async function handleTokenRefresh(): Promise<string | null> {
  const refreshToken = localStorage.getItem('arivo_refresh_token');
  if (!refreshToken) {
    logout();
    return null;
  }

  if (isRefreshing) {
    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        resolve(token);
      });
    });
  }

  isRefreshing = true;

  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Refresh token is invalid');
    }

    const data = await response.json();
    const newAccessToken = data.accessToken;
    const newRefreshToken = data.refreshToken;

    localStorage.setItem('arivo_access_token', newAccessToken);
    if (newRefreshToken) {
      localStorage.setItem('arivo_refresh_token', newRefreshToken);
    }

    isRefreshing = false;
    onRefreshed(newAccessToken);
    return newAccessToken;
  } catch (error) {
    isRefreshing = false;
    logout();
    return null;
  }
}

function logout() {
  localStorage.removeItem('arivo_access_token');
  localStorage.removeItem('arivo_refresh_token');
  localStorage.removeItem('arivo_user');
  window.location.href = '/login';
}
