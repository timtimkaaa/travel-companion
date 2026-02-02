import { useEffect, useState } from 'react';
import { fetchWikipediaExtract } from '../api/wikipedia';

export default function Details({ place, onBack, onAddToJournal }) {
    const [wiki, setWiki] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadWiki() {
            if (!place?.tags?.wikipedia) return;

            setLoading(true);
            const data = await fetchWikipediaExtract(place.tags.wikipedia);
            setWiki(data);
            setLoading(false);
        }

        loadWiki();
    }, [place]);

    function openInMaps() {
        const url = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`;
        window.open(url, '_blank');
    }

    return (
        <section>
            <button onClick={onBack}>← Back</button>

            <h2>{place.name}</h2>

            {loading && <p>Loading description…</p>}

            {wiki?.extract ? (
                <p>{wiki.extract}</p>
            ) : (
                <p>No description available.</p>
            )}

            {wiki?.image && (
                <img
                    src={wiki.image}
                    alt={place.name}
                    style={{ maxWidth: '100%', marginTop: '1rem' }}
                />
            )}

            <div style={{ marginTop: '1rem' }}>
                <button onClick={() => onAddToJournal(place)}>
                    Add Note
                </button>

                <button onClick={openInMaps}>
                    Open in Maps
                </button>
            </div>
        </section>
    );
}
