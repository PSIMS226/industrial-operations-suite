// Downtime.jsx — Downtime event management page
// Logs equipment downtime events and tracks resolution
// Events stay "ongoing" (no end time) until resolved
// Duration is auto-calculated by the backend when resolved

import { useEffect, useState } from 'react';
import { downtimeApi, equipmentApi } from '../../services/api';
import { Plus, X } from 'lucide-react';

// All possible downtime categories from the backend enum
const CATEGORIES = [
  'PLANNED_MAINTENANCE', 'UNPLANNED_BREAKDOWN', 'CHANGEOVER',
  'NO_MATERIAL', 'NO_OPERATOR', 'QUALITY_ISSUE', 'PROCESS_ISSUE',
  'UTILITY_FAILURE', 'OTHER'
];

// Default empty form for logging a new downtime event
const EMPTY_FORM = {
  equipmentId: '', category: 'UNPLANNED_BREAKDOWN', reason: '',
  rootCause: '', reportedBy: '', startTime: '',
};

export default function Downtime() {
  const [events, setEvents]         = useState([]);   // downtime events
  const [equipment, setEquipment]   = useState([]);   // for equipment dropdown
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // event being resolved
  const [form, setForm]             = useState(EMPTY_FORM);
  const [resolveForm, setResolveForm] = useState({ resolvedBy: '', correctionTaken: '' });
  const [filter, setFilter]         = useState('all'); // all | ongoing

  // Load events — either all or just ongoing ones
  const load = () => {
    setLoading(true);
    const call = filter === 'ongoing'
      ? downtimeApi.getOngoing()
      : downtimeApi.getAll();

    Promise.all([call, equipmentApi.getAll()])
      .then(([evRes, eqRes]) => {
        setEvents(evRes.data.data || []);
        setEquipment(eqRes.data.data || []);
      }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  // Log a new downtime event
  // Equipment is sent as an object with just the id
  // If no start time provided, backend defaults to now
  const handleStart = async () => {
    const payload = {
      ...form,
      equipment: { id: parseInt(form.equipmentId) },
      startTime: form.startTime || new Date().toISOString(),
    };
    await downtimeApi.start(payload);
    setShowModal(false);
    load();
  };

  // Resolve an ongoing event — backend sets endTime and calculates duration
  const handleResolve = async () => {
    await downtimeApi.resolve(selectedEvent.id, resolveForm);
    setShowResolveModal(false);
    load();
  };

  // Show green Resolved or red Ongoing badge based on endTime
  const statusBadge = (event) => {
    if (!event.endTime) return <span className="badge badge-red">Ongoing</span>;
    return <span className="badge badge-green">Resolved</span>;
  };

  return (
    <div>
      {/* ── Page Header ───────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div className="page-title">Downtime</div>
          <div className="page-subtitle">Log and resolve equipment downtime events</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY_FORM); setShowModal(true); }}>
          <Plus size={16} /> Log Downtime
        </button>
      </div>

      {/* ── Filter ────────────────────────────────────────── */}
      <div className="filters">
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Events</option>
          <option value="ongoing">Ongoing Only</option>
        </select>
      </div>

      {/* ── Downtime Events Table ─────────────────────────── */}
      {loading ? <div className="loading">Loading...</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Category</th>
                <th>Reason</th>
                <th>Started</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Reported By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                    No downtime events found
                  </td>
                </tr>
              ) : events.map(ev => (
                <tr key={ev.id}>
                  <td style={{ fontWeight: 600 }}>{ev.equipment?.name || '—'}</td>
                  <td>
                    <span className="badge badge-yellow">
                      {ev.category?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>{ev.reason || '—'}</td>
                  <td>{ev.startTime ? new Date(ev.startTime).toLocaleString() : '—'}</td>
                  {/* Duration is null until the event is resolved */}
                  <td>{ev.durationMinutes ? `${ev.durationMinutes} min` : '—'}</td>
                  <td>{statusBadge(ev)}</td>
                  <td>{ev.reportedBy || '—'}</td>
                  <td>
                    {/* Resolve button only shows for ongoing events */}
                    {!ev.endTime && (
                      <button className="btn btn-primary btn-sm" onClick={() => {
                        setSelectedEvent(ev);
                        setResolveForm({ resolvedBy: '', correctionTaken: '' });
                        setShowResolveModal(true);
                      }}>
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Log Downtime Modal ────────────────────────────── */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Log Downtime Event</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Equipment *</label>
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
                <label>Category *</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <input
                  value={form.reason}
                  onChange={e => setForm({ ...form, reason: e.target.value })}
                  placeholder="Motor overheating"
                />
              </div>
              <div className="form-group">
                <label>Reported By</label>
                <input
                  value={form.reportedBy}
                  onChange={e => setForm({ ...form, reportedBy: e.target.value })}
                  placeholder="John Smith"
                />
              </div>
              <div className="form-group">
                <label>Start Time (blank = now)</label>
                <input
                  type="datetime-local"
                  value={form.startTime}
                  onChange={e => setForm({ ...form, startTime: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Root Cause</label>
              <textarea
                rows={2}
                value={form.rootCause}
                onChange={e => setForm({ ...form, rootCause: e.target.value })}
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleStart}>Log Event</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Resolve Downtime Modal ────────────────────────── */}
      {/* Records who fixed it and what correction was taken  */}
      {showResolveModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">
                Resolve — {selectedEvent?.equipment?.name}
              </div>
              <button className="modal-close" onClick={() => setShowResolveModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="form-group">
              <label>Resolved By</label>
              <input
                value={resolveForm.resolvedBy}
                onChange={e => setResolveForm({ ...resolveForm, resolvedBy: e.target.value })}
                placeholder="Jane Doe"
              />
            </div>
            <div className="form-group">
              <label>Correction Taken</label>
              <textarea
                rows={3}
                value={resolveForm.correctionTaken}
                onChange={e => setResolveForm({ ...resolveForm, correctionTaken: e.target.value })}
                placeholder="Replaced motor belt, tested at full speed"
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowResolveModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleResolve}>Mark Resolved</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}