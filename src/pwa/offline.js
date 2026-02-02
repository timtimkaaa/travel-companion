export function setupOfflineDetection(setIsOnline) {
    const update = () => {
        setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', update);
    window.addEventListener('offline', update);

    update();

    return () => {
        window.removeEventListener('online', update);
        window.removeEventListener('offline', update);
    };
}
