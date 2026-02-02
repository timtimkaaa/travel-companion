import { useEffect, useState } from 'react';
import { getAllNotes } from '../db/notes';

export default function Journal({ onOpenNote }) {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        getAllNotes().then(setNotes);
    }, []);

    if (!notes.length) {
        return <p>No notes yet.</p>;
    }

    return (
        <section>
            <h2>Travel Journal</h2>

            <ul>
                {notes.map(note => (
                    <li key={note.id} style={{ marginBottom: '1rem' }}>
                        <button
                            onClick={() => onOpenNote(note)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            {note.photos?.[0] && (
                                <img
                                    src={note.photos[0]}
                                    alt="Note preview"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        objectFit: 'cover',
                                        borderRadius: '4px'
                                    }}
                                />
                            )}
                            <div>
                                <strong>{note.placeName}</strong><br />
                                <small>{new Date(note.createdAt).toLocaleDateString()}</small>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </section>
    );
}
