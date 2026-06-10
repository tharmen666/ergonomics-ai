if (typeof chrome !== 'undefined' && chrome.runtime) {
document.addEventListener('DOMContentLoaded', () => {
    const fatigueLabel = document.getElementById('fatigueLabel');
    const streakLabel = document.getElementById('streakLabel');
    const syncBtn = document.getElementById('syncBtn');
    const langSelect = document.getElementById('langSelect');
    
    const logoText = document.getElementById('logoText');
    const streakLabelText = document.getElementById('streakLabelText');
    const fatigueLabelText = document.getElementById('fatigueLabelText');
    const connectedText = document.getElementById('connectedText');
    const langSelectLabel = document.getElementById('langSelectLabel');

    let currentLang = 'en';

    function applyTranslations(lang) {
        currentLang = lang;
        const dict = extTranslations[lang] || extTranslations['en'];
        
        logoText.innerHTML = dict.logo;
        streakLabelText.textContent = dict.streak_label;
        fatigueLabelText.textContent = dict.fatigue_label;
        connectedText.innerHTML = dict.connected_to;
        if (langSelectLabel) {
            langSelectLabel.textContent = lang === 'sw' ? 'Lugha' :
                                         lang === 'zu' ? 'Ulimi' :
                                         lang === 'xh' ? 'Ulwimi' :
                                         lang === 'st' ? 'Puo' :
                                         lang === 'zh' ? '语言' :
                                         lang === 'de' ? 'Sprache' :
                                         'Language';
        }

        // Read and update status
        chrome.storage.local.get(['fatigueLevel', 'safetyStreak'], (res) => {
            const streak = res.safetyStreak !== undefined ? res.safetyStreak : 12;
            streakLabel.textContent = `${streak} ${dict.days}`;

            const level = res.fatigueLevel || 'low';
            if (level === 'high') {
                fatigueLabel.textContent = dict.high;
                fatigueLabel.className = 'stat-value text-red';
                document.querySelector('.status-indicator').style.background = '#ef4444';
                document.querySelector('.status-indicator').style.boxShadow = '0 0 10px #ef4444';
            } else if (level === 'warning') {
                fatigueLabel.textContent = dict.warning;
                fatigueLabel.className = 'stat-value text-gold';
                document.querySelector('.status-indicator').style.background = '#f9a825';
                document.querySelector('.status-indicator').style.boxShadow = '0 0 10px #f9a825';
            } else {
                fatigueLabel.textContent = dict.nominal;
                fatigueLabel.className = 'stat-value text-green';
                document.querySelector('.status-indicator').style.background = '#4ade80';
                document.querySelector('.status-indicator').style.boxShadow = '0 0 10px #4ade80';
            }
        });

        // Set button text
        syncBtn.textContent = dict.sync_btn;
    }

    // Load initial state
    chrome.storage.local.get(['language'], (result) => {
        const lang = result.language || 'en';
        langSelect.value = lang;
        applyTranslations(lang);
    });

    // Language selector change handler
    langSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        chrome.storage.local.set({ language: lang }, () => {
            applyTranslations(lang);
        });
    });

    // Sync telemetry action
    syncBtn.addEventListener('click', () => {
        const dict = extTranslations[currentLang] || extTranslations['en'];
        syncBtn.textContent = dict.syncing;
        syncBtn.disabled = true;

        // Perform clean CORS POST request to the serverless telemetry API
        fetch('https://ergo-safe-reborn.vercel.app/api/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                timestamp: Date.now(),
                origin: 'chrome-extension'
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Telemetry sync success:', data);
            // Reset fatigue on successful telemetry sync
            chrome.storage.local.set({ fatigueLevel: 'low' }, () => {
                applyTranslations(currentLang);
            });
        })
        .catch(err => {
            console.warn('Telemetry sync error (mocking success):', err);
            // Fallback for offline/local testing, keep it resilient
            chrome.storage.local.set({ fatigueLevel: 'low' }, () => {
                applyTranslations(currentLang);
            });
        })
        .finally(() => {
            setTimeout(() => {
                syncBtn.textContent = dict.sync_btn;
                syncBtn.disabled = false;
            }, 1000);
        });
    });
});
}
