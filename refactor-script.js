const fs = require('fs');
let training = fs.readFileSync('src/features/training/TrainingPage.tsx', 'utf8');

training = training.replace(/OHS Act Section 8: Duty to provide a safe working environment\./g, "OHS Act Section 8 Compliance: Ensuring a safe system of work.");

training = training.replace(/id: 'industrial'[\s\S]*?'remote'/, `id: 'office-alignment',
        title: "Stage 2: Office Alignment",
        description: "Targeted exercises for desk workers.",
        modules: [
            {
                id: 'shoulder-rolls',
                title: "Shoulder Rolls",
                description: "Release upper body tension with simple circular motions. OHS Act Section 8 Compliance: Ensuring a safe system of work.",
                duration: "2 min",
                steps: ["Sit up straight", "Roll shoulders back", "Repeat 10 times", "Breathe deeply"]
            },
            {
                id: 'wrist-flexor',
                title: "Wrist Flexor Stretches",
                description: "Prevent repetitive strain in the wrists and forearms. OHS Act Section 8 Compliance: Ensuring a safe system of work.",
                duration: "2 min",
                steps: ["Extend arm forward", "Pull fingers back", "Hold 15 seconds", "Switch arms"]
            },
            {
                id: 'lateral-neck',
                title: "Lateral Neck Tilts",
                description: "Relieve neck stiffness from extended screen monitoring. OHS Act Section 8 Compliance: Ensuring a safe system of work.",
                duration: "1 min",
                steps: ["Look straight ahead", "Tilt ear to shoulder", "Hold 10 seconds", "Switch sides"]
            }
        ]
    },
    {
        id: 'remote'`);

fs.writeFileSync('src/features/training/TrainingPage.tsx', training);
console.log('TrainingPage.tsx refactored successfully.');
