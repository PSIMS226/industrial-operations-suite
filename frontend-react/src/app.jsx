// App.jsx — Root component of the entire application
// Sets up the sidebar navigation and page routing
// Every page in the app is registered here

import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

// Lucide icons used in the sidebar navigation
import {
  LayoutDashboard, // Dashboard icon
  Wrench,          // Equipment icon
  ClipboardList,   // Work Orders icon
  Package,         // Inventory icon
  AlertTriangle,   // Downtime icon
  BarChart2,       // Production icon
  FileText,        // Shift Reports icon
  Bell,            // Alerts icon
            // Logo icon in sidebar header
} from 'lucide-react';

// Import every page component
import Dashboard    from './pages/Dashboard/Dashboard';
import Equipment    from './pages/Equipment/Equipment';
import WorkOrders   from './pages/WorkOrders/WorkOrders';
import Inventory    from './pages/Inventory/Inventory';
import Downtime     from './pages/Downtime/Downtime';
import Production   from './pages/Production/Production';
import ShiftReports from './pages/ShiftReports/ShiftReports';
import Alerts       from './pages/Alerts/Alerts';
import Logo         from './components/Logo';

import './App.css';

// Navigation items array — each item maps to a sidebar link and a route
// Adding a new page = add one object here + one <Route> below
const navItems = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard'     },
  { to: '/equipment',    icon: Wrench,           label: 'Equipment'     },
  { to: '/workorders',   icon: ClipboardList,    label: 'Work Orders'   },
  { to: '/inventory',    icon: Package,          label: 'Inventory'     },
  { to: '/downtime',     icon: AlertTriangle,    label: 'Downtime'      },
  { to: '/production',   icon: BarChart2,        label: 'Production'    },
  { to: '/shiftreports', icon: FileText,         label: 'Shift Reports' },
  { to: '/alerts',       icon: Bell,             label: 'Alerts'        },
];

export default function App() {
  return (
    // BrowserRouter enables client-side navigation without page reloads
    <Router>
      <div className="app-layout">

        {/* ── Sidebar ─────────────────────────────────────── */}
        <aside className="sidebar">

          {/* Logo and app name at the top of the sidebar */}
          <div className="sidebar-header">
                <span className="sidebar-title">Industrial<br />Operations Suite</span>
                 <div className="logo-block">
                 <Logo size={56} />
                 <span className="logo-text">PJS</span>
    </div>
</div>

          {/* Navigation links — NavLink auto-adds "active" class
              when the current URL matches the "to" prop          */}
          <nav className="sidebar-nav">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}  // "end" prevents Dashboard staying active on all pages
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Version number at the bottom of the sidebar */}
          <div className="sidebar-footer">
            <span>v1.0.0</span>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────── */}
        {/* Routes map URL paths to page components            */}
        <main className="main-content">
          <Routes>
            <Route path="/"             element={<Dashboard />}    />
            <Route path="/equipment"    element={<Equipment />}    />
            <Route path="/workorders"   element={<WorkOrders />}   />
            <Route path="/inventory"    element={<Inventory />}    />
            <Route path="/downtime"     element={<Downtime />}     />
            <Route path="/production"   element={<Production />}   />
            <Route path="/shiftreports" element={<ShiftReports />} />
            <Route path="/alerts"       element={<Alerts />}       />
          </Routes>
        </main>

      </div>
    </Router>
  );
}