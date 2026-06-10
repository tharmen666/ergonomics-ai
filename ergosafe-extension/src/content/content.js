(function () {
    // Only run if not already injected
    if (document.getElementById('ergosafe-overlay')) return;

    const contentTranslations = {
        en: {
            handshake_title: "COGNITIVE <span>HANDSHAKE</span>",
            handshake_subtitle: "Mandatory focus verification required to unblock this high-stress domain.",
            handshake_verified: "HANDSHAKE VERIFIED",
            handshake_nominal: "Cognitive latency nominal. Domain unlocked.",
            high_fatigue_detected: "HIGH FATIGUE DETECTED",
            lockout_desc: "You have been locked out of high-risk workflows. Please take a 15-minute reset break."
        },
        sw: {
            handshake_title: "MKATABA WA <span>UTAMBUZI</span>",
            handshake_subtitle: "Uthibitisho wa lazima wa umakini unahitajika ili kufungua mfumo huu wenye shinikizo kubwa.",
            handshake_verified: "MKATABA UMEHAKIKISHWA",
            handshake_nominal: "Muda wa majibu ni wa kawaida. Mfumo umefunguliwa.",
            high_fatigue_detected: "UCHOVU MKUBWA UMEGUNDULIWA",
            lockout_desc: "Umekataliwa kufanya kazi kwenye mifumo ya hatari kubwa. Tafadhali chukua mapumziko ya dakika 15."
        },
        zu: {
            handshake_title: "ISIVUMELWANO <span>SENGQONDO</span>",
            handshake_subtitle: "Kudingeka ukuqinisekiswa kokugxila okuyisibopho ukuze uvulele le ndawo enengcindezi enkulu.",
            handshake_verified: "ISIVUMELWANO SIPHASISIWE",
            handshake_nominal: "Isikhathi sokuphendula sivamile. Indawo ivuliwe.",
            high_fatigue_detected: "KUTHOLAKALE UMKHATHALA OPHEZULU",
            lockout_desc: "Uvaliwe ekusebenzeni okuyingozi enkulu. Sicela uthathe ikhefu lemizuzu engu-15 lokusetha kabusha."
        },
        xh: {
            handshake_title: "ISIVUMELWANO <span>SENGQONDO</span>",
            handshake_subtitle: "Uqinisekiso lokugxila olusisinyanzelo luyafuneka ukuze uvule le ndawo enengcindezi enkulu.",
            handshake_verified: "ISIVUMELWANO SIPHASISIWE",
            handshake_nominal: "Ukulibiseka kwengqondo kuqhelekile. Indawo ivuliwe.",
            high_fatigue_detected: "KUFUNYENWE UKUDINWA OKUKHULU",
            lockout_desc: "Uvaliwe ekusebenzeni okuyingozi enkulu. Nceda uthathe ikhefu lemizuzu eli-15 lokuseta kwakhona."
        },
        st: {
            handshake_title: "KANO EA <span>KELELLO</span>",
            handshake_subtitle: "Tlhahlobo e tlamang ea tsepamo ea kelello ea hlokahala ho notlolla sebaka sena se kotsi.",
            handshake_verified: "KANO E THIBETSOE",
            handshake_nominal: "Kelello e sebetsa hantle. Sebaka se notlolotsoe.",
            high_fatigue_detected: "HO LIEHA HO LEMOHILWE",
            lockout_desc: "U thibetsoe ho saena kapa ho sebetsa libakeng tse kotsi haholo. Ka kopo phomola metsotso e 15."
        }
    };

    const TOTAL_TARGETS = 5;
    const TIME_LIMIT = 30; // seconds
    let targetsHit = 0;
    let timeRemaining = TIME_LIMIT;
    let gameInterval;
    let targetTimeout;

    // Check fatigue state and active language
    chrome.storage.local.get(['fatigueLevel', 'language'], (result) => {
        const fatigue = result.fatigueLevel || 'low';
        const lang = result.language || 'en';

        if (fatigue === 'high') {
            injectLockout(lang);
        } else {
            injectOverlay(lang);
        }
    });

    // Listen for fatigue index changes (e.g. from popup sync telemetry button resetting it to low)
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes.fatigueLevel) {
            const newLevel = changes.fatigueLevel.newValue;
            if (newLevel === 'low') {
                const overlay = document.getElementById('ergosafe-overlay');
                if (overlay) {
                    overlay.remove();
                    document.body.style.overflow = '';
                }
            }
        }
    });

    function injectLockout(lang) {
        document.body.style.overflow = 'hidden';

        let overlay = document.getElementById('ergosafe-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'ergosafe-overlay';
            document.documentElement.appendChild(overlay);
        }

        const dict = contentTranslations[lang] || contentTranslations['en'];
        overlay.innerHTML = `
            <div id="ergosafe-title" style="color:#ef4444;">${dict.high_fatigue_detected}</div>
            <div id="ergosafe-subtitle">${dict.lockout_desc}</div>
        `;
    }

    function injectOverlay(lang) {
        document.body.style.overflow = 'hidden';

        let overlay = document.getElementById('ergosafe-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'ergosafe-overlay';
            document.documentElement.appendChild(overlay);
        }

        const dict = contentTranslations[lang] || contentTranslations['en'];
        overlay.innerHTML = `
            <div id="ergosafe-title">${dict.handshake_title}</div>
            <div id="ergosafe-subtitle">${dict.handshake_subtitle}</div>
            <div id="ergosafe-game-area"></div>
            <div id="ergosafe-timer">00:${TIME_LIMIT}</div>
        `;

        startGame(lang);
    }

    function startGame(lang) {
        gameInterval = setInterval(() => {
            timeRemaining--;
            document.getElementById('ergosafe-timer').innerText = `00:${timeRemaining.toString().padStart(2, '0')}`;
            
            if (timeRemaining <= 0) {
                endGame(false, lang);
            }
        }, 1000);

        spawnTarget(lang);
    }

    function spawnTarget(lang) {
        const gameArea = document.getElementById('ergosafe-game-area');
        if (!gameArea) return;

        // Clear existing targets
        gameArea.innerHTML = '';

        const target = document.createElement('div');
        target.className = 'ergosafe-target';
        
        // Random position within 10% to 90% bounds
        const x = 10 + Math.random() * 80;
        const y = 10 + Math.random() * 80;
        
        target.style.left = `${x}%`;
        target.style.top = `${y}%`;

        const spawnTime = Date.now();

        target.addEventListener('mousedown', () => {
            const reactionTime = Date.now() - spawnTime;
            
            // Cognitive Overload Check: Individual target > 850ms triggers failure
            if (reactionTime > 850) {
                clearTimeout(targetTimeout);
                endGame(false, lang);
                return;
            }

            targetsHit++;
            clearTimeout(targetTimeout);
            
            if (targetsHit >= TOTAL_TARGETS) {
                endGame(true, lang);
            } else {
                spawnTarget(lang);
            }
        });

        gameArea.appendChild(target);

        // If a target isn't clicked in 4 seconds, mark it as a latency failure
        targetTimeout = setTimeout(() => {
            endGame(false, lang);
        }, 4000);
    }

    function endGame(passed, lang) {
        clearInterval(gameInterval);
        clearTimeout(targetTimeout);

        const overlay = document.getElementById('ergosafe-overlay');
        if (!overlay) return;

        const dict = contentTranslations[lang] || contentTranslations['en'];
        
        if (passed) {
            overlay.innerHTML = `<div id="ergosafe-title" style="color:#4ade80;">${dict.handshake_verified}</div>
                                 <div id="ergosafe-subtitle">${dict.handshake_nominal}</div>`;
            
            chrome.runtime.sendMessage({ type: 'FATIGUE_UPDATE', level: 'low' });
            
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = '';
            }, 2000);
        } else {
            overlay.innerHTML = `<div id="ergosafe-title" style="color:#ef4444;">${dict.high_fatigue_detected}</div>
                                 <div id="ergosafe-subtitle">${dict.lockout_desc}</div>`;
            
            chrome.runtime.sendMessage({ type: 'FATIGUE_UPDATE', level: 'high' });
            // Keep the overlay active to enforce the lockout behavior.
        }
    }
})();
