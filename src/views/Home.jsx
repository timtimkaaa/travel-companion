export default function Home({
                                 onSelectPlace,
                                 isOnline,
                                 location,
                                 onRequestLocation,
                                 onLoadPlaces,
                                 places,
                                 loading,
                                 error
                             }) {
    return (
        <section>
            <h2>Nearby Places</h2>

            {!location && (
                <>
                    <p>We need your location to find nearby attractions.</p>
                    <button onClick={onRequestLocation}>
                        Allow Location Access
                    </button>
                </>
            )}

            {location && (
                <button
                    onClick={onLoadPlaces}
                    disabled={!isOnline}
                >
                    {isOnline ? 'Find Nearby Places' : 'Offline mode'}
                </button>
            )}

            {loading && <p>Loading places…</p>}

            {error && (
                <p style={{ color: 'red' }}>{error}</p>
            )}



            <ul>
                {places.map((place) => (
                    <li key={place.id}>
                        <button onClick={() => onSelectPlace(place)}>
                            {place.name} – {place.distance} m
                        </button>
                    </li>
                ))}
            </ul>

            {!isOnline && (
                <p>
                    Offline mode: showing cached places only.
                </p>
            )}
        </section>
    );
}
