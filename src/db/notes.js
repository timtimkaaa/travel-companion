import { openDB } from './indexedDB';

const STORE = 'notes';

export async function saveNote(note) {
    const db = await openDB();

    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);

    store.put(note);

    return new Promise((resolve, reject) => {
        tx.oncomplete = resolve;
        tx.onerror = reject;
    });
}

export async function getAllNotes() {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readonly');
        const store = tx.objectStore(STORE);
        const req = store.getAll();

        req.onsuccess = () => resolve(req.result);
        req.onerror = reject;
    });
}

export async function deleteNote(id) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction('notes', 'readwrite');
        const store = tx.objectStore('notes');

        const req = store.delete(id);

        req.onsuccess = () => resolve();
        req.onerror = () => reject('Failed to delete note');
    });
}


export async function getNoteById(id) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readonly');
        const store = tx.objectStore(STORE);
        const req = store.get(id);

        req.onsuccess = () => resolve(req.result);
        req.onerror = reject;
    });
}
