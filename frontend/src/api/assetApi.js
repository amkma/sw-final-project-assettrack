import API from './axiosInstance';

const getUserRole = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.roleId ?? null;
  } catch {
    return null;
  }
};

// ── CRUD ────────────────────────────────────────────────────

/** Get all assets */
export const getAssets = () => {
  const role = getUserRole();
  const endpoint = role === 0 ? '/assets/me' : '/assets';
  return API.get(endpoint, { params: { size: 1000 } });
};

/** Get a single asset by ID */
export const getAssetById = (id) => API.get(`/assets/${id}`);

/** Get assets assigned to a user */
export const getAssetsByUser = (userId) => API.get(`/assets/user/${userId}`, { params: { size: 1000 } });

/** Create a new asset (Admin) */
export const createAsset = (data) => API.post('/assets', data);

/** Update an existing asset (Admin) */
export const updateAsset = (id, data) => API.put(`/assets/${id}`, data);

/** Delete an asset (Admin) */
export const deleteAsset = (id) => API.delete(`/assets/${id}`);

// ── Search & Spare ──────────────────────────────────────────

/**
 * Search assets with optional filters.
 * @param {Object} data — { sn, type, brand, status, userId }
 */
export const searchAssets = (data) => {
  const role = getUserRole();
  const endpoint = role === 0 ? '/assets/me/search' : '/assets/search';
  return API.post(endpoint, data, { params: { size: 1000 } });
};

/**
 * Find an available spare asset of a given type.
 * @param {string} type — e.g. "Laptop", "Monitor", "Accessory"
 */
export const findSpare = (type) => API.get(`/assets/spare-parts/${type}`, { params: { size: 1000 } });
