import { useEffect, useState } from 'react';
import { setupOfflineDetection } from './pwa/offline';
import OfflineBanner from './components/OfflineBanner.jsx';
import { getCurrentLocation } from './pwa/geolocation.js';
import { fetchNearbyPlaces } from './api/overpass';
import { openDB, savePlaces, getAllPlaces } from './db/indexedDB';

import Home from './views/Home';
import Details from './views/Details';
import Note from './views/Note.jsx';
import Journal from './views/Journal.jsx';

import './App.css';

export default function App() {
    const [view, setView] = useState('home');
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const [location, setLocation] = useState(null);
    const [places, setPlaces] = useState([]);
    const [placesError, setPlacesError] = useState(null);
    const [loadingPlaces, setLoadingPlaces] = useState(false);

    useEffect(() => {
        const cleanup = setupOfflineDetection(setIsOnline);
        return cleanup;
    }, []);

    useEffect(() => {
        if (!isOnline) loadCachedPlaces();
    }, [isOnline]);

    useEffect(() => {
        openDB().catch(console.error);
    }, []);

    // Location & Places
    async function requestLocation() {
        try {
            const coords = await getCurrentLocation();
            setLocation(coords);
        } catch {
            setPlacesError('Location access denied');
        }
    }

    async function loadNearbyPlaces() {
        if (!location) return setPlacesError('Location not available');

        if (!isOnline) {
            await loadCachedPlaces();
            return;
        }

        try {
            setLoadingPlaces(true);
            setPlacesError(null);

            const results = await fetchNearbyPlaces(location.latitude, location.longitude);
            setPlaces(results);
            await savePlaces(results);
        } catch {
            setPlacesError('Failed to fetch places');
        } finally {
            setLoadingPlaces(false);
        }
    }

    async function loadCachedPlaces() {
        try {
            const cached = await getAllPlaces();
            setPlaces(cached);
        } catch (err) {
            console.error(err);
        }
    }

    // Navigation helpers
    function goHome() {
        setView('home');
        setSelectedPlace(null);
        setSelectedNote(null);
    }

    function goJournal() {
        setView('journal');
        setSelectedPlace(null);
        setSelectedNote(null);
    }

    function openDetails(place) {
        setSelectedPlace(place);
        setView('details');
    }

    function createNoteForPlace(place) {
        setSelectedPlace(place);
        setSelectedNote(null);
        setView('note');
    }

    function openExistingNote(note) {
        setSelectedNote(note);
        setSelectedPlace(null);
        setView('note');
    }

    return (
        <div className="app-container">
            <OfflineBanner isOnline={isOnline} />

            <header className="app-header">
                Smart Travel Companion
            </header>

            <main className="app-main">
                {view === 'home' && (
                    <div className="home-section">
                        <Home
                            onSelectPlace={openDetails}
                            isOnline={isOnline}
                            location={location}
                            onRequestLocation={requestLocation}
                            onLoadPlaces={loadNearbyPlaces}
                            places={places}
                            loading={loadingPlaces}
                            error={placesError}
                        />
                    </div>
                )}

                {view === 'details' && (
                    <Details
                        place={selectedPlace}
                        onBack={goHome}
                        onAddToJournal={createNoteForPlace}
                    />
                )}

                {view === 'note' && (
                    <Note
                        place={selectedPlace}
                        note={selectedNote}
                        onDone={() => setView('journal')}
                    />
                )}

                {view === 'journal' && (
                    <Journal onOpenNote={openExistingNote} />
                )}
            </main>

            <nav className="app-nav">
                <button
                    className={view === 'home' ? 'tab active' : 'tab'}
                    onClick={goHome}
                >
                    Home
                </button>

                <button
                    className={view === 'journal' ? 'tab active' : 'tab'}
                    onClick={goJournal}
                >
                    Journal
                </button>
            </nav>
        </div>
    );
}
