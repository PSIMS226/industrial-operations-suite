// api.js — Central API service layer
// All HTTP calls to the Spring Boot backend go through here
// Base URL points to our backend running on port 8080

import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

// Create a reusable axios instance with default settings
const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Equipment endpoints ────────────────────────────────────
// Handles all CRUD operations for factory equipment
export const equipmentApi = {
  getAll: (status) => api.get('/equipment', { params: { status } }),
  getById: (id) => api.get(`/equipment/${id}`),
  create: (data) => api.post('/equipment', data),
  update: (id, data) => api.put(`/equipment/${id}`, data),
  updateStatus: (id, status) => api.patch(`/equipment/${id}/status`, null, { params: { status } }),
  getOverdue: () => api.get('/equipment/overdue-maintenance'),
  getStatusSummary: () => api.get('/equipment/status-summary'),
};

// ── Work Order endpoints ───────────────────────────────────
// Manages maintenance work orders through their lifecycle
export const workOrderApi = {
  getAll: (params) => api.get('/workorders', { params }),
  getById: (id) => api.get(`/workorders/${id}`),
  create: (data) => api.post('/workorders', data),
  update: (id, data) => api.put(`/workorders/${id}`, data),
  start: (id) => api.put(`/workorders/${id}/start`),
  complete: (id, data) => api.put(`/workorders/${id}/complete`, data),
  cancel: (id) => api.put(`/workorders/${id}/cancel`),
  getOverdue: () => api.get('/workorders/overdue'),
};

// ── Inventory endpoints ────────────────────────────────────
// Tracks parts, consumables and tools
export const inventoryApi = {
  getAll: () => api.get('/inventory'),
  getById: (id) => api.get(`/inventory/${id}`),
  create: (data) => api.post('/inventory', data),
  update: (id, data) => api.put(`/inventory/${id}`, data),
  adjustQuantity: (id, delta, reason) => api.patch(`/inventory/${id}/adjust`, { delta, reason }),
  getLowStock: () => api.get('/inventory/low-stock'),
  getOutOfStock: () => api.get('/inventory/out-of-stock'),
};

// ── Production endpoints ───────────────────────────────────
// Logs production runs and retrieves KPI metrics
export const productionApi = {
  getLogs: (params) => api.get('/production/logs', { params }),
  getById: (id) => api.get(`/production/logs/${id}`),
  create: (data) => api.post('/production/logs', data),
  update: (id, data) => api.put(`/production/logs/${id}`, data),
  getKpis: (params) => api.get('/production/kpis', { params }),
};

// ── Downtime endpoints ─────────────────────────────────────
// Logs and resolves equipment downtime events
export const downtimeApi = {
  getAll: (params) => api.get('/downtime', { params }),
  getById: (id) => api.get(`/downtime/${id}`),
  start: (data) => api.post('/downtime', data),
  resolve: (id, data) => api.put(`/downtime/${id}/resolve`, data),
  getOngoing: () => api.get('/downtime/ongoing'),
  getSummaryByEquipment: (from, to) => api.get('/downtime/summary/equipment', { params: { from, to } }),
};

// ── Alert endpoints ────────────────────────────────────────
// Creates and manages system alerts
export const alertApi = {
  getAll: (status) => api.get('/alerts', { params: { status } }),
  getById: (id) => api.get(`/alerts/${id}`),
  create: (data) => api.post('/alerts', data),
  acknowledge: (id, acknowledgedBy) => api.put(`/alerts/${id}/acknowledge`, { acknowledgedBy }),
  resolve: (id, data) => api.put(`/alerts/${id}/resolve`, data),
  getCounts: () => api.get('/alerts/counts'),
};

// ── Shift Report endpoints ─────────────────────────────────
// Creates and manages daily shift reports
export const shiftReportApi = {
  getAll: (params) => api.get('/shiftreports', { params }),
  getById: (id) => api.get(`/shiftreports/${id}`),
  create: (data) => api.post('/shiftreports', data),
  update: (id, data) => api.put(`/shiftreports/${id}`, data),
  submit: (id, submittedBy) => api.put(`/shiftreports/${id}/submit`, { submittedBy }),
  approve: (id) => api.put(`/shiftreports/${id}/approve`),
};

export default api;