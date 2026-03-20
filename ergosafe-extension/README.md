# ErgoSafe: AI Safety Layer [Chrome Extension]

Welcome to the ErgoSafe Reborn V3 Manifest Chrome Extension.

This standalone browser extension acts as an autonomous "Digital Wingman" for remote professionals. It actively monitors behavior and enforces the *Mandatory Cognitive Handshake* across high-stress environments.

## Features

- **POPI Shield:** First-run privacy handshake ensuring end-to-end encryption and "Human in the Loop" compliance.
- **Cognitive Interception:** Injects a Mandatory 30-Second Cognitive Handshake overlay directly onto `mail.google.com`, `teams.microsoft.com`, and `slack.com`.
- **DOA Lockout Logic:** If cognitive latency exceeds acceptable thresholds, the extension sets global fatigue to `HIGH` and simulates a lockout.
- **Dashboard Telemetry Sync:** The `popup.html` dashboard provides a persistent view of your Safety Streak and Fatigue Index with simulated fetches to the Vercel backend.

## Installation Instructions (Developer Mode)

1. Open Google Chrome.
2. Navigate to `chrome://extensions/` in your URL bar.
3. Toggle the **Developer mode** switch in the top right corner to **ON**.
4. Click the **Load unpacked** button in the top left corner.
5. Select the `ergosafe-extension` folder on your desktop (`c:\Users\Desigan Thermen\Desktop\ErgoSafe_Project\ergosafe-extension`).
6. The extension is now installed! You will immediately see the **POPI Privacy Shield** open in a new tab.

## Testing the Extension

1. Pin the **ErgoSafe Wingman** extension to your Chrome toolbar.
2. Click the icon to view your current Safety Streak and Fatigue Index, and simulate a Vercel telemetry sync.
3. Navigate to `https://mail.google.com` or `https://teams.microsoft.com`.
4. Observe the **Cognitive Handshake** overlay physically blocking the DOM, forcing you to verify focus before returning to work.
