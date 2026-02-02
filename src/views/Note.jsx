import { useEffect, useState } from 'react';
import { saveNote } from '../db/notes';
import { deleteNote } from '../db/notes';

export default function Note({ place, note, onDone }) {
    const isEditingExisting = !!note;

    const [text, setText] = useState('');
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        if (note) {
            setText(note.text);
            setPhotos(note.photos || []);
        } else {
            setText('');
            setPhotos([]);
        }
    }, [note, place]);

    async function handleSave() {
        const now = Date.now();

        const newNote = {
            id: note?.id || `${place.id}-${now}`,
            placeId: note?.placeId || place.id,
            placeName: note?.placeName ?? place?.name ?? 'Unknown place',
            lat: note?.lat || place.lat,
            lon: note?.lon || place.lon,
            text,
            photos,
            createdAt: note?.createdAt || now,
            updatedAt: now
        };

        await saveNote(newNote);
        onDone();
    }

    async function handlePhotoCapture(e) {
        const file = e.target.files[0];
        if (!file) return;

        const compressed = await compressImage(file);

        const reader = new FileReader();
        reader.onload = () => {
            setPhotos(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(compressed);
    }


    async function handleDelete() {
        if (!note) return; // only existing notes
        const confirmed = confirm('Are you sure you want to delete this note?');
        if (!confirmed) return;

        await deleteNote(note.id);
        onDone(); // navigate back to Journal
    }


    async function compressImage(file, maxWidth = 1280) {
        const img = await createImageBitmap(file);

        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        return new Promise(resolve =>
            canvas.toBlob(resolve, 'image/jpeg', 0.7)
        );
    }

    if (!place && !note) {
        return <p>No note selected.</p>;
    }

    return (
        <section>
            <h2>
                {isEditingExisting
                    ? `Note: ${note.placeName}`
                    : `New Note for ${place.name}`}
            </h2>

            <textarea
                rows={8}
                value={text}
                placeholder="Write your travel notes here..."
                onChange={e => setText(e.target.value)}
            />

            <div style={{ marginTop: '1rem' }}>
                <label>
                    📸 Add photo
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoCapture}
                        hidden
                    />
                </label>
            </div>

            {photos.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                    {photos.map((src, i) => (
                        <img
                            key={i}
                            src={src}
                            alt="Note photo"
                            style={{
                                maxWidth: '100%',
                                marginBottom: '0.5rem'
                            }}
                        />
                    ))}
                </div>
            )}

            <button
                onClick={handleSave}
                disabled={!text.trim()}
                style={{ marginTop: '1rem' }}
            >
                {isEditingExisting ? 'Update Note' : 'Save Note'}
            </button>

            {note && (
                <button
                    onClick={handleDelete}
                    style={{ marginTop: '0.5rem', color: 'red' }}
                >
                    Delete Note
                </button>
            )}


        </section>
    );
}
