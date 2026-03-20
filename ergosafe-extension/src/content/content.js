(function () {
    // Only run if not already injected
    if (document.getElementById('ergosafe-overlay')) return;

    // Check if we need to run (maybe user already passed today or fatigue is low)
    chrome.runtime.sendMessage({ type: 'GET_FATIGUE' }, (response) => {
        // Here we could skip if fatigue is nominal, but for the demo we force it periodically.
        // Let's just run it once per session for demonstration.

        injectOverlay();
    });

    const TOTAL_TARGETS = 5;
    const TIME_LIMIT = 30; // seconds
    let targetsHit = 0;
    let timeRemaining = TIME_LIMIT;
    let gameInterval;
    let targetTimeout;

    function injectOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'ergosafe-overlay';

        overlay.innerHTML = `
            <div id="ergosafe-title">COGNITIVE <span>HANDSHAKE</span></div>
            <div id="ergosafe-subtitle">Mandatory focus verification required to unblock this high-stress domain.</div>
            <div id="ergosafe-game-area"></div>
            <div id="ergosafe-timer">00:${TIME_LIMIT}</div>
        `;

        document.documentElement.appendChild(overlay);

        startGame();
    }

    function startGame() {
        // Prevent scrolling while overlay is active
        document.body.style.overflow = 'hidden';

        gameInterval = setInterval(() => {
            timeRemaining--;
            document.getElementById('ergosafe-timer').innerText = \`00:\${timeRemaining.toString().padStart(2, '0')}\`;
            
            if (timeRemaining <= 0) {
                endGame(false);
            }
        }, 1000);

        spawnTarget();
    }

    function spawnTarget() {
        const gameArea = document.getElementById('ergosafe-game-area');
        if (!gameArea) return;

        // Clear existing targets
        gameArea.innerHTML = '';

        const target = document.createElement('div');
        target.className = 'ergosafe-target';
        
        // Random position within 10% to 90% bounds
        const x = 10 + Math.random() * 80;
        const y = 10 + Math.random() * 80;
        
        target.style.left = \`\${x}%\`;
        target.style.top = \`\${y}%\`;

        target.addEventListener('mousedown', () => {
            targetsHit++;
            clearTimeout(targetTimeout);
            
            if (targetsHit >= TOTAL_TARGETS) {
                endGame(true);
            } else {
                spawnTarget();
            }
        });

        gameArea.appendChild(target);

        // If a target isn't clicked in 4 seconds, mark it as a latency failure
        targetTimeout = setTimeout(() => {
            endGame(false);
        }, 4000);
    }

    function endGame(passed) {
        clearInterval(gameInterval);
        clearTimeout(targetTimeout);

        const overlay = document.getElementById('ergosafe-overlay');
        
        if (passed) {
            overlay.innerHTML = \`<div id="ergosafe-title" style="color:#4ade80;">HANDSHAKE VERIFIED</div>
                                 <div id="ergosafe-subtitle">Cognitive latency nominal. Domain unlocked.</div>\`;
            
            chrome.runtime.sendMessage({ type: 'FATIGUE_UPDATE', level: 'low' });
            
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = '';
            }, 2000);
        } else {
            overlay.innerHTML = \`<div id="ergosafe-title" style="color:#ef4444;">HIGH FATIGUE DETECTED</div>
                                 <div id="ergosafe-subtitle">You have been locked out of high-risk workflows. Please take a 15-minute reset break.</div>\`;
            
            chrome.runtime.sendMessage({ type: 'FATIGUE_UPDATE', level: 'high' });
            
            // In a real app we might redirect to a safe page or leave them locked out for X minutes.
            // For this demo, we unlock after 5 seconds to not permanently break their browser.
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = '';
            }, 5000);
        }
    }
})();
