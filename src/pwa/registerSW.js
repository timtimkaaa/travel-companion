export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/smart-travel-companion/service-worker.js')
        .then((registration) => {
                    console.log('Service Worker registered:', registration);

                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('New service worker found');

                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New version available
                                console.log('New content is available; please refresh.');
                                // You can show a notification to the user here
                                if (confirm('New version available! Reload to update?')) {
                                    window.location.reload();
                                }
                            }
                        });
                    });

                    // Listen for controlling changes
                    navigator.serviceWorker.addEventListener('controllerchange', () => {
                        console.log('Service Worker controller changed');
                        window.location.reload();
                    });
                })
                .catch((err) => console.error('Service Worker registration failed:', err));
        });
    }
}
