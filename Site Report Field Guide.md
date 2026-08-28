# Site Report Field Guide

A primer on where mining data actually comes from — the lifecycle it moves through, and the systems already deployed at any mine site that VisualMiner will need to read from.

---

## 1. The mining lifecycle

Every data feed we'll integrate exists to serve one of these seven stages. A mine's current stage decides which feeds are even relevant — a prospecting-stage site has no processing data because there's nothing to process yet.

1. **Survey** — Broad geophysical scan of an area to see if ore might be present.
2. **Prospect** — Drilling and sampling to locate the ore body and lab-test its quality.
3. **License & Community** — Permits, environmental approval, community agreements.
4. **Extract** — Machinery and operators pull ore from the seam.
5. **Process** — Crush, wash, screen raw ore into graded concentrate stockpiles.
6. **Test** — Lab verifies stockpile purity before it's sold.
7. **Transport** — Logistics queue, weighbridge, shipment to customer.

→ **Rehabilitation** — end-of-cycle state once a mine winds down. Nearly dormant: no extraction, processing, or logistics data, just compliance and land-restoration reporting.

> **Why this matters for the build:** the "mining cycle stage" field isn't cosmetic — it's what turns off entire sections of the dashboard. A mine flagged *Prospecting* should surface lab/geology data prominently and hide processing/logistics panels that don't yet apply.

---

## 2. The ten systems already running at a mine site

These aren't things we build — they're existing vendor software already deployed at most mines. VisualMiner's job is to normalize their exports/APIs into one visual layer. Grouped by what part of the lifecycle they serve.

### Geology & Resource

**Micromine**
Turns drillhole data into 3D ore-body models with grade contours — the core tool of the Prospecting stage.
Feeds → *Prospect*

**Drone system**
Photogrammetry/LiDAR flights (Pix4D, DroneDeploy-class) that re-survey the pit often — stockpile volumes, wall stability, updated topography.
Feeds → *Survey, Extract*

### Operations & Maintenance

**Deswik**
Mine planning and scheduling — designs pit phases and sequences extraction over time.
Feeds → *Extract*

**Hexagon**
High-precision survey and machine-guidance suite; overlaps Deswik/Micromine but leans toward equipment positioning accuracy.
Feeds → *Extract*

**CAT fleet system**
Fleet management for haul trucks/excavators — GPS position, payload per load, fuel, cycle times. Primary feed for live machine tracking.
Feeds → *Extract*

**SCADA**
Real-time control of fixed plant — crushers, conveyors, screens. Throughput-per-hour, equipment alarms, uptime.
Feeds → *Process*

**CMMS**
Maintenance work orders, breakdown history, parts usage. The source of every downtime story behind a yield drop.
Feeds → *Extract, Process*

### Enterprise, Spatial & Compliance

**Laboratory system (LIMS)**
Assay records confirming ore or concentrate grade. Every stated purity figure traces back here.
Feeds → *Prospect, Test*

**SAP**
ERP covering procurement, finance, HR, inventory — cost-per-tonne, payroll, spares, often maintenance work orders too.
Feeds → *All stages*

**ArcGIS**
General GIS — land tenure, licensing boundaries, community/environmental mapping, haul road networks.
Feeds → *License & Community*

---

## 3. Where each report type actually originates

The backlog's Site Reports list maps directly onto the systems above — useful when we're deciding what an ingestion connector needs to speak.

| Report type | Originating system |
|---|---|
| Inspection reports | CMMS / EHS software |
| Maintenance reports | CMMS |
| Geological reports | Micromine |
| Blast reports | Deswik / dedicated blast software |
| Safety reports | EHS system / SAP HR |
| Engineering drawings | CAD, Hexagon |
| SOPs & permits | Document management / ArcGIS |
| Environmental reports | ArcGIS + compliance filings |
| Contractor reports | SAP / manual submission |

---

## The angle worth pitching Tuesday

None of these ten systems talk to each other natively. The real commercial value of VisualMiner isn't the 3D map — it's being the **single normalization layer** that pulls CAT Fleet, SCADA, Micromine, LIMS, and CMMS into one visual timeline, so a mine exec can see **why yield is down** without opening six vendor dashboards.

---
