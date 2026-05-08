import API from './axiosInstance';

// ── CRUD ────────────────────────────────────────────────────

/** Get all assets */
export const getAssets = () => API.get('/assets');

/** Get a single asset by ID */
export const getAssetById = (id) => API.get(`/assets/${id}`);

/** Create a new asset (Admin) */
export const createAsset = (data) => API.post('/assets', data);

/** Update an existing asset (Admin) */
export const updateAsset = (id, data) => API.put(`/assets/${id}`, data);

/** Delete an asset (Admin) */
export const deleteAsset = (id) => API.delete(`/assets/${id}`);

// ── Search & Spare ──────────────────────────────────────────

/**
 * Search assets with optional filters.
 * @param {Object} params — { sn, type, brand, status }
 */
export const searchAssets = (params) => API.get('/assets/search', { params });

/**
 * Find an available spare asset of a given type.
 * @param {string} type — e.g. "Laptop", "Monitor", "Accessory"
 */
export const findSpare = (type) => API.get('/assets/spare', { params: { type } });
