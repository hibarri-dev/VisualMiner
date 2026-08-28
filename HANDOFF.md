# VisualMiner — 3D Mining Scene Handoff

Context for whoever (Cursor included) picks this up next. Written 2026-08-28, end of the first build day, for a commercial demo the following Tuesday.

## Where things stand

- Repo: `VisualMiner`, app lives in `frontend/` (Vite + React 19 + Tailwind v4, plain JS not TS).
- **Branch: `main`**, currently 2 commits ahead of `origin/main`, not pushed yet. (Started the day on `feat/sahil`; that work got committed and merged into `main` outside of this session — not something the assistant did, just noting it so nobody's surprised by the branch state.)
- `npm run build` passes clean from `frontend/`.
- Dev server convention used today: `npm run dev` from `frontend/` (port 5173).

## The product, briefly

VisualMiner is a digital-twin dashboard for mine operators — live 3D site view, fleet/personnel tracking, processing/production stats, AI-generated site reports. Reference deck: `Visualminer by Hibarri` PDF (aerial LiDAR-style pit visualizations, ore-body cross sections, live tracking overlays). Today's scope was making the **Maps** tab's "Live 3D" promise real — it was previously a flat SVG mockup.

Data model (owned by teammates, not touched today except reading):
- [frontend/src/data/catalog.js](frontend/src/data/catalog.js) — `SITE.elevation = { rim: 920, floor: 640 }` and `BENCHES` (bench name → real elevation in meters). This is the ground truth the 3D terrain is built from.
- [frontend/src/data/machines.js](frontend/src/data/machines.js) — `MACHINE_TYPES` (9 types: haul_truck, excavator, shovel, front_loader, dozer, grader, drill, water_truck, fuel_truck), each machine has `x`/`y` (0–100, pit-relative position), `bench` (string, looks up into `BENCHES`), `status`, `fuelPercent`, `payloadKg`/`payloadCapacityKg`, `trackerId`. Machines move along fixed waypoint paths (`TRACK_PATHS`, `stepAlongPath`).
- [frontend/src/data/personnel.js](frontend/src/data/personnel.js) — similar shape, `zone` instead of `bench`, `roleGroup` (operators/geologists/safety/other).
- [frontend/src/context/MineDataContext.jsx](frontend/src/context/MineDataContext.jsx) — ticks the whole simulated mine state every 2.5s.

## What got built today: the 3D layer

New folders: `frontend/src/three/` (pure math/data helpers, no JSX) and `frontend/src/components/three/` (R3F components). Stack added: `three`, `@react-three/fiber`, `@react-three/drei`.

### Core idea
The pit is a real terraced open-pit shape generated from `SITE.elevation` + `BENCHES` — not a hand-modeled asset. If those elevation numbers change, the terrain and every marker's height change with them automatically. That link is the main thing to preserve if you keep building on this.

### Files

**[frontend/src/three/pitProfile.js](frontend/src/three/pitProfile.js)** — the math core, no rendering:
- `buildPitLevels()` — walks `SITE.elevation.rim` → sorted `BENCHES` → `SITE.elevation.floor`, dedupes near-identical elevations (Bench 4 North/South are ~5m apart), returns `[{elevation, radius}]` from rim (radius 5) to floor (radius 0.55). Radius shrinks per level so the pit tapers like a real bench-and-berm mine.
- `elevationToY(elevation)` — maps a real elevation to world-space Y (rim → y=0, floor → y=−3.2).
- `depthColor(t)` — the blue→green→yellow→orange→red→brown ramp (reused from the original SVG mockup's gradient stops) for vertex coloring by depth.
- `radiusForElevation(elevation, levels)` — interpolates radius for any elevation (used to snap markers onto the correct ring).
- `pitMarkerPosition(x, y, benchName, levels)` — **this is the key function**: takes a machine's `x`/`y` (0–100) and `bench` name, looks up the bench's real elevation, and returns a `[worldX, worldY, worldZ]` where the *direction* comes from x/y but the *radius and height* are forced to match the bench's real ring. This is why every machine visually sits exactly on its correct terrace regardless of jitter in x/y.

**[frontend/src/components/three/Scene3D.jsx](frontend/src/components/three/Scene3D.jsx)** — shared `<Canvas>` wrapper: lighting, fog, `OrbitControls` (rotate/pan/zoom), and drei's `<Sky>` for the backdrop.
- **Important gotcha found today**: drei's `<Environment preset="...">` (real photographed HDRI) was tried first for a "real" backdrop, but it fetches from an external CDN (`raw.githack.com/pmndrs/drei-assets`) at runtime. That fetch is **blocked by CORS in the sandboxed preview browser used during dev** (confirmed via direct `fetch()` test — `Access to fetch ... blocked by CORS policy`). Since this is a live customer demo and the deploy target/venue network can't be fully guaranteed, it was swapped for drei's `<Sky>`, which is a fully procedural physically-based sky shader — zero network dependency, renders identically everywhere. If you want real photographed HDRI reflections later, verify the target network can actually reach that CDN before switching back, or self-host the `.hdr` file in `public/`.
- Pit scene uses a warm low-sun (`sunPosition=[8, 1.5, 4]`, `turbidity=9`) for a dusty golden-hour look; the personnel/ridge scene uses a cooler `sunPosition=[-6, 2.4, 6]`, `turbidity=5`. Both configurable via props from `MapsView`.

**[frontend/src/components/three/PitTerrain3D.jsx](frontend/src/components/three/PitTerrain3D.jsx)** — builds the terraced pit as a single `THREE.LatheGeometry` (a 2D staircase profile revolved 360°), vertex-colored via `depthColor()`. Also adds a haul-road ring (flattened `ringGeometry`) and calls `TerrainDressing` for the surrounding ground.

**[frontend/src/components/three/RidgeTerrain3D.jsx](frontend/src/components/three/RidgeTerrain3D.jsx)** — the personnel-monitoring terrain: a sine-wave-displaced `PlaneGeometry`, green→cyan→blue→purple vertex ramp (same gradient stops as the original SVG mockup). Exports `RIDGE_HALF` and `ridgeHeight(x, z)` — reused by `PersonMarker3D` so markers sit exactly on the surface.

**[frontend/src/components/three/TerrainDressing.jsx](frontend/src/components/three/TerrainDressing.jsx)** — scattered rocks (`InstancedMesh` of icosahedrons, seeded RNG so it's deterministic) and simple low-poly pine trees (cone + cylinder), placed in an annulus around whichever terrain passes in a `heightFn`. Purely decorative, keeps the render cost low via instancing.

**[frontend/src/components/three/MachineModel.jsx](frontend/src/components/three/MachineModel.jsx)** — procedural low-poly 3D vehicles built from primitives (boxes/cylinders/capsules), one shape per machine type: haul truck (dump bed tilts when `status === 'Dumping'`, load color reflects `payloadPercent`), excavator/shovel (tracked base + articulated boom/stick/bucket), drill rig, front loader, dozer/grader, water/fuel truck (tank variant). No external model files — everything is code-generated, so there's no asset licensing/download question. Selected machines get a white ring + scale-up.

**[frontend/src/components/three/PersonModel.jsx](frontend/src/components/three/PersonModel.jsx)** — small hard-hat capsule figure, color-coded by `roleGroup`.

**[frontend/src/components/three/MachineMarker3D.jsx](frontend/src/components/three/MachineMarker3D.jsx)** / **[PersonMarker3D.jsx](frontend/src/components/three/PersonMarker3D.jsx)** — position a `<group>` at the computed world position, render the model, attach click/hover handlers directly on the 3D object (`useCursor` from drei for the pointer), and anchor the same popover card markup the original 2D mockup used via drei's `<Html>` (only rendered when `selected`, positioned as a local offset above the model so it follows the model in 3D space).

**[frontend/src/components/views/MapsView.jsx](frontend/src/components/views/MapsView.jsx)** — the only pre-existing file touched. Was previously two flat `<svg>` terrains with CSS-absolute-positioned marker divs; now renders two `<Scene3D>` canvases (`Machine monitoring` / `Personnel monitoring`), same panel headers/badges as before, same `mine.machines.filter(m => m.onMap)` / `mine.personnel.filter(p => p.onMap)` data flow — nothing in the data/context layer changed.

## Verified working (in-browser, this session)

- Both 3D scenes render with no console errors (checked in a fresh tab, not just after HMR).
- Orbit/zoom/pan works.
- Click-to-select on a 3D model updates the popover with live telemetry (tested selecting an unselected water truck — correct type, fuel, payload, trackerId, operator all showed).
- `npm run build` succeeds; only warning is Vite's generic "one JS chunk is >500kB" advisory (pre-existing class of warning, not from today's code specifically — worth revisiting via code-splitting before shipping this as a resellable product, not urgent for Tuesday).

## Known gaps / good next steps for Cursor

1. **Underground shaft / ore-body cross-section view** — the PDF deck (page 4) shows a second visualization style: vertical shaft, colored ore-body blobs at depth, a depth slider, section-cut controls. Not built. Would hang off the existing `mines-models` nav item ("3D Mine Models (nanoCAD/CAD)" in [navigationConfig.js](frontend/src/config/navigationConfig.js)). Bigger lift than today's work — treat as a separate feature, probably post-Tuesday polish.
2. **Photoreal equipment** — today's trucks/excavators/etc. are stylized primitive-built models, good enough to read clearly at demo distance but not textured/branded (no CAT decals etc.). If the customer wants that, it needs either a Blender artist or a licensed glTF asset pack — don't casually pull assets from the web into a resellable commercial product without checking the license.
3. **Bundle size** — 1.2MB main JS chunk (three.js is heavy). Worth code-splitting the 3D scene behind a dynamic `import()` if initial load time becomes a concern for the demo.
4. **Marker orientation** — vehicles don't currently rotate to face their direction of travel (machines move along `TRACK_PATHS` waypoints in the data layer, but `MachineMarker3D` doesn't compute heading from that yet). Minor visual polish.
5. **Mobile/responsive** — not tested at small viewport sizes; R3F `Canvas` should resize fine but untested.
6. Two panels currently run two independent `<Canvas>` instances (simplest to implement, matches the original two-panel layout) — fine for now, but if this ever needs many more simultaneous 3D views, consolidating into fewer canvases would help perf.

## Running it

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build    # production build, this is what Vercel will run
```
