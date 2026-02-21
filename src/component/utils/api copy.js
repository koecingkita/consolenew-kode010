async function apiFetch(path, options = {}) {
  const result = {
    data: null,
    error: null,
    loading: true
  }
  try {
    const res = await fetch(`${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    result.data = await res.json();
    result.loading = false;
    return result;
  } catch (e) {
    result.error = e;
    result.loading = false;
    return result;
  }

}

export const api = {
  get: (path) => apiFetch(path),

  post: (path, data) => apiFetch(path, {
    method: "POST",
    body: JSON.stringify(data),
  }),

  put: (path, data) => apiFetch(path, {
    method: "PUT",
    body: JSON.stringify(data),
  }),

  delete: (path, data) => apiFetch(path, {
    method: "DELETE",
    body: JSON.stringify(data)
  }),
};
