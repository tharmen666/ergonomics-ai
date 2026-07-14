export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    console.log(`[Telemetry Event] ${eventName}`, properties);
};
