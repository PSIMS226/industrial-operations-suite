// Dashboard.jsx — Main overview page
// Shows real-time KPIs, active alerts, OEE gauge and ongoing downtime
// Pulls data from multiple API endpoints simultaneously using Promise.allSettled
// allSettled means if one API call fails, the others still load

import { useEffect, useState } from 'react';
import { equipmentApi, workOrderApi, alertApi, productionApi, downtimeApi } from '../../services/api';

// Recharts components for the OEE radial gauge chart
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  // State variables — each holds data from one API call
  const [kpis, setKpis]         = useState(null);   // OEE, availability, performance, quality
  const [alerts, setAlerts]     = useState([]);      // active alerts
  const [ongoing, setOngoing]   = useState([]);      // ongoing downtime events
  const [woStats, setWoStats]   = useState([]);      // open work orders
  const [equipStats, setEquipStats] = useState([]); // all equipment
  const [loading, setLoading]   = useState(true);

  // useEffect runs once when the component mounts (loads for the first time)
  useEffect(() => {
    // Fire all API calls at once — faster than one at a time
    Promise.allSettled([
      productionApi.getKpis(),
      alertApi.getAll(),
      downtimeApi.getOngoing(),
      workOrderApi.getAll({ status: 'OPEN' }),
      equipmentApi.getAll(),
    ]).then(([kpiRes, alertRes, downtimeRes, woRes, equipRes]) => {
      // Only set state if the call succeeded
      if (kpiRes.status === 'fulfilled')     setKpis(kpiRes.value.data.data);
      if (alertRes.status === 'fulfilled')   setAlerts(alertRes.value.data.data?.slice(0, 5) || []);
      if (downtimeRes.status === 'fulfilled') setOngoing(downtimeRes.value.data.data || []);
      if (woRes.status === 'fulfilled')      setWoStats(woRes.value.data.data || []);
      if (equipRes.status === 'fulfilled')   setEquipStats(equipRes.value.data.data || []);
      setLoading(false);
    });
  }, []); // Empty array = run once on mount only

  // Convert decimal OEE values (0.0-1.0) to percentages (0-100)
  const oeePercent   = kpis?.avgOee          ? Math.round(kpis.avgOee * 100)          : 0;
  const availPercent = kpis?.avgAvailability ? Math.round(kpis.avgAvailability * 100) : 0;
  const perfPercent  = kpis?.avgPerformance  ? Math.round(kpis.avgPerformance * 100)  : 0;
  const qualPercent  = kpis?.avgQuality      ? Math.round(kpis.avgQuality * 100)      : 0;

  // Data format required by Recharts RadialBarChart
  const oeeData = [{ name: 'OEE', value: oeePercent, fill: '#3b82f6' }];

  // Returns the correct badge CSS class based on alert severity
  const severityColor = (s) => {
    if (s === 'CRITICAL' || s === 'EMERGENCY') return 'badge-red';
    if (s === 'WARNING') return 'badge-yellow';
    return 'badge-blue';
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      {/* ── Page Header ───────────────────────────────────── */}
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Real-time operations overview</div>
        </div>
      </div>

      {/* ── Stat Cards ────────────────────────────────────── */}
      {/* Six quick-glance numbers at the top of the page    */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Equipment Online</div>
          <div className="stat-value">
            {equipStats.filter(e => e.status === 'OPERATIONAL').length}
          </div>
          <div className="stat-sub">of {equipStats.length} total</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Open Work Orders</div>
          <div className="stat-value">{woStats.length}</div>
          <div className="stat-sub">awaiting action</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Active Alerts</div>
          <div className="stat-value text-danger">{alerts.length}</div>
          <div className="stat-sub">require attention</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Ongoing Downtime</div>
          <div className="stat-value text-warning">{ongoing.length}</div>
          <div className="stat-sub">active events</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Units Produced</div>
          <div className="stat-value">
            {kpis?.totalUnitsProduced?.toLocaleString() || '—'}
          </div>
          <div className="stat-sub">last 30 days</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Defect Rate</div>
          <div className="stat-value">
            {kpis?.defectRate ? (kpis.defectRate * 100).toFixed(1) + '%' : '—'}
          </div>
          <div className="stat-sub">last 30 days</div>
        </div>
      </div>

      {/* ── OEE Gauge + Active Alerts ─────────────────────── */}
      <div className="grid-2 mb-6">

        {/* OEE Radial Chart */}
        <div className="card">
          <div className="card-title">Overall OEE</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>

            {/* Recharts radial bar acts as a circular gauge */}
            <div style={{ width: "140px", height: "140px", minWidth: "140px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%" cy="50%"
                  innerRadius="60%" outerRadius="90%"
                  data={oeeData}
                  startAngle={90} endAngle={-270}
                >
                  <RadialBar dataKey="value" cornerRadius={4} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            {/* OEE number and breakdown */}
            <div>
              <div style={{ fontSize: 48, fontWeight: 700, color: '#3b82f6', lineHeight: 1 }}>
                {oeePercent}%
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>
                Overall Equipment Effectiveness
              </div>
              {/* OEE = Availability × Performance × Quality */}
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 32 }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Availability</span>
                  <span style={{ fontWeight: 700, color: '#22c55e' }}>{availPercent}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 32 }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Performance</span>
                  <span style={{ fontWeight: 700, color: '#f59e0b' }}>{perfPercent}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 32 }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Quality</span>
                  <span style={{ fontWeight: 700, color: '#3b82f6' }}>{qualPercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Alerts List */}
        <div className="card">
          <div className="card-title">Active Alerts</div>
          {alerts.length === 0 ? (
            <div className="empty-state">No active alerts</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {alerts.map(alert => (
                <div key={alert.id} style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{alert.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {alert.type}
                    </div>
                  </div>
                  <span className={`badge ${severityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Ongoing Downtime Table ─────────────────────────── */}
      {/* Only renders if there are active downtime events     */}
      {ongoing.length > 0 && (
        <div className="card mb-6">
          <div className="card-title" style={{ color: 'var(--warning)' }}>
            ⚠ Ongoing Downtime Events
          </div>
          <div className="table-wrap" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Category</th>
                  <th>Reason</th>
                  <th>Started</th>
                  <th>Reported By</th>
                </tr>
              </thead>
              <tbody>
                {ongoing.map(d => (
                  <tr key={d.id}>
                    <td>{d.equipment?.name || '—'}</td>
                    <td><span className="badge badge-yellow">{d.category}</span></td>
                    <td>{d.reason || '—'}</td>
                    <td>{new Date(d.startTime).toLocaleString()}</td>
                    <td>{d.reportedBy || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
