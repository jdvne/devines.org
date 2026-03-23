// Data is passed from the page via window.__travel (set by is:inline define:vars)
// MapLibre is loaded dynamically; initMap() runs on its onload event.

const PIN_COLORS = {
  visited: '#DFBD22',
  lived:   '#C44B3A',
  want:    '#5B8FA8',
  family:  '#7A9B5A',
  work:    '#9B7AC4',
  parks:   '#4A7C3F',
};

const TRAIL_COLORS = {
  hike: '#4A7C3F',
  run:  '#C44B3A',
};

function pinColor(type) {
  return PIN_COLORS[type] || PIN_COLORS.visited;
}

function trailColor(type) {
  return TRAIL_COLORS[type] || TRAIL_COLORS.hike;
}

function trailLegendSvg(color) {
  return '<svg viewBox="0 0 24 8" xmlns="http://www.w3.org/2000/svg" width="24" height="8">'
    + '<line x1="1" y1="4" x2="23" y2="4" stroke="' + color + '" stroke-width="2.5" stroke-dasharray="0 4" stroke-linecap="round"/>'
    + '</svg>';
}

function pinLegendSvg(color) {
  return '<svg viewBox="0 0 14 22" xmlns="http://www.w3.org/2000/svg" width="14" height="22">'
    + '<circle cx="7" cy="7" r="6" fill="' + color + '" stroke="#7A251E" stroke-width="1.2"/>'
    + '<circle cx="7" cy="7" r="2.5" fill="#7A251E" opacity="0.35"/>'
    + '<line x1="7" y1="13" x2="7" y2="21" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round"/>'
    + '</svg>';
}

function pinSvg(color) {
  return '<svg viewBox="0 0 18 30" xmlns="http://www.w3.org/2000/svg" width="18" height="30">'
    + '<circle cx="9" cy="9" r="8" fill="' + color + '" stroke="#7A251E" stroke-width="1.5"/>'
    + '<circle cx="9" cy="9" r="3" fill="#7A251E" opacity="0.35"/>'
    + '<line x1="9" y1="17" x2="9" y2="29" stroke="' + color + '" stroke-width="2" stroke-linecap="round"/>'
    + '</svg>';
}

function passportStampSvg(color) {
  return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24">'
    + '<circle cx="12" cy="12" r="11" fill="none" stroke="' + color + '" stroke-width="2"/>'
    + '<g transform="rotate(-25, 12, 12)">'
    + '<line x1="4" y1="10" x2="20" y2="10" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round"/>'
    + '<line x1="3.5" y1="12" x2="20.5" y2="12" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round"/>'
    + '<line x1="4" y1="14" x2="20" y2="14" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round"/>'
    + '</g>'
    + '</svg>';
}

function passportStampLegendSvg(color) {
  return '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" width="16" height="16">'
    + '<circle cx="8" cy="8" r="7" fill="none" stroke="' + color + '" stroke-width="1.5"/>'
    + '<g transform="rotate(-25, 8, 8)">'
    + '<line x1="2.5" y1="7" x2="13.5" y2="7" stroke="' + color + '" stroke-width="1.2" stroke-linecap="round"/>'
    + '<line x1="2" y1="8.5" x2="14" y2="8.5" stroke="' + color + '" stroke-width="1.2" stroke-linecap="round"/>'
    + '<line x1="2.5" y1="10" x2="13.5" y2="10" stroke="' + color + '" stroke-width="1.2" stroke-linecap="round"/>'
    + '</g>'
    + '</svg>';
}

const RED_SANDS = {
  version: 8,
  sources: {
    openmaptiles: {
      type: 'vector',
      url: 'https://tiles.openfreemap.org/planet',
    },
    dem: {
      type: 'raster-dem',
      tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
      tileSize: 256,
      encoding: 'terrarium',
      maxzoom: 15,
    },
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#C8B898' },
    },
    {
      id: 'hillshade',
      type: 'hillshade',
      source: 'dem',
      paint: {
        'hillshade-illumination-direction': 335,
        'hillshade-exaggeration': 0.4,
        'hillshade-shadow-color': '#5A2A10',
        'hillshade-highlight-color': '#D8C8A8',
        'hillshade-accent-color': '#8B5A28',
      },
    },
    {
      id: 'water',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'water',
      paint: { 'fill-color': '#7A251E' },
    },
    {
      id: 'waterway',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'waterway',
      minzoom: 6,
      paint: { 'line-color': '#7A251E', 'line-width': 1 },
    },
    {
      id: 'boundary-country',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'boundary',
      filter: ['all', ['==', 'admin_level', 2], ['!=', 'maritime', 1]],
      paint: {
        'line-color': '#6B4020',
        'line-width': ['interpolate', ['linear'], ['zoom'], 0, 1, 4, 2, 8, 3.5],
      },
    },
    {
      id: 'boundary-state',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'boundary',
      filter: ['all', ['==', 'admin_level', 4], ['!=', 'maritime', 1]],
      minzoom: 4,
      paint: {
        'line-color': '#7A5028',
        'line-width': 1,
        'line-dasharray': [4, 3],
      },
    },
    {
      id: 'road-highway',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      minzoom: 5,
      filter: ['==', 'class', 'motorway'],
      paint: {
        'line-color': '#B8A878',
        'line-opacity': 0.5,
        'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.5, 10, 2],
      },
    },
    {
      id: 'road-major',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      minzoom: 7,
      filter: ['in', 'class', 'primary', 'secondary'],
      paint: {
        'line-color': '#B0A070',
        'line-opacity': 0.4,
        'line-width': ['interpolate', ['linear'], ['zoom'], 7, 0.5, 10, 1.5],
      },
    },
    {
      id: 'road-minor',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      minzoom: 9,
      filter: ['in', 'class', 'minor', 'tertiary'],
      paint: { 'line-color': '#A89860', 'line-opacity': 0.3, 'line-width': 0.5 },
    },
  ],
};

function initMap() {
  const { locations, trails } = window.__travel;

  const map = new maplibregl.Map({
    container: 'map',
    style: RED_SANDS,
    center: [-90, 37],
    zoom: 3.5,
    attributionControl: false,
  });

  map.addControl(
    new maplibregl.NavigationControl({ showCompass: false }),
    'bottom-right'
  );

  map.addControl(
    new maplibregl.AttributionControl({ compact: true }),
    'bottom-left'
  );

  const panel     = document.getElementById('info-panel');
  const nameEl    = document.getElementById('info-name');
  const dateEl    = document.getElementById('info-date');
  const captionEl = document.getElementById('info-caption');
  const closeBtn  = document.getElementById('info-close');

  function showInfo(name, date, caption, accentColor) {
    nameEl.textContent = name;
    dateEl.textContent = date ? 'first visited ' + date : '';
    dateEl.style.display = date ? 'block' : 'none';
    captionEl.textContent = caption || '';
    captionEl.style.display = caption ? 'block' : 'none';
    panel.style.borderLeftColor = accentColor;
    panel.classList.remove('hidden');
  }

  if (trails.length > 0) {
    map.on('load', function () {
      map.addSource('trails', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      map.addLayer({
        id: 'trails-underline',
        type: 'line',
        source: 'trails',
        layout: { 'line-cap': 'butt' },
        paint: { 'line-color': '#C8B898', 'line-width': 8 },
      });

      map.addLayer({
        id: 'trails-line',
        type: 'line',
        source: 'trails',
        layout: { 'line-cap': 'round' },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 4,
          'line-dasharray': [0, 1.4],
        },
      });

      map.on('click', 'trails-line', function (e) {
        const props = e.features[0].properties;
        showInfo(props.name, props.date, props.caption, props.color);
        e.originalEvent.stopPropagation();
      });

      ['trails-line', 'trails-underline'].forEach(function (id) {
        map.on('mouseenter', id, function () { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', id, function () { map.getCanvas().style.cursor = ''; });
      });

      Promise.all(
        trails.map(function (t) {
          return fetch('/trails/' + t.file)
            .then(function (r) {
              if (!r.ok) throw new Error('Failed to load trail: ' + t.file);
              return r.json();
            })
            .then(function (geojson) {
              const type = t.type || 'hike';
              const color = t.color || trailColor(type);
              const geometry = geojson.features ? geojson.features[0].geometry : geojson.geometry;
              return {
                type: 'Feature',
                properties: { name: t.name, color, type, date: t.date || '', caption: t.caption || '' },
                geometry,
              };
            })
            .catch(function (err) {
              console.warn(err);
              return null;
            });
        })
      ).then(function (results) {
        map.getSource('trails').setData({
          type: 'FeatureCollection',
          features: results.filter(Boolean),
        });
      });
    });
  }

  var markersByPinType = {};
  locations.forEach(function (loc) {
    const color = pinColor(loc.type);
    const el = document.createElement('div');
    el.className = 'travel-marker';
    el.innerHTML = loc.type === 'parks' ? passportStampSvg(color) : pinSvg(color);

    const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat([loc.lng, loc.lat])
      .addTo(map);

    const t = loc.type || 'visited';
    if (!markersByPinType[t]) markersByPinType[t] = [];
    markersByPinType[t].push(marker);

    el.addEventListener('click', function (e) {
      e.stopPropagation();
      showInfo(loc.name, loc.date, loc.caption, color);
    });
  });

  var hiddenTrailTypes = new Set();
  function updateTrailFilter() {
    var visible = Object.keys(TRAIL_COLORS).filter(function (t) { return !hiddenTrailTypes.has(t); });
    var filter = visible.length === 0
      ? ['==', '1', '2']
      : ['in', ['get', 'type'], ['literal', visible]];
    map.setFilter('trails-line', filter);
    map.setFilter('trails-underline', filter);
  }

  map.on('click', function () { panel.classList.add('hidden'); });
  closeBtn.addEventListener('click', function () { panel.classList.add('hidden'); });

  // Build legend from types present in data
  var usedPinTypes   = [...new Set(locations.map(function (l) { return l.type || 'visited'; }))];
  var usedTrailTypes = [...new Set(trails.map(function (t) { return t.type || 'hike'; }))];
  var order      = Object.keys(PIN_COLORS);
  var trailOrder = Object.keys(TRAIL_COLORS);

  if (usedPinTypes.length > 1 || usedTrailTypes.length > 0) {
    var legend = document.getElementById('legend');
    var tbody = document.createElement('tbody');

    if (usedPinTypes.length > 1) {
      usedPinTypes.sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); });
      usedPinTypes.forEach(function (type) {
        var color = pinColor(type);
        var label = type === 'visited' ? 'visits' : type === 'parks' ? 'national parks' : type;
        var svg = type === 'parks' ? passportStampLegendSvg(color) : pinLegendSvg(color);
        var tr = document.createElement('tr');
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = true;
        cb.style.accentColor = color;
        cb.addEventListener('change', function () {
          var markers = markersByPinType[type] || [];
          markers.forEach(function (m) { m.getElement().style.display = cb.checked ? '' : 'none'; });
        });
        var tdCb = document.createElement('td'); tdCb.appendChild(cb);
        var tdIcon = document.createElement('td'); tdIcon.innerHTML = svg;
        var tdLabel = document.createElement('td'); tdLabel.textContent = label;
        tr.append(tdCb, tdIcon, tdLabel);
        tbody.appendChild(tr);
      });
    }

    usedTrailTypes.sort(function (a, b) { return trailOrder.indexOf(a) - trailOrder.indexOf(b); });
    usedTrailTypes.forEach(function (type) {
      var color = trailColor(type);
      var tr = document.createElement('tr');
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = true;
      cb.style.accentColor = color;
      cb.addEventListener('change', function () {
        if (cb.checked) hiddenTrailTypes.delete(type);
        else hiddenTrailTypes.add(type);
        updateTrailFilter();
      });
      var tdCb = document.createElement('td'); tdCb.appendChild(cb);
      var tdIcon = document.createElement('td'); tdIcon.innerHTML = trailLegendSvg(color);
      var tdLabel = document.createElement('td'); tdLabel.textContent = type + 's';
      tr.append(tdCb, tdIcon, tdLabel);
      tbody.appendChild(tr);
    });

    var table = document.createElement('table');
    table.appendChild(tbody);
    legend.appendChild(table);
    legend.classList.remove('hidden');
  }
}

const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/maplibre-gl@4/dist/maplibre-gl.min.js';
script.onload = initMap;
document.head.appendChild(script);
