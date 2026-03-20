document.addEventListener('DOMContentLoaded', () => {
    const fatigueLabel = document.getElementById('fatigueLabel');
    const syncBtn = document.getElementById('syncBtn');

    // Load initial state
    chrome.storage.local.get(['fatigueLevel'], (result) => {
        if (result.fatigueLevel === 'high') {
            fatigueLabel.textContent = 'HIGH FATIGUE';
            fatigueLabel.className = 'stat-value text-red';
            document.querySelector('.status-indicator').style.background = '#ef4444';
            document.querySelector('.status-indicator').style.boxShadow = '0 0 10px #ef4444';
        } else {
            fatigueLabel.textContent = 'Nominal';
            fatigueLabel.className = 'stat-value text-green';
        }
    });

    syncBtn.addEventListener('click', () => {
        syncBtn.textContent = 'SYNCING...';
        // Simulate fetch to Vercel API
        fetch('https://ergo-safe-reborn.vercel.app/api/sync', { method: 'POST', mode: 'no-cors' })
            .catch(() => { }) // Ignore no-cors error for mock
            .finally(() => {
                setTimeout(() => {
                    syncBtn.textContent = 'SYNC TELEMETRY';
                }, 1000);
            });
    });
});
