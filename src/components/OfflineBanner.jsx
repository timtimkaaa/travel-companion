export default function OfflineBanner({ isOnline }) {
    console.log('Online status:', isOnline);

    if (isOnline) return null;

    return (
        <div style={{
            background: '#ffcc00',
            padding: '0.75rem',
            textAlign: 'center'
        }}>
            You are offline. Showing saved data only.
        </div>
    );
}
