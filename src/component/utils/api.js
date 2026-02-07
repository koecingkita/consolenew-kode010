async function apiFetch(path, options = {}) {
  const res = await fetch(`${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export const api = {
  get: (path) => apiFetch(path),

  post: (path, data) =>
    apiFetch(path, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: (path, data) =>
    apiFetch(path, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (path) =>
    apiFetch(path, {
      method: "DELETE",
    }),
};
