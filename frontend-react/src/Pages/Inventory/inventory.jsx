// Inventory.jsx — Inventory management page
// Tracks spare parts, consumables and tools
// Automatically flags items at or below their reorder point
// Stock can be adjusted up (receiving) or down (consuming)

import { useEffect, useState } from 'react';
import { inventoryApi } from '../../services/api';
import { Plus, X } from 'lucide-react';

// Default empty form for creating a new inventory item
const EMPTY_FORM = {
  sku: '', name: '', description: '', category: '', unitOfMeasure: 'EACH',
  quantityOnHand: 0, reorderPoint: 0, reorderQuantity: 0,
  unitCost: '', supplier: '', supplierPartNumber: '', storageLocation: '',
};

export default function Inventory() {
  const [items, setItems]           = useState([]);   // all inventory items
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // item being adjusted
  const [form, setForm]             = useState(EMPTY_FORM);
  const [editId, setEditId]         = useState(null);
  const [adjustForm, setAdjustForm] = useState({ delta: '', reason: '' });
  const [filter, setFilter]         = useState('all'); // all | low | out

  // Load items based on current filter
  // Three different endpoints depending on what we want to see
  const load = () => {
    setLoading(true);
    const call = filter === 'low' ? inventoryApi.getLowStock()
               : filter === 'out' ? inventoryApi.getOutOfStock()
               : inventoryApi.getAll();
    call.then(r => setItems(r.data.data || []))
        .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setShowModal(true); };
  const openEdit   = (item) => { setForm({ ...item }); setEditId(item.id); setShowModal(true); };

  const handleSubmit = async () => {
    if (editId) await inventoryApi.update(editId, form);
    else        await inventoryApi.create(form);
    setShowModal(false);
    load();
  };

  // Adjust stock quantity — positive delta adds stock, negative consumes it
  // Backend validates that stock never goes below zero
  const handleAdjust = async () => {
    await inventoryApi.adjustQuantity(
      selectedItem.id,
      parseInt(adjustForm.delta),
      adjustForm.reason
    );
    setShowAdjustModal(false);
    load();
  };

  // Determine stock status badge based on quantity vs reorder point
  const stockStatus = (item) => {
    if (item.quantityOnHand === 0)                          return { label: 'Out of Stock', cls: 'badge-red'    };
    if (item.quantityOnHand <= item.reorderPoint)           return { label: 'Low Stock',    cls: 'badge-yellow' };
    return                                                         { label: 'In Stock',     cls: 'badge-green'  };
  };

  return (
    <div>
      {/* ── Page Header ───────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div className="page-title">Inventory</div>
          <div className="page-subtitle">Track parts, consumables and tools</div>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* ── Stock Filter ──────────────────────────────────── */}
      <div className="filters">
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Items</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {/* ── Inventory Table ───────────────────────────────── */}
      {loading ? <div className="loading">Loading...</div> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Qty On Hand</th>
                <th>Reorder Point</th>
                <th>Status</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                    No items found
                  </td>
                </tr>
              ) : items.map(item => {
                const { label, cls } = stockStatus(item);
                return (
                  <tr key={item.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{item.sku}</td>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                    <td>{item.category || '—'}</td>
                    {/* Bold quantity so it stands out at a glance */}
                    <td style={{ fontWeight: 700 }}>{item.quantityOnHand}</td>
                    <td>{item.reorderPoint}</td>
                    <td><span className={`badge ${cls}`}>{label}</span></td>
                    <td>{item.storageLocation || '—'}</td>
                    <td style={{ display: 'flex', gap: 6 }}>
                      {/* Adjust button opens the stock adjustment modal */}
                      <button className="btn btn-secondary btn-sm" onClick={() => {
                        setSelectedItem(item);
                        setAdjustForm({ delta: '', reason: '' });
                        setShowAdjustModal(true);
                      }}>
                        Adjust
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(item)}>
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Create / Edit Modal ───────────────────────────── */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{editId ? 'Edit Item' : 'Add Inventory Item'}</div>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>SKU *</label>
                <input
                  value={form.sku}
                  onChange={e => setForm({ ...form, sku: e.target.value })}
                  placeholder="PART-001"
                />
              </div>
              <div className="form-group">
                <label>Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Conveyor Belt 10m"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  placeholder="SPARE_PART"
                />
              </div>
              <div className="form-group">
                <label>Unit of Measure</label>
                <input
                  value={form.unitOfMeasure}
                  onChange={e => setForm({ ...form, unitOfMeasure: e.target.value })}
                  placeholder="EACH"
                />
              </div>
              <div className="form-group">
                <label>Qty On Hand</label>
                <input
                  type="number"
                  value={form.quantityOnHand}
                  onChange={e => setForm({ ...form, quantityOnHand: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Reorder Point</label>
                <input
                  type="number"
                  value={form.reorderPoint}
                  onChange={e => setForm({ ...form, reorderPoint: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Reorder Qty</label>
                <input
                  type="number"
                  value={form.reorderQuantity}
                  onChange={e => setForm({ ...form, reorderQuantity: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Unit Cost ($)</label>
                <input
                  type="number"
                  value={form.unitCost}
                  onChange={e => setForm({ ...form, unitCost: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Supplier</label>
                <input
                  value={form.supplier}
                  onChange={e => setForm({ ...form, supplier: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Storage Location</label>
                <input
                  value={form.storageLocation}
                  onChange={e => setForm({ ...form, storageLocation: e.target.value })}
                  placeholder="Bin A-12"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editId ? 'Save Changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Adjust Stock Modal ────────────────────────────── */}
      {/* Use positive number to add stock, negative to consume */}
      {showAdjustModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Adjust Stock — {selectedItem?.name}</div>
              <button className="modal-close" onClick={() => setShowAdjustModal(false)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ color: 'var(--text-muted)', marginBottom: 16, fontSize: 13 }}>
              Current stock: <strong style={{ color: 'var(--text-primary)' }}>
                {selectedItem?.quantityOnHand}
              </strong>. Use positive to add, negative to consume.
            </p>

            <div className="form-group">
              <label>Quantity Change</label>
              <input
                type="number"
                value={adjustForm.delta}
                onChange={e => setAdjustForm({ ...adjustForm, delta: e.target.value })}
                placeholder="+10 or -5"
              />
            </div>
            <div className="form-group">
              <label>Reason</label>
              <input
                value={adjustForm.reason}
                onChange={e => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                placeholder="Received shipment"
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAdjustModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdjust}>Apply Adjustment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}