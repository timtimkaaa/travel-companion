const DB_NAME = 'smart-travel-db';
const DB_VERSION = 2;
const PLACES_STORE = 'places';
const NOTES_STORE = 'notes';

let db = null;

export function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject('Failed to open IndexedDB');

        request.onupgradeneeded = (event) => {
            const database = event.target.result;

            if (!database.objectStoreNames.contains(PLACES_STORE)) {
                database.createObjectStore(PLACES_STORE, {
                    keyPath: 'id'
                });
            }
            if (!database.objectStoreNames.contains(NOTES_STORE)) {
                database.createObjectStore(NOTES_STORE, {
                    keyPath: 'id'
                });
            }

        };

        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };
    });
}

export async function savePlaces(places) {
    if (!db) await openDB();

    const tx = db.transaction(PLACES_STORE, 'readwrite');
    const store = tx.objectStore(PLACES_STORE);

    for (const place of places) {
        store.put(place);
    }

    return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject('Failed to save places');
    });
}


export async function getAllPlaces() {
    if (!db) await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(PLACES_STORE, 'readonly');
        const store = tx.objectStore(PLACES_STORE);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject('Failed to read places');
    });
}
