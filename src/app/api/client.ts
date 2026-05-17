/** API host without trailing slash. Empty in production = same origin as the web app. */
export function getApiBaseUrl(): string {
  const env = import.meta.env.VITE_API_URL as string | undefined;
  if (env) return env.replace(/\/$/, '');
  if (import.meta.env.PROD) return '';
  return 'http://localhost:5000';
}

export const BASE_URL = `${getApiBaseUrl()}/api`;
export const IMAGE_BASE_URL = getApiBaseUrl();

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (options.headers) {
    const optionsHeaders = options.headers as Record<string, string>;
    Object.assign(headers, optionsHeaders);
  }

  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (headers['Content-Type'] === '') {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export async function uploadPhoto(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('photo', file);
  return apiClient('/upload', {
    method: 'POST',
    body: formData,
  });
}
