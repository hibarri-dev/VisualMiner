Free elevation / mine-terrain sources (CC / public domain).
Drop a GeoTIFF or OBJ into public/models/, then:

  cd frontend && node scripts/obj-to-terrain-glb.mjs public/models/<folder>

Open-pit / quarry DEMs (best “real mine”, not a pre-made GLB)
- OpenTopography  https://opentopography.org  (search Bingham Canyon, Chuquicamata, Super Pit)
- USGS 3DEP       https://apps.nationalmap.gov/downloader
- Copernicus GLO-30  https://spacedata.copernicus.eu
- JAXA ALOS AW3D30   https://www.eorc.jaxa.jp/ALOS/en/aw3d30/
- NASA SRTM          https://earthexplorer.usgs.gov
- TouchTerrain       https://touchterrain.geol.iastate.edu

Ready-made GLB / glTF (download, then put in public/models/)
Open-pit / quarry meshes (prefer CC-BY; skip NC / ShareAlike for a commercial demo)
- Quarry simplified mesh (CC-BY, ~1M tris)
  https://sketchfab.com/3d-models/quarry-simplified-3d-mesh-cde441c86fc548dda9b899d284c753d7
- Blue Jay Mine Site 2025 drone scan (CC-BY)
  https://sketchfab.com/3d-models/blue-jay-mine-site-2025-ab9db6d7151f4bd0971885303a9938b9
- Quarry GCP photogrammetry (CC-BY)
  https://sketchfab.com/3d-models/quarry-gcp-f1c852ac1f2048fca104b44c68ecce5d
- Former quarry Muttental (CC-BY, 10M tris — too heavy unless you decimate)
  https://sketchfab.com/3d-models/former-quarry-muttental-witten-ger-f314d17a44d146f0942fd0cdf0b56213

Rock / cliff dressing (CC0, safe to use commercially)
- Poly Haven coastal cliff  https://polyhaven.com/a/coastal_cliff_02
- Poly Haven rock face     https://polyhaven.com/a/rock_face_01
- Poly Haven quarry wall   https://polyhaven.com/a/quarry_wall
- Kenney Nature Kit (CC0 rocks/terrain pieces)  https://kenney.nl/assets/nature-kit

Sketchfab filter (downloadable + CC0 or CC-BY only)
  https://sketchfab.com/search?q=quarry+open+pit&type=models&features=downloadable

Do not use NC / ShareAlike mines on a paid demo (e.g. Quellaveco, Riotinto 2020).
Keep GLB under ~15 MB / ~500k triangles or the Maps canvases will hitch.
