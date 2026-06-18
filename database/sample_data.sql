-- ============================================================
-- Sample Data for Industrial Operations Suite
-- Run this against the industrial_ops database after the
-- Spring Boot app has created the tables (ddl-auto=update)
-- ============================================================

-- ── Equipment ────────────────────────────────────────────────
INSERT INTO equipment (name, equipment_code, type, location, manufacturer, model_number, serial_number, status, installation_date, last_maintenance_date, next_maintenance_due, maintenance_interval_days, notes, created_at, updated_at)
VALUES
('CNC Mill #1', 'EQ-001', 'CNC_MACHINE', 'Zone A', 'Haas Automation', 'VF-2SS', 'SN-10234', 'OPERATIONAL', '2022-03-15 00:00:00', '2026-04-01 00:00:00', '2026-07-01 00:00:00', 90, 'Primary milling machine for precision parts', now(), now()),
('Conveyor Belt A', 'EQ-002', 'CONVEYOR', 'Zone A', 'Dorner', '2200 Series', 'SN-44521', 'OPERATIONAL', '2021-08-10 00:00:00', '2026-05-01 00:00:00', '2026-08-01 00:00:00', 90, 'Main assembly line conveyor', now(), now()),
('Hydraulic Press #2', 'EQ-003', 'PRESS', 'Zone B', 'Schuler', 'MSP 800', 'SN-77821', 'UNDER_MAINTENANCE', '2020-01-20 00:00:00', '2026-06-01 00:00:00', '2026-06-15 00:00:00', 60, 'Currently undergoing scheduled hydraulic seal replacement', now(), now()),
('Robotic Welder R1', 'EQ-004', 'ROBOT', 'Zone B', 'FANUC', 'ARC Mate 100iD', 'SN-90345', 'OPERATIONAL', '2023-02-01 00:00:00', '2026-05-15 00:00:00', '2026-08-15 00:00:00', 90, 'Automated welding cell for chassis frames', now(), now()),
('Cooling Pump P3', 'EQ-005', 'PUMP', 'Zone C', 'Grundfos', 'CR 32', 'SN-33012', 'OFFLINE', '2019-11-05 00:00:00', '2026-03-01 00:00:00', '2026-06-01 00:00:00', 60, 'Offline due to bearing failure, awaiting replacement part', now(), now()),
('Packaging Line B', 'EQ-006', 'PACKAGING', 'Zone C', 'Bosch', 'SVE 2520', 'SN-55678', 'OPERATIONAL', '2022-09-12 00:00:00', '2026-05-20 00:00:00', '2026-08-20 00:00:00', 90, 'End-of-line shrink wrap and palletizing', now(), now()),
('Air Compressor C1', 'EQ-007', 'COMPRESSOR', 'Utility Room', 'Atlas Copco', 'GA 30+', 'SN-66112', 'OPERATIONAL', '2021-04-22 00:00:00', '2026-04-15 00:00:00', '2026-07-15 00:00:00', 90, 'Supplies shop air to Zones A and B', now(), now()),
('CNC Lathe #3', 'EQ-008', 'CNC_MACHINE', 'Zone A', 'Mazak', 'QT-250MSY', 'SN-12998', 'OPERATIONAL', '2022-06-18 00:00:00', '2026-05-10 00:00:00', '2026-08-10 00:00:00', 90, 'Turning operations for shaft components', now(), now());

-- ── Inventory Items ──────────────────────────────────────────
INSERT INTO inventory_items (sku, name, description, category, unit_of_measure, quantity_on_hand, reorder_point, reorder_quantity, unit_cost, supplier, supplier_part_number, storage_location, active, created_at, updated_at)
VALUES
('PART-001', 'Hydraulic Seal Kit', 'Replacement seal kit for Schuler MSP series presses', 'SPARE_PART', 'EACH', 4, 5, 10, 145.50, 'Schuler Parts Direct', 'SCH-SEAL-800', 'Bin A-12', true, now(), now()),
('PART-002', 'Conveyor Belt 10m', 'Replacement belting for Dorner 2200 series', 'SPARE_PART', 'EACH', 2, 2, 4, 320.00, 'Dorner Supply Co', 'DOR-BELT-2200', 'Bin A-15', true, now(), now()),
('PART-003', 'Pump Bearing Set', 'Bearing set for Grundfos CR 32 pumps', 'SPARE_PART', 'EACH', 0, 3, 6, 89.99, 'Grundfos OEM', 'GRU-BRG-CR32', 'Bin C-04', true, now(), now()),
('PART-004', 'Welding Wire Spool', 'ER70S-6 0.045in welding wire, 33lb spool', 'CONSUMABLE', 'EACH', 18, 10, 20, 62.00, 'Lincoln Electric', 'LE-ER70S6-045', 'Bin B-08', true, now(), now()),
('PART-005', 'Hydraulic Oil ISO 46', '5 gallon pail hydraulic fluid', 'CONSUMABLE', 'EACH', 12, 8, 15, 78.25, 'Mobil Industrial', 'MOB-DTE25', 'Bin C-01', true, now(), now()),
('PART-006', 'Air Filter Element', 'Replacement filter for Atlas Copco GA series', 'SPARE_PART', 'EACH', 6, 4, 8, 41.75, 'Atlas Copco Parts', 'AC-FILT-GA30', 'Bin U-02', true, now(), now()),
('PART-007', 'CNC Cutting Inserts', 'Carbide inserts for turning operations, box of 10', 'CONSUMABLE', 'BOX', 25, 15, 30, 112.00, 'Sandvik Coromant', 'SAN-CNMG-432', 'Bin A-20', true, now(), now()),
('PART-008', 'Safety Gloves (Cut Resistant)', 'Level 5 cut resistant gloves, case of 12 pairs', 'CONSUMABLE', 'BOX', 3, 5, 10, 54.00, 'Ansell Industrial', 'ANS-HYFLEX-11', 'Bin S-01', true, now(), now()),
('PART-009', 'Shrink Wrap Film', '20in x 5000ft stretch wrap rolls', 'CONSUMABLE', 'EACH', 8, 6, 12, 38.50, 'Bosch Packaging Supply', 'BOS-WRAP-20', 'Bin C-10', true, now(), now()),
('PART-010', 'Robot Torch Tips', 'Replacement contact tips for FANUC ARC Mate welder', 'SPARE_PART', 'BOX', 1, 4, 8, 67.40, 'FANUC America', 'FAN-TIP-100ID', 'Bin B-11', true, now(), now());

-- ── Work Orders ──────────────────────────────────────────────
INSERT INTO work_orders (work_order_number, title, description, type, status, priority, equipment_id, assigned_technician, scheduled_date, started_at, completed_at, estimated_duration_minutes, actual_duration_minutes, completion_notes, labor_cost, parts_cost, created_at, updated_at)
VALUES
('WO-20260601-A1B2C', 'Hydraulic seal replacement', 'Replace worn hydraulic seals on main ram cylinder', 'CORRECTIVE', 'IN_PROGRESS', 'HIGH', 3, 'Marcus Reed', '2026-06-10 08:00:00', '2026-06-10 08:15:00', NULL, 240, NULL, NULL, NULL, NULL, now(), now()),
('WO-20260528-D3E4F', 'Quarterly CNC calibration', 'Routine calibration check on VF-2SS mill', 'PREVENTIVE', 'COMPLETED', 'MEDIUM', 1, 'Sandra Liu', '2026-05-28 09:00:00', '2026-05-28 09:05:00', '2026-05-28 11:30:00', 150, 145, 'Calibration within spec, minor backlash adjustment made', 180.00, 0.00, now(), now()),
('WO-20260605-G5H6I', 'Cooling pump bearing failure', 'Pump P3 making excessive noise, bearings worn', 'EMERGENCY', 'OPEN', 'CRITICAL', 5, NULL, '2026-06-12 07:00:00', NULL, NULL, 180, NULL, NULL, NULL, NULL, now(), now()),
('WO-20260520-J7K8L', 'Conveyor belt inspection', 'Monthly visual inspection of belt tracking and tension', 'INSPECTION', 'COMPLETED', 'LOW', 2, 'Marcus Reed', '2026-05-20 13:00:00', '2026-05-20 13:00:00', '2026-05-20 13:45:00', 60, 45, 'Belt tracking adjusted slightly, no defects found', 45.00, 0.00, now(), now()),
('WO-20260609-M9N0O', 'Robot welder torch replacement', 'Replace worn contact tips and inspect liner', 'CORRECTIVE', 'OPEN', 'MEDIUM', 4, NULL, '2026-06-13 10:00:00', NULL, NULL, 90, NULL, NULL, NULL, NULL, now(), now()),
('WO-20260530-P1Q2R', 'Air compressor filter change', 'Replace intake and oil separator filters', 'PREVENTIVE', 'COMPLETED', 'LOW', 7, 'Sandra Liu', '2026-05-30 07:30:00', '2026-05-30 07:30:00', '2026-05-30 08:15:00', 45, 45, 'Filters replaced, pressure readings normal', 35.00, 41.75, now(), now()),
('WO-20260611-S3T4U', 'Packaging line jam clearing', 'Shrink wrap unit jammed during evening shift', 'CORRECTIVE', 'COMPLETED', 'HIGH', 6, 'Marcus Reed', '2026-06-11 18:00:00', '2026-06-11 18:10:00', '2026-06-11 18:50:00', 60, 40, 'Cleared film jam, replaced torn wrap roll', 30.00, 38.50, now(), now());

-- ── Downtime Events ──────────────────────────────────────────
INSERT INTO downtime_events (equipment_id, category, reason, root_cause, start_time, end_time, duration_minutes, reported_by, resolved_by, status, work_order_id, correction_taken, created_at)
VALUES
(5, 'UNPLANNED_BREAKDOWN', 'Pump bearing failure', 'Bearings exceeded service life, lubrication schedule was missed', '2026-06-10 06:45:00', NULL, NULL, 'Night Shift Operator', NULL, 'OPEN', 3, NULL, now()),
(3, 'PLANNED_MAINTENANCE', 'Hydraulic seal replacement', NULL, '2026-06-10 08:00:00', NULL, NULL, 'Marcus Reed', NULL, 'IN_PROGRESS', 1, NULL, now()),
(6, 'UNPLANNED_BREAKDOWN', 'Shrink wrap jam', 'Film roll tore during high-speed wrap cycle', '2026-06-11 18:00:00', '2026-06-11 18:50:00', 50, 'Evening Shift Lead', 'Marcus Reed', 'RESOLVED', 7, 'Cleared jam, replaced film roll, ran test cycle successfully', now()),
(2, 'CHANGEOVER', 'Product changeover - SKU 4521 to SKU 4530', NULL, '2026-06-09 14:00:00', '2026-06-09 14:25:00', 25, 'Day Shift Lead', 'Day Shift Lead', 'RESOLVED', NULL, 'Standard changeover procedure followed', now()),
(1, 'NO_MATERIAL', 'Waiting on raw stock delivery', 'Supplier shipment delayed by one day', '2026-06-08 11:00:00', '2026-06-08 13:30:00', 150, 'Sandra Liu', 'Sandra Liu', 'RESOLVED', NULL, 'Used buffer stock from Zone B until delivery arrived', now()),
(4, 'QUALITY_ISSUE', 'Weld porosity detected', 'Shielding gas flow rate drifted below spec', '2026-06-07 09:15:00', '2026-06-07 10:00:00', 45, 'QA Inspector', 'Marcus Reed', 'RESOLVED', NULL, 'Recalibrated gas flow regulator, re-ran affected parts', now());

-- ── Production Logs ──────────────────────────────────────────
INSERT INTO production_logs (equipment_id, product_name, product_code, shift_name, operator_name, period_start, period_end, target_units, produced_units, defective_units, scrap_units, planned_downtime_minutes, unplanned_downtime_minutes, availability, performance, quality, oee, notes, created_at)
VALUES
(1, 'Bracket Assembly A', 'WGT-101', 'DAY', 'Carlos Mendez', '2026-06-09 06:00:00', '2026-06-09 14:00:00', 500, 480, 12, 3, 30, 0, 0.9375, 0.96, 0.975, 0.8775, 'Smooth run, minor tool wear adjustment mid-shift', now()),
(1, 'Bracket Assembly A', 'WGT-101', 'NIGHT', 'Priya Patel', '2026-06-09 22:00:00', '2026-06-10 06:00:00', 500, 410, 28, 8, 30, 60, 0.8125, 0.82, 0.9317, 0.6203, 'Lost time to unplanned changeover and quality hold', now()),
(2, 'Conveyor Output - Subassembly B', 'WGT-205', 'DAY', 'Aisha Brown', '2026-06-10 06:00:00', '2026-06-10 14:00:00', 800, 790, 5, 2, 15, 0, 0.9688, 0.9875, 0.9937, 0.9509, 'Excellent shift, near target output', now()),
(4, 'Welded Chassis Frame', 'WGT-330', 'DAY', 'Marcus Reed', '2026-06-07 06:00:00', '2026-06-07 14:00:00', 120, 108, 6, 1, 0, 45, 0.9063, 0.90, 0.9444, 0.7704, 'Quality issue mid-shift reduced output', now()),
(6, 'Packaged Pallet Units', 'WGT-410', 'EVENING', 'Devon Carter', '2026-06-11 14:00:00', '2026-06-11 22:00:00', 200, 175, 4, 1, 0, 50, 0.8958, 0.875, 0.9714, 0.7613, 'Shrink wrap jam reduced output significantly', now()),
(8, 'Shaft Component C', 'WGT-512', 'DAY', 'Sandra Liu', '2026-06-08 06:00:00', '2026-06-08 14:00:00', 300, 295, 3, 0, 0, 0, 1.0, 0.9833, 0.9898, 0.9734, 'Best shift this week, zero downtime', now());

-- ── Alerts ───────────────────────────────────────────────────
INSERT INTO alerts (title, message, severity, type, status, equipment_id, source_system, acknowledged_at, acknowledged_by, resolved_at, resolved_by, resolution_notes, created_at)
VALUES
('Low Stock: Pump Bearing Set', 'Item Pump Bearing Set (SKU: PART-003) has 0 units remaining, at or below reorder point of 3.', 'CRITICAL', 'LOW_INVENTORY', 'ACTIVE', NULL, 'INVENTORY', NULL, NULL, NULL, NULL, NULL, now()),
('Low Stock: Robot Torch Tips', 'Item Robot Torch Tips (SKU: PART-010) has 1 units remaining, at or below reorder point of 4.', 'WARNING', 'LOW_INVENTORY', 'ACTIVE', NULL, 'INVENTORY', NULL, NULL, NULL, NULL, NULL, now()),
('Maintenance Due: Cooling Pump P3', 'Equipment Cooling Pump P3 (EQ-005) is due for scheduled maintenance.', 'WARNING', 'MAINTENANCE_DUE', 'ACTIVE', 5, 'MAINTENANCE', NULL, NULL, NULL, NULL, NULL, now()),
('Downtime Started: Cooling Pump P3', 'Unplanned breakdown logged for Cooling Pump P3 due to bearing failure.', 'CRITICAL', 'DOWNTIME_STARTED', 'ACTIVE', 5, 'DOWNTIME', NULL, NULL, NULL, NULL, NULL, now()),
('Production Target Miss: Night Shift', 'Bracket Assembly A night shift produced 410 of 500 target units (82%).', 'WARNING', 'PRODUCTION_TARGET_MISS', 'ACKNOWLEDGED', 1, 'PRODUCTION', '2026-06-10 07:00:00', 'Shift Supervisor', NULL, NULL, NULL, now()),
('Weld Quality Hold Cleared', 'Gas flow regulator recalibrated, affected parts re-inspected and passed.', 'INFO', 'EQUIPMENT_FAULT', 'RESOLVED', 4, 'QUALITY', '2026-06-07 10:05:00', 'QA Inspector', '2026-06-07 10:30:00', 'Marcus Reed', 'Recalibration confirmed effective, all re-run parts passed inspection', now());

-- ── Shift Reports ────────────────────────────────────────────
INSERT INTO shift_reports (report_date, shift_name, supervisor_name, total_units_produced, total_defects, overall_oee, total_downtime_minutes, number_of_incidents, work_orders_opened, work_orders_completed, safety_incidents, safety_briefing_conducted, highlights, issues, actions_required, status, submitted_at, submitted_by, created_at)
VALUES
('2026-06-09', 'DAY', 'Sandra Liu', 1270, 17, 0.9142, 45, 1, 0, 1, 0, true, 'Strong output across Zones A and B, conveyor inspection completed with no issues found.', 'Brief material delay in Zone A resolved using buffer stock.', 'Monitor incoming raw stock delivery schedule with supplier.', 'APPROVED', '2026-06-09 14:30:00', 'Sandra Liu', now()),
('2026-06-09', 'NIGHT', 'Priya Patel', 410, 28, 0.6203, 60, 1, 0, 0, 0, true, 'Night crew completed full shift despite changeover delay.', 'Unplanned changeover and quality hold reduced OEE significantly on Line 1.', 'Review changeover procedure for Bracket Assembly A to reduce setup time.', 'SUBMITTED', '2026-06-10 06:15:00', 'Priya Patel', now()),
('2026-06-11', 'EVENING', 'Devon Carter', 175, 4, 0.7613, 50, 1, 1, 1, 0, true, 'Packaging line jam cleared quickly, minimal impact to overall schedule.', 'Shrink wrap film tore mid-cycle causing 50 minutes of downtime.', 'Inspect remaining film rolls for storage humidity damage.', 'DRAFT', NULL, NULL, now());