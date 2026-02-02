export function getPlaceDescription(place) {
    return (
        place.tags?.description ||
        place.tags?.tourism ||
        place.tags?.amenity ||
        'No description available'
    );
}
