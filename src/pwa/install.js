let deferredPrompt = null;

export function setupInstallPrompt() {
    window.addEventListener('DOMContentLoaded', () => {
        const installButton = document.getElementById('install-btn');

        if (!installButton) return;

        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            deferredPrompt = event;

            installButton.hidden = false;

            installButton.onclick = async () => {
                installButton.hidden = true;
                deferredPrompt.prompt();

                const { outcome } = await deferredPrompt.userChoice;
                console.log('Install outcome:', outcome);

                deferredPrompt = null;
            };
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA installed');
        });
    });
}
