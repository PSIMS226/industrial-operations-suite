// ShiftReports.jsx — Shift report management page
// Shift reports document what happened during each work shift
// They follow an approval workflow: DRAFT → SUBMITTED → APPROVED
// Only one report can exist per shift per day (enforced by the backend)

import { useEffect, useState } from 'react';
import { shiftReportApi } from '../../services/api';
import { Plus, X } from 'lucide-react';

// Badge colors mapped to each report status
const STATUS_COLORS = {
  DRAFT:     'badge-gray',
  SUBMITTED: 'badge-blue',
  REVIEWED:  'badge-yellow',
  APPROVED:  'badge-green',
};

// Default empty form for creating a new shift report
const EMPTY_FORM = {
  reportDate: '', shiftName: 'DAY', supervisorName: '',
  totalUnitsProduced: '', totalDefects: '', overallOee: '',
  totalDowntimeMinutes: '', numberOfIncidents: '',
  workOrdersOpened: '', workOrdersCompleted: '',
  safetyIncidents: 0, safetyBriefingConducted: false,
  highlights: '', issues: '', actionsRequired: '',
};

export default function ShiftReports() {
  const [reports, setReports]     = useState([]);   // all shift reports
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);

  const load = () => {
    setLoading(true);
    shiftReportApi.getAll()
      .then(r => setReports(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Create a new shift report in DRAFT status
  const handleCreate = async () => {
    await shiftReportApi.create(form);
    setShowModal(false);
    load();
  };

  // Submit a draft report for review
  // Uses hardcoded 'Supervisor' as submittedBy for simplicity
  const handleSubmit = async (id) => {
    await shiftReportApi.submit(id, 'Supervisor');
    load();
  };

  // Approve a submitted report — final step in the workflow
  const handleApprove = async (id) => {
    await shiftReportApi.approve(id);
    load();
  };

  return (
    <div>
      {/* ── Page Header ───────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div className="page-title">Shift Reports</div>
          <div className="page-subtitle">Create and manage daily shift reports</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY_FORM); setShowModal(true); }}>
          <Plus size={16} /> New Report
        </button>
      </div>

      {/* ── Shift Reports Table ───────────────────────────── */}
      {loading ? <div className="loading">Loading...</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Shift</th>
                <th>Supervisor</th>
                <th>Units Produced</th>
                <th>OEE</th>
                <th>Downtime (min)</th>
                <th>Safety Incidents</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                    No shift reports yet
                  </td>
                </tr>
              ) : reports.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{r.reportDate}</td>
                  <td>{r.shiftName}</td>
                  <td>{r.supervisorName || '—'}</td>
                  <td>{r.totalUnitsProduced?.toLocaleString() || '—'}</td>
                  {/* OEE stored as decimal — multiply by 100 for percentage */}
                  <td>{r.overallOee ? Math.round(r.overallOee * 100) + '%' : '—'}</td>
                  <td>{r.totalDowntimeMinutes || 0}</td>
                  <td>{r.safetyIncidents || 0}</td>
                  <td>
                    <span className={`badge ${STATUS_COLORS[r.status]}`}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    {/* Submit button — only for DRAFT reports */}
                    {r.status === 'DRAFT' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSubmit(r.id)}
                      >
                        Submit
                      </button>
                    )}
                    {/* Approve button — only for SUBMITTED reports */}
                    {r.status === 'SUBMITTED' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleApprove(r.id)}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Create Shift Report Modal ─────────────────────── */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">New Shift Report</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Report Date *</label>
                <input
                  type="date"
                  value={form.reportDate}
                  onChange={e => setForm({ ...form, reportDate: e.target.value })}
                />
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
                <label>Supervisor</label>
                <input
                  value={form.supervisorName}
                  onChange={e => setForm({ ...form, supervisorName: e.target.value })}
                  placeholder="Jane Smith"
                />
              </div>
              <div className="form-group">
                <label>Units Produced</label>
                <input
                  type="number"
                  value={form.totalUnitsProduced}
                  onChange={e => setForm({ ...form, totalUnitsProduced: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Total Defects</label>
                <input
                  type="number"
                  value={form.totalDefects}
                  onChange={e => setForm({ ...form, totalDefects: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Downtime (minutes)</label>
                <input
                  type="number"
                  value={form.totalDowntimeMinutes}
                  onChange={e => setForm({ ...form, totalDowntimeMinutes: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>WOs Opened</label>
                <input
                  type="number"
                  value={form.workOrdersOpened}
                  onChange={e => setForm({ ...form, workOrdersOpened: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>WOs Completed</label>
                <input
                  type="number"
                  value={form.workOrdersCompleted}
                  onChange={e => setForm({ ...form, workOrdersCompleted: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Safety Incidents</label>
                <input
                  type="number"
                  value={form.safetyIncidents}
                  onChange={e => setForm({ ...form, safetyIncidents: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Safety Briefing Conducted</label>
                <select
                  value={form.safetyBriefingConducted}
                  onChange={e => setForm({ ...form, safetyBriefingConducted: e.target.value === 'true' })}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>

            {/* Text areas for qualitative shift summary */}
            <div className="form-group">
              <label>Highlights</label>
              <textarea
                rows={2}
                value={form.highlights}
                onChange={e => setForm({ ...form, highlights: e.target.value })}
                placeholder="What went well this shift?"
              />
            </div>
            <div className="form-group">
              <label>Issues</label>
              <textarea
                rows={2}
                value={form.issues}
                onChange={e => setForm({ ...form, issues: e.target.value })}
                placeholder="What problems were encountered?"
              />
            </div>
            <div className="form-group">
              <label>Actions Required</label>
              <textarea
                rows={2}
                value={form.actionsRequired}
                onChange={e => setForm({ ...form, actionsRequired: e.target.value })}
                placeholder="What needs to be followed up on?"
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Create Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}