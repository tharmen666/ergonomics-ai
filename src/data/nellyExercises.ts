/**
 * Nelly's self-care exercise library (prototype).
 * General, low-risk movements only. Every exercise carries the same safety rule:
 * gentle, never into sharp pain. Content must be signed off by an occupational
 * health practitioner / physiotherapist before any client pilot.
 */
export type PainArea = 'neck' | 'back' | 'shoulder' | 'wrist' | 'eyes' | 'legs';

export interface Exercise {
    name: string;
    how: string;
}

export const EXERCISE_REVIEW_STATUS = 'PENDING_PRACTITIONER_SIGNOFF' as const;

export const AREA_LABEL: Record<PainArea, string> = {
    neck: 'neck',
    back: 'back',
    shoulder: 'shoulder',
    wrist: 'wrist or hand',
    eyes: 'eye',
    legs: 'leg or foot',
};

export const EXERCISES: Record<PainArea, Exercise[]> = {
    neck: [
        { name: 'Chin tuck', how: 'Sit tall and glide your chin straight back, like making a double chin. Hold 5 seconds, repeat 8 times.' },
        { name: 'Gentle side stretch', how: 'Let one ear drift toward the same shoulder. No pulling. Hold 20 seconds each side.' },
        { name: 'Shoulder blade squeeze', how: 'Squeeze your shoulder blades back and down. Hold 5 seconds, repeat 10 times.' },
    ],
    back: [
        { name: 'Stand and walk', how: 'Stand up and walk for 2 minutes. Do this every 30 to 45 minutes.' },
        { name: 'Glute bridge', how: 'Lie on your back, knees bent. Lift your hips, hold 5 seconds, lower slowly. Start with 6 and build up.' },
        { name: 'Cat-camel', how: 'On hands and knees, slowly round then arch your back. 8 slow repeats.' },
    ],
    shoulder: [
        { name: 'Doorway chest stretch', how: 'Forearm on a door frame, step through gently until you feel a mild stretch. Hold 20 seconds each side.' },
        { name: 'Shoulder blade squeeze', how: 'Squeeze your shoulder blades back and down. Hold 5 seconds, repeat 10 times.' },
        { name: 'Shoulder rolls', how: 'Roll your shoulders slowly backwards 10 times.' },
    ],
    wrist: [
        { name: 'Wrist flexor stretch', how: 'Arm out, palm up. With the other hand, gently ease the fingers back. Hold 15 to 20 seconds each side.' },
        { name: 'Wrist extensor stretch', how: 'Arm out, palm down. Gently ease the hand toward the floor. Hold 15 to 20 seconds each side.' },
        { name: 'Shake out and switch', how: 'Shake your hands loose for 10 seconds, and swap hands for your phone or mouse when you can.' },
    ],
    eyes: [
        { name: '20-20-20 rule', how: 'Every 20 minutes, look at something about 6 metres away for 20 seconds.' },
        { name: 'Full blinks', how: 'Blink slowly and fully 10 times. We blink less when staring at screens.' },
        { name: 'Screen check', how: 'Keep the screen at arm\'s length, top of the screen at or just below eye level, and reduce glare.' },
    ],
    legs: [
        { name: 'Ankle pumps', how: 'Seated, point and flex your feet 15 times.' },
        { name: 'Calf raises', how: 'Holding your desk, rise onto your toes and lower slowly. 10 repeats.' },
        { name: 'Stand and walk', how: 'Stand up and walk for 2 minutes. Do this every 30 to 45 minutes.' },
    ],
};

