document.addEventListener('DOMContentLoaded', () => {
    const popiTitle = document.getElementById('popiTitle');
    const popiSubtitle = document.getElementById('popiSubtitle');
    const welcomeTitle = document.getElementById('welcomeTitle');
    const welcomeDesc = document.getElementById('welcomeDesc');
    const guardrailsTitle = document.getElementById('guardrailsTitle');
    const guardrail1 = document.getElementById('guardrail1');
    const guardrail2 = document.getElementById('guardrail2');
    const guardrail3 = document.getElementById('guardrail3');
    const acceptBtn = document.getElementById('acceptBtn');
    const langSelect = document.getElementById('langSelect');

    function applyTranslations(lang) {
        const dict = extTranslations[lang] || extTranslations['en'];
        
        popiTitle.textContent = dict.popi_title;
        popiSubtitle.textContent = dict.popi_subtitle;
        welcomeTitle.textContent = dict.welcome_title;
        welcomeDesc.textContent = dict.welcome_desc;
        guardrailsTitle.textContent = dict.guardrails_title;
        
        // Retain emojis for lists
        guardrail1.innerHTML = `⚙️ ${dict.guardrail_1}`;
        guardrail2.innerHTML = `👁️ ${dict.guardrail_2}`;
        guardrail3.innerHTML = `🔐 ${dict.guardrail_3}`;
        
        acceptBtn.textContent = dict.accept_btn;
    }

    // Load initial state
    chrome.storage.local.get(['language'], (result) => {
        const lang = result.language || 'en';
        langSelect.value = lang;
        applyTranslations(lang);
    });

    // Handle language change
    langSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        chrome.storage.local.set({ language: lang }, () => {
            applyTranslations(lang);
        });
    });

    acceptBtn.addEventListener('click', () => {
        // Save state and close tab
        chrome.storage.local.set({ privacyAccepted: true }, () => {
            window.close();
        });
    });
});
