# Hexagons Map (Angular + Leaflet + H3)

Visualize hexagons over a basemap (OSM) using **H3**. Source data comes from `src/assets/data.json`:
- The input coordinates are provided in **EPSG:3857** and are converted to **EPSG:4326 (WGS84)**.
- Hexagons are generated from the polygons using **h3-js** and their size adapts to the zoom level.
- Rendering uses a transparent **Canvas** layer above the tiles.

---

## Tech stack

- Angular 19
- Leaflet
- proj4
- h3-js
- Turf.js

---

## Clone & install

```bash
# 1) Clone the repository (replace with your repo URL)
git clone https://github.com/awandresto/angular-hexagon-test.git
cd angular-hexagon-test

# 2) Install dependencies
npm install
```

---

## Data

Input data file is here:
```
src/assets/data.json
```

---

## Development server

```bash
npm start
# or
ng serve
```
Then open it at:
```
http://localhost:4200
```

---

## Production build

```bash
npm run build
# output in dist/<project-name>
```

---

## Deployed version
[Live demo](https://angular-hexagon-test.onrender.com/)
