import API from './axiosInstance';

// ── CRUD ────────────────────────────────────────────────────

/** Get all assets */
export const getAssets = () => API.get('/assets', { params: { size: 1000 } });

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
export const searchAssets = (data) => API.post('/assets/search', data, { params: { size: 1000 } });

/**
 * Find an available spare asset of a given type.
 * @param {string} type — e.g. "Laptop", "Monitor", "Accessory"
 */
export const findSpare = (type) => API.get(`/assets/spare-parts/${type}`, { params: { size: 1000 } });
