chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        chrome.tabs.create({ url: chrome.runtime.getURL('src/pages/privacy.html') });
        chrome.storage.local.set({ fatigueLevel: 'low', safetyStreak: 0, lastSync: Date.now() });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'FATIGUE_UPDATE') {
        chrome.storage.local.set({ fatigueLevel: message.level, lastSync: Date.now() });
        sendResponse({ success: true });
    } else if (message.type === 'GET_FATIGUE') {
        chrome.storage.local.get(['fatigueLevel'], (result) => {
            sendResponse({ fatigueLevel: result.fatigueLevel || 'low' });
        });
        return true; // Keep message channel open for async response
    }
});
