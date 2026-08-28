# Data Integration Roadmap

## Part A — Can we actually pull from each system?

| System | Integration method | API available? | Notes |
|---|---|---|---|
| **CAT fleet system** | Cat Digital Marketplace / VisionLink API | **Yes** | Published API catalog — telematics, fuel, utilization, geofencing. Requires a Cat Digital developer subscription per customer. |
| **Hexagon (HxGN MineOperate)** | Vendor-side integration hub | **Partial** | Positioned as a "connect to any system" data store; a documented public API for MineOperate itself isn't published — likely needs a direct integration conversation with Hexagon per deployment. |
| **Deswik** | DUF file format / geomodel-grid & geomodel-solid file APIs | **Partial** | File-format-based interoperability rather than a live REST API — third parties get read/write access to Deswik's own file formats, not a hosted endpoint. Workable, but batch/file-driven, not real-time. |
| **Micromine** | Pitram RESTful Integration Services (PRIS) | **Yes** | Genuine REST/Web API for pulling and updating data from Pitram (Micromine's operational module). Custom APIs can also be built by their team on request. |
| **ArcGIS** | ArcGIS REST API | **Yes** | Mature, fully documented REST API (map, feature, geocode, geoprocessing services). This is the easiest integration on the list. |
| **SAP** | OData V2/V4 | **Yes** | SAP's strategic API standard — 600+ prebuilt OData APIs on S/4HANA, JSON/XML over HTTPS with OAuth. Very well trodden path. |
| **SCADA** | OPC UA (preferred) / Modbus (legacy) | **Yes, but not an "API"** | SCADA isn't one product — it's a protocol layer. OPC UA is the modern, secure standard; Modbus is older and has no built-in auth. Expect most real sites to run a mix of both. This is the one that needs a protocol gateway, not a simple key. |
| **CMMS** | eMaint REST API (or Maximo API if that's the customer's vendor) | **Yes** | eMaint has a documented REST API plus 200+ prebuilt ERP connectors. CMMS vendor varies by customer — we should ask which one the pilot customer runs before assuming eMaint. |
| **Laboratory system (LIMS)** | REST API (vendor-dependent) | **Yes, generally** | Most modern LIMS platforms (Confident LIMS, LabKey, etc.) expose REST APIs with token auth. Exact endpoints depend on which LIMS the customer's lab uses — this is the most fragmented category. |
| **Drone system** | Pix4D / DroneDeploy export + app marketplace integrations | **Yes** | Both platforms are built to hand off processed outputs (orthomosaics, volumetrics, point clouds) to downstream systems — this is file/output-based rather than a live feed, which is fine since drone surveys are periodic, not continuous. |

**Bottom line:** ArcGIS, SAP, Micromine (via PRIS), CMMS, and CAT Fleet all have genuine, documented APIs — these are our fastest wins. SCADA and Deswik require protocol/file-based bridges rather than a clean REST call. Hexagon and LIMS integration specifics depend on which product tier / vendor the actual customer runs, so that's a question for the sales conversation, not something we can standardize in advance.

---

## Part B — The data model: turning ten formats into one

This is the "vectors and datasets" piece. Everything each system produces falls into three buckets, and the normalization layer's job is to map every source into one of these three before it ever reaches the 3D viewer:

1. **Spatial vectors** — anything with a coordinate: GPS pings (CAT Fleet), ore-body meshes and drillhole traces (Micromine, Deswik), land/permit boundaries (ArcGIS), point clouds (drone). Stored as geometry (point/line/polygon/mesh) tagged with a timestamp and a coordinate reference system — this is what actually drives the 3D model.
2. **Time-series datasets** — anything that's a number changing over time: fuel level, throughput tons/hour (SCADA), payload per load, machine uptime (CMMS). Stored as `{entity_id, metric, value, timestamp}` rows — this drives the live stat panels and the AI trend commentary.
3. **Document/report records** — anything that's a report or result: lab assays (LIMS), inspection/maintenance/blast/safety reports, engineering drawings. These get structured metadata (mine, date, stage, author) plus the raw content — this is what the AI bot reads and summarizes, and later what gets embedded for semantic search once we want the bot answering free-form questions across reports.

Every connector we build (CAT Fleet, SAP, etc.) only has one job: translate that vendor's native format into one of these three shapes. The 3D viewer, the AI bot, and the report feed then only ever need to understand three shapes instead of ten vendor formats — that's what keeps the "math" (as Anje put it) from spiraling as we add more source systems.

---

## Part C — Phased roadmap

**Phase 0 — Tuesday demo (this week)**
Use public data, not live customer systems (see Part D). Hand-normalize one small real dataset into the three buckets above and prove the pipeline end-to-end: raw report → normalized dataset → 3D model → AI summary. This proves the concept without needing any customer credentials.

**Phase 1 — Easiest real connectors (fastest path to a working pilot)**
Build connectors for the systems with clean documented APIs first: **ArcGIS → spatial vectors**, **SAP → time-series/cost datasets**, **CAT Fleet → spatial + time-series**, **Micromine/Pitram (PRIS) → spatial + document**, **CMMS → time-series/document**. These five alone cover most of what's visible in the current dashboard mockup.

**Phase 2 — Protocol-based connectors**
Build a SCADA gateway (OPC UA client, with a Modbus fallback path) and a Deswik file-watcher (DUF/geomodel-grid ingestion). These need more infrastructure than a REST call, so they come after the quick wins are live.

**Phase 3 — Fragmented/vendor-dependent connectors**
LIMS and Hexagon integrations get finalized once we know the pilot customer's actual vendor — build one working adapter first, then generalize the adapter pattern rather than guessing at every possible LIMS/Hexagon variant up front.

**Phase 4 — AI layer**
Once documents are flowing into the document/report bucket, add embeddings for semantic search and let the AI bot query across reports, not just today's numbers.

---

## Part D — Where to get real demo data for Tuesday

Anje's ask (find a real project with seismic/drilling/prospecting data to demo against) maps well onto **JORC (Australia/ASX)** and **NI 43-101 (Canada/TSX-V)** technical reports:

- These are the mandatory public disclosure reports that exploration-stage listed mining companies file to attract investors — exactly the "no operational mine yet, just test results" case Anje described.
- They're freely downloadable: ASX announcements at **announcements.asx.com.au** (search a ticker + "JORC" or "drilling results"), and Canadian filings at **SEDAR+ (sedarplus.ca)** (search "NI 43-101 technical report").
- Each report contains structured drillhole tables (hole ID, from/to depth, assay grade), resource estimates, and often maps/sections — this is a ready-made real **document + spatial vector** dataset we can run through the Micromine-style ore-body pipeline without touching any live customer system.

**Recommendation:** pick one small-cap ASX or TSX-V exploration company's most recent NI 43-101/JORC report, extract its drillhole table, and feed that into the 3D ore-body view for the demo. It's real investor-grade data, it's legally public, and it needs no API credentials at all — ideal for Tuesday.

---

Sources:
- [3rd Party API Integrations Tool | CAT Digital Marketplace](https://digital.cat.com/news-and-announcements/3rd-party-api-integrations-tool-available)
- [HxGN MineOperate OP Foundation | Hexagon](https://hexagonmining.com/solutions/operations-portfolio/fleet-management/hxgn-mineoperate-op-foundation)
- [Import and export — Deswik](https://training-api.deswik.com/Content/8bb8f9d0-bb17-44c8-aa4c-4e0a498ee3ae/content/deswikcadessentials/importandexport/importandexport_importdata.htm)
- [Accessing external information using Pitram Restful Integration Services (PRIS) - MINING.COM](https://www.mining.com/web/accessing-external-information-using-pitram-restful-integration-services-pris/)
- [Get started—ArcGIS REST APIs | ArcGIS Developers](https://developers.arcgis.com/rest/services-reference/get-started-with-the-services-directory.htm)
- [SAP S/4HANA OData API Capabilities | knowledgelib.io](https://knowledgelib.io/business/erp-integration/sap-s4hana-odata-api-capabilities/2026)
- [What is OPC UA? | PTC](https://www.ptc.com/en/technologies/iiot/industrial-automation/opc/opc-ua)
- [LIS & LIMS APIs Explained | Ligolab](https://www.ligolab.com/post/lis-system-and-lims-lab-management-platforms-are-there-reliable-api-services-for-lab-testing-data-management)
- [API Integration: Simplified CMMS Connections | eMaint](https://www.emaint.com/emaint-cmms-api-unites-your-individual-business-processes/)
- [Drone-mapping streamlines surveys in mineral operations | Pix4D](https://www.pix4d.com/blog/drone-mapping-streamlines-surveys-in-mineral-production-operations)
- [National Instrument 43-101 — Wikipedia](https://en.wikipedia.org/wiki/National_Instrument_43-101)
- [Mining Disclosure Analysis: How to Read SEC, SEDAR+ and ASX Filings](https://www.miningsee.eu/mining-disclosure-analysis-how-to-read-sec-sedar-and-asx-filings-beyond-the-press-release/)
