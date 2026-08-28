Free elevation / mine-terrain sources (CC / public domain).
Drop a GeoTIFF or OBJ into public/models/, then:

  cd frontend && node scripts/obj-to-terrain-glb.mjs

Open-pit / quarry DEMs
- OpenTopography  https://opentopography.org  (search Bingham Canyon, Chuquicamata, Super Pit)
- USGS 3DEP       https://apps.nationalmap.gov/downloader
- Copernicus GLO-30  https://spacedata.copernicus.eu
- JAXA ALOS AW3D30   https://www.eorc.jaxa.jp/ALOS/en/aw3d30/  (this folder used AW3D30)
- NASA SRTM          https://earthexplorer.usgs.gov
- TouchTerrain       https://touchterrain.geol.iastate.edu  (exports printable OBJ like 841220181419/)

Color / mesh look (the Maps visualizer)
The app colors height as a LiDAR heatmap (blue floor → green → yellow → red rim) and draws UV scan rays. You do not need a photoreal rock texture for that look.

CC0 3D meshes (optional)
- Sketchfab CC0 “open pit” / “quarry” / “mine terrain”
- Poly Haven  https://polyhaven.com  (HDRIs only — lighting, not DEM)
