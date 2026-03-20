document.getElementById('acceptBtn').addEventListener('click', () => {
    // Save state and close tab
    chrome.storage.local.set({ privacyAccepted: true }, () => {
        window.close();
    });
});
