const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export async function fetchNearbyPlaces(lat, lon, radius = 1000) {
    const query = `
    [out:json][timeout:25];
    (
      node["tourism"="attraction"](around:${radius},${lat},${lon});
      node["tourism"="museum"](around:${radius},${lat},${lon});
      node["leisure"="park"](around:${radius},${lat},${lon});
    );
    out body;
  `;

    const response = await fetch(OVERPASS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: query
    });

    if (!response.ok) {
        throw new Error('Failed to fetch places from OpenStreetMap');
    }

    console.log(query);

    const data = await response.json();
    return normalizePlaces(data.elements, lat, lon);
}

function normalizePlaces(elements, userLat, userLon) {
    return elements.map(el => ({
        id: el.id,
        name: el.tags?.name || 'Unnamed place',
        lat: el.lat,
        lon: el.lon,
        distance: calculateDistance(
            userLat,
            userLon,
            el.lat,
            el.lon
        ),
        tags: {
            wikipedia: el.tags?.wikipedia,
            wikidata: el.tags?.wikidata,
            tourism: el.tags?.tourism,
            amenity: el.tags?.amenity,
            website: el.tags?.website
        }
    }));
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // meters
    const toRad = (deg) => deg * Math.PI / 180;

    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
        Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) *
        Math.cos(φ2) *
        Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c); // meters
}
