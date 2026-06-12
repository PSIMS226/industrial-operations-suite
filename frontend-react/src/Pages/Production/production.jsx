// Production.jsx — Production log and KPI tracking page
// Logs production runs and displays aggregated OEE metrics
// OEE (Overall Equipment Effectiveness) = Availability × Performance × Quality
// The backend auto-calculates OEE when a production log is saved

import { useEffect, useState } from 'react';
import { productionApi, equipmentApi } from '../../services/api';
import { Plus, X } from 'lucide-react';

// Recharts components for the OEE bar chart
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

// Default empty form for logging a production run
const EMPTY_FORM = {
  equipmentId: '', productName: '', productCode: '', shiftName: 'DAY',
  operatorName: '', periodStart: '', periodEnd: '',
  targetUnits: '', producedUnits: '', defectiveUnits: '', scrapUnits: '',
  plannedDowntimeMinutes: 0, unplannedDowntimeMinutes: 0, notes: '',
};

export default function Production() {
  const [logs, setLogs]           = useState([]);   // all production logs
  const [kpis, setKpis]           = useState(null); // aggregated KPI summary
  const [equipment, setEquipment] = useState([]);   // for equipment dropdown
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);

  const load = () => {
    setLoading(true);
    Promise.all([
      productionApi.getLogs(),
      productionApi.getKpis(),
      equipmentApi.getAll(),
    ]).then(([logsRes, kpiRes, eqRes]) => {
      setLogs(logsRes.data.data || []);
      setKpis(kpiRes.data.data);
      setEquipment(eqRes.data.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Create a new production log
  // Equipment sent as object with id — Spring Boot resolves the full entity
  const handleCreate = async () => {
    const payload = { ...form };
    if (form.equipmentId) payload.equipment = { id: parseInt(form.equipmentId) };
    await productionApi.create(payload);
    setShowModal(false);
    load();
  };

  // Color code OEE values — green = good, amber = ok, red = poor
  // Industry standard: >85% = world class, 65-85% = typical, <65% = poor
  const oeeColor = (oee) => {
    if (!oee)        return 'var(--text-muted)';
    if (oee >= 0.85) return 'var(--success)';
    if (oee >= 0.65) return 'var(--warning)';
    return 'var(--danger)';
  };

  // Format logs for the Recharts bar chart
  // Shows last 10 production runs as OEE percentage bars
  const chartData = logs.slice(0, 10).map(l => ({
    name:     l.productName || `Log ${l.id}`,
    OEE:      l.oee ? Math.round(l.oee * 100) : 0,
    Produced: l.producedUnits || 0,
  }));

  return (
    <div>
      {/* ── Page Header ───────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div className="page-title">Production</div>
          <div className="page-subtitle">Log production runs and track KPIs</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY_FORM); setShowModal(true); }}>
          <Plus size={16} /> Log Production Run
        </button>
      </div>

      {/* ── KPI Summary Cards ─────────────────────────────── */}
      {/* These pull from the /api/production/kpis endpoint   */}
      {/* which aggregates data across the last 30 days       */}
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-label">Avg OEE</div>
          <div className="stat-value" style={{ color: oeeColor(kpis?.avgOee) }}>
            {kpis?.avgOee ? Math.round(kpis.avgOee * 100) + '%' : '—'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Availability</div>
          <div className="stat-value">
            {kpis?.avgAvailability ? Math.round(kpis.avgAvailability * 100) + '%' : '—'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Performance</div>
          <div className="stat-value">
            {kpis?.avgPerformance ? Math.round(kpis.avgPerformance * 100) + '%' : '—'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Quality</div>
          <div className="stat-value">
            {kpis?.avgQuality ? Math.round(kpis.avgQuality * 100) + '%' : '—'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Produced</div>
          <div className="stat-value">
            {kpis?.totalUnitsProduced?.toLocaleString() || '—'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Defect Rate</div>
          <div className="stat-value">
            {kpis?.defectRate ? (kpis.defectRate * 100).toFixed(1) + '%' : '—'}
          </div>
        </div>
      </div>

      {/* ── OEE Bar Chart ─────────────────────────────────── */}
      {/* Only renders if there is production data to show    */}
      {chartData.length > 0 && (
        <div className="card mb-6">
          <div className="card-title">OEE by Production Run (last 10)</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="name"
                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              />
              <YAxis
                tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 8
                }}
              />
              {/* Blue bars for OEE percentage */}
              <Bar dataKey="OEE" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Production Logs Table ─────────────────────────── */}
      {loading ? <div className="loading">Loading...</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Equipment</th>
                <th>Shift</th>
                <th>Target</th>
                <th>Produced</th>
                <th>Defects</th>
                <th>OEE</th>
                <th>Period Start</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                    No production logs yet
                  </td>
                </tr>
              ) : logs.map(log => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 600 }}>{log.productName || '—'}</td>
                  <td>{log.equipment?.name || '—'}</td>
                  <td>{log.shiftName || '—'}</td>
                  <td>{log.targetUnits || '—'}</td>
                  <td>{log.producedUnits || '—'}</td>
                  <td>{log.defectiveUnits || 0}</td>
                  {/* OEE colored by performance threshold */}
                  <td style={{ fontWeight: 700, color: oeeColor(log.oee) }}>
                    {log.oee ? Math.round(log.oee * 100) + '%' : '—'}
                  </td>
                  <td>
                    {log.periodStart ? new Date(log.periodStart).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Log Production Run Modal ──────────────────────── */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Log Production Run</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  value={form.productName}
                  onChange={e => setForm({ ...form, productName: e.target.value })}
                  placeholder="Widget A"
                />
              </div>
              <div className="form-group">
                <label>Product Code</label>
                <input
                  value={form.productCode}
                  onChange={e => setForm({ ...form, productCode: e.target.value })}
                  placeholder="WGT-001"
                />
              </div>
              <div className="form-group">
                <label>Equipment</label>
                <select
                  value={form.equipmentId}
                  onChange={e => setForm({ ...form, equipmentId: e.target.value })}
                >
                  <option value="">Select equipment</option>
                  {equipment.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Shift</label>
                <select
                  value={form.shiftName}
                  onChange={e => setForm({ ...form, shiftName: e.target.value })}
                >
                  <option value="DAY">Day</option>
                  <option value="EVENING">Evening</option>
                  <option value="NIGHT">Night</option>
                </select>
              </div>
              <div className="form-group">
                <label>Period Start</label>
                <input
                  type="datetime-local"
                  value={form.periodStart}
                  onChange={e => setForm({ ...form, periodStart: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Period End</label>
                <input
                  type="datetime-local"
                  value={form.periodEnd}
                  onChange={e => setForm({ ...form, periodEnd: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Target Units</label>
                <input
                  type="number"
                  value={form.targetUnits}
                  onChange={e => setForm({ ...form, targetUnits: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Produced Units</label>
                <input
                  type="number"
                  value={form.producedUnits}
                  onChange={e => setForm({ ...form, producedUnits: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Defective Units</label>
                <input
                  type="number"
                  value={form.defectiveUnits}
                  onChange={e => setForm({ ...form, defectiveUnits: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Operator</label>
                <input
                  value={form.operatorName}
                  onChange={e => setForm({ ...form, operatorName: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Save Log</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}