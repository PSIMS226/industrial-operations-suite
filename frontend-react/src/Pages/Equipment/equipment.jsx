// Equipment.jsx — Equipment management page
// Lists all factory equipment with status badges
// Allows creating, editing and changing equipment status
// Status can be changed inline directly from the table dropdown

import { useEffect, useState } from 'react';
import { equipmentApi } from '../../services/api';
import { Plus, X } from 'lucide-react';

// Default empty form used when creating new equipment
const EMPTY_FORM = {
  name: '', equipmentCode: '', type: '', location: '',
  manufacturer: '', modelNumber: '', serialNumber: '',
  status: 'OPERATIONAL', maintenanceIntervalDays: '', notes: '',
};

export default function Equipment() {
  const [equipment, setEquipment] = useState([]);   // list of all equipment
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false); // controls modal visibility
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editId, setEditId]       = useState(null);  // null = creating, number = editing
  const [filterStatus, setFilterStatus] = useState('');

  // Load equipment — reruns whenever filterStatus changes
  const load = () => {
    setLoading(true);
    equipmentApi.getAll(filterStatus || undefined)
      .then(r => setEquipment(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filterStatus]);

  // Open modal in CREATE mode — blank form, no editId
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowModal(true);
  };

  // Open modal in EDIT mode — prefill form with existing data
  const openEdit = (eq) => {
    setForm({ ...eq, maintenanceIntervalDays: eq.maintenanceIntervalDays || '' });
    setEditId(eq.id);
    setShowModal(true);
  };

  // Submit form — calls create or update depending on editId
  const handleSubmit = async () => {
    if (editId) await equipmentApi.update(editId, form);
    else        await equipmentApi.create(form);
    setShowModal(false);
    load(); // Refresh the table
  };

  // Update status directly from the table dropdown
  const handleStatusChange = async (id, status) => {
    await equipmentApi.updateStatus(id, status);
    load();
  };

  return (
    <div>
      {/* ── Page Header ───────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div className="page-title">Equipment</div>
          <div className="page-subtitle">Manage all factory equipment</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Equipment
        </button>
      </div>

      {/* ── Status Filter ─────────────────────────────────── */}
      <div className="filters">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="OPERATIONAL">Operational</option>
          <option value="UNDER_MAINTENANCE">Under Maintenance</option>
          <option value="OFFLINE">Offline</option>
          <option value="DECOMMISSIONED">Decommissioned</option>
        </select>
      </div>

      {/* ── Equipment Table ───────────────────────────────── */}
      {loading ? <div className="loading">Loading...</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Type</th>
                <th>Location</th>
                <th>Status</th>
                <th>Manufacturer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipment.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                    No equipment found
                  </td>
                </tr>
              ) : equipment.map(eq => (
                <tr key={eq.id}>
                  <td style={{ fontWeight: 600 }}>{eq.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{eq.equipmentCode || '—'}</td>
                  <td>{eq.type || '—'}</td>
                  <td>{eq.location || '—'}</td>
                  <td>
                    {/* Inline status dropdown — updates immediately on change */}
                    <select
                      value={eq.status}
                      onChange={e => handleStatusChange(eq.id, e.target.value)}
                      style={{ width: 'auto', padding: '3px 8px', fontSize: 12 }}
                    >
                      <option value="OPERATIONAL">Operational</option>
                      <option value="UNDER_MAINTENANCE">Under Maintenance</option>
                      <option value="OFFLINE">Offline</option>
                      <option value="DECOMMISSIONED">Decommissioned</option>
                    </select>
                  </td>
                  <td>{eq.manufacturer || '—'}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(eq)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Create / Edit Modal ───────────────────────────── */}
      {/* Conditionally renders only when showModal is true   */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">
                {editId ? 'Edit Equipment' : 'Add Equipment'}
              </div>
              {/* X button closes the modal without saving */}
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Two column grid layout for the form fields */}
            <div className="grid-2">
              <div className="form-group">
                <label>Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="CNC Machine #1"
                />
              </div>
              <div className="form-group">
                <label>Equipment Code</label>
                <input
                  value={form.equipmentCode}
                  onChange={e => setForm({ ...form, equipmentCode: e.target.value })}
                  placeholder="EQ-001"
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <input
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  placeholder="CNC_MACHINE"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="Zone A"
                />
              </div>
              <div className="form-group">
                <label>Manufacturer</label>
                <input
                  value={form.manufacturer}
                  onChange={e => setForm({ ...form, manufacturer: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Model Number</label>
                <input
                  value={form.modelNumber}
                  onChange={e => setForm({ ...form, modelNumber: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Serial Number</label>
                <input
                  value={form.serialNumber}
                  onChange={e => setForm({ ...form, serialNumber: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Maintenance Interval (days)</label>
                <input
                  type="number"
                  value={form.maintenanceIntervalDays}
                  onChange={e => setForm({ ...form, maintenanceIntervalDays: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editId ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}