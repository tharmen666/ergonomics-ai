import { useState } from 'react';
import { GlowButton } from '../../components/ui/GlowButton';
import { useComplianceStore } from '../../store/complianceStore';

type SetupOption = 'Traditional Desk' | 'Bed' | 'Couch' | 'Kitchen Counter';

export const SelfAssessment = () => {
    const { processTelemetry, status, resetCompliance } = useComplianceStore();
    const [step, setStep] = useState(0); // 0: Office Hub Intro, 1: Desk height, 2: Monitor, 3: Lumbar, 4: Remote Setup selection, 5: Conditional setup question, 6: Completed
    
    // States for Office Hub questions
    const [deskCorrect, setDeskCorrect] = useState<boolean | null>(null);
    const [monitorCorrect, setMonitorCorrect] = useState<boolean | null>(null);
    const [lumbarCorrect, setLumbarCorrect] = useState<boolean | null>(null);

    // States for Remote Horizon
    const [remoteSetup, setRemoteSetup] = useState<SetupOption | null>(null);
    const [subQuestionAnswer, setSubQuestionAnswer] = useState<boolean | null>(null);

    const [assessmentResult, setAssessmentResult] = useState<{ triggered: boolean; reason: string } | null>(null);

    const handleNext = () => {
        if (step === 0) {
            setStep(1);
        } else if (step === 1) {
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        } else if (step === 3) {
            setStep(4);
        } else if (step === 4) {
            if (remoteSetup === 'Traditional Desk') {
                // If they are on traditional desk, we can skip the conditional question and complete
                completeAssessment('Traditional Desk', false);
            } else {
                setStep(5);
            }
        } else if (step === 5) {
            completeAssessment(remoteSetup!, subQuestionAnswer === true);
        }
    };

    const completeAssessment = (setup: SetupOption, isUnsafeCondition: boolean) => {
        let telemetryData = {
            pelvicSpineAngle: 90,
            cervicalSpineTilt: 10,
            shoulderElbowAngle: 95,
            shoulderElevation: 2,
            setupName: setup
        };

        if (isUnsafeCondition) {
            if (setup === 'Bed') {
                // Trigger Bed Workspace: pelvic-to-spine >= 120, cervical spine forward tilt >= 30
                telemetryData = {
                    pelvicSpineAngle: 125,
                    cervicalSpineTilt: 35,
                    shoulderElbowAngle: 100,
                    shoulderElevation: 5,
                    setupName: 'Bed'
                };
            } else if (setup === 'Kitchen Counter') {
                // Trigger Kitchen Counter: shoulder-to-elbow acute < 90, shoulder elevation >= 15
                telemetryData = {
                    pelvicSpineAngle: 90,
                    cervicalSpineTilt: 10,
                    shoulderElbowAngle: 75,
                    shoulderElevation: 20,
                    setupName: 'Kitchen Counter'
                };
            } else if (setup === 'Couch') {
                // Trigger Couch
                telemetryData = {
                    pelvicSpineAngle: 118,
                    cervicalSpineTilt: 28,
                    shoulderElbowAngle: 90,
                    shoulderElevation: 5,
                    setupName: 'Couch'
                };
            }
        }

        const res = processTelemetry(telemetryData);
        setAssessmentResult(res);
        setStep(6);
    };

    const handleRestart = () => {
        setDeskCorrect(null);
        setMonitorCorrect(null);
        setLumbarCorrect(null);
        setRemoteSetup(null);
        setSubQuestionAnswer(null);
        setAssessmentResult(null);
        setStep(0);
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md max-w-2xl mx-auto space-y-6">
            {step === 0 && (
                <div className="space-y-4 text-center py-6">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Ergonomic Domains Evaluation</h3>
                    <p className="text-gray-300">
                        This OHS assessment scans two primary workspace safety sectors: <strong>Office Hub</strong> ergonomics and your <strong>Remote Horizon</strong> setup.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-left pt-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-xs font-bold text-ohs-blue uppercase block mb-1">Office Hub Domain</span>
                            <span className="text-[11px] text-gray-400">Traditional desk ergonomics, monitor alignment, and physical support.</span>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-xs font-bold text-ohs-orange uppercase block mb-1">Remote Horizon Domain</span>
                            <span className="text-[11px] text-gray-400">Flex variables tracking posture constraints on Couch, Bed, and Counters.</span>
                        </div>
                    </div>
                    <div className="pt-6">
                        <GlowButton onClick={handleNext}>
                            Start Assessment
                        </GlowButton>
                    </div>
                </div>
            )}

            {/* Office Hub Step 1 */}
            {step === 1 && (
                <div className="space-y-6">
                    <div>
                        <span className="text-xs font-black text-ohs-blue uppercase tracking-widest block mb-1">Office Hub Domain (1/3)</span>
                        <h3 className="text-xl font-bold text-white">Desk Height Mechanics</h3>
                        <p className="text-gray-300 text-sm mt-2">
                            When typing on your keyboard, are your elbows relaxed and resting at approximately a 90-degree angle?
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setDeskCorrect(true)}
                            className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                                deskCorrect === true ? 'bg-ohs-blue border-ohs-blue text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            Yes, elbows are at 90°
                        </button>
                        <button
                            onClick={() => setDeskCorrect(false)}
                            className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                                deskCorrect === false ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            No, surface is too high/low
                        </button>
                    </div>
                    <div className="flex justify-end pt-4">
                        <GlowButton disabled={deskCorrect === null} onClick={handleNext}>Next Step</GlowButton>
                    </div>
                </div>
            )}

            {/* Office Hub Step 2 */}
            {step === 2 && (
                <div className="space-y-6">
                    <div>
                        <span className="text-xs font-black text-ohs-blue uppercase tracking-widest block mb-1">Office Hub Domain (2/3)</span>
                        <h3 className="text-xl font-bold text-white">Monitor Alignment</h3>
                        <p className="text-gray-300 text-sm mt-2">
                            Is the top of your primary display at or slightly below your natural horizontal eye level to prevent cervical neck stress?
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setMonitorCorrect(true)}
                            className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                                monitorCorrect === true ? 'bg-ohs-blue border-ohs-blue text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            Yes, monitor is at eye level
                        </button>
                        <button
                            onClick={() => setMonitorCorrect(false)}
                            className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                                monitorCorrect === false ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            No, I look down or stretch up
                        </button>
                    </div>
                    <div className="flex justify-end pt-4">
                        <GlowButton disabled={monitorCorrect === null} onClick={handleNext}>Next Step</GlowButton>
                    </div>
                </div>
            )}

            {/* Office Hub Step 3 */}
            {step === 3 && (
                <div className="space-y-6">
                    <div>
                        <span className="text-xs font-black text-ohs-blue uppercase tracking-widest block mb-1">Office Hub Domain (3/3)</span>
                        <h3 className="text-xl font-bold text-white">Lumbar Support Mechanics</h3>
                        <p className="text-gray-300 text-sm mt-2">
                            Does your work chair backrest engage and support the lower curvature of your spine to reduce lumbar strain?
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setLumbarCorrect(true)}
                            className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                                lumbarCorrect === true ? 'bg-ohs-blue border-ohs-blue text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            Yes, lumbar spine is supported
                        </button>
                        <button
                            onClick={() => setLumbarCorrect(false)}
                            className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                                lumbarCorrect === false ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            No, no support / I slouch forward
                        </button>
                    </div>
                    <div className="flex justify-end pt-4">
                        <GlowButton disabled={lumbarCorrect === null} onClick={handleNext}>Next Step</GlowButton>
                    </div>
                </div>
            )}

            {/* Remote Horizon Step 4 */}
            {step === 4 && (
                <div className="space-y-6">
                    <div>
                        <span className="text-xs font-black text-ohs-orange uppercase tracking-widest block mb-1">Remote Horizon Domain (1/2)</span>
                        <h3 className="text-xl font-bold text-white">Remote Workspace Interface</h3>
                        <p className="text-gray-300 text-sm mt-2">
                            Where are you actively logging your remote working hours from today?
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {(['Traditional Desk', 'Bed', 'Couch', 'Kitchen Counter'] as SetupOption[]).map((opt) => (
                            <button
                                key={opt}
                                onClick={() => setRemoteSetup(opt)}
                                className={`p-4 rounded-xl border text-sm font-bold transition-all text-left ${
                                    remoteSetup === opt ? 'bg-ohs-orange border-ohs-orange text-ohs-navy shadow-[0_0_15px_rgba(249,168,37,0.3)]' : 'bg-white/5 border-white/5 text-white hover:bg-white/10'
                                }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-end pt-4">
                        <GlowButton disabled={remoteSetup === null} onClick={handleNext}>Next Step</GlowButton>
                    </div>
                </div>
            )}

            {/* Remote Horizon Step 5 (Conditional Sub-question) */}
            {step === 5 && remoteSetup && (
                <div className="space-y-6">
                    <div>
                        <span className="text-xs font-black text-ohs-orange uppercase tracking-widest block mb-1">Remote Horizon Domain (2/2)</span>
                        <h3 className="text-xl font-bold text-white">
                            {remoteSetup === 'Bed' && "MediaPipe 3D Angle: Bed Workspace"}
                            {remoteSetup === 'Kitchen Counter' && "MediaPipe 3D Angle: Counter Elevation"}
                            {remoteSetup === 'Couch' && "MediaPipe 3D Angle: Couch Mechanics"}
                        </h3>
                        <p className="text-gray-300 text-sm mt-2">
                            {remoteSetup === 'Bed' && "Is your torso tilted back far with your neck bent forward looking at the screen? (Typically matches pelvic-to-spine angle >= 120° and cervical spine forward tilt)"}
                            {remoteSetup === 'Kitchen Counter' && "Are you shrugging/elevating your shoulders while typing with elbows forming a tight acute angle less than 90°?"}
                            {remoteSetup === 'Couch' && "Are you sinking into a deep seat without any support under your lower back?"}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setSubQuestionAnswer(true)}
                            className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                                subQuestionAnswer === true ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            Yes, this matches my setup
                        </button>
                        <button
                            onClick={() => setSubQuestionAnswer(false)}
                            className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                                subQuestionAnswer === false ? 'bg-ohs-blue border-ohs-blue text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            No, I am fully aligned/upright
                        </button>
                    </div>
                    <div className="flex justify-end pt-4">
                        <GlowButton disabled={subQuestionAnswer === null} onClick={handleNext}>Complete Assessment</GlowButton>
                    </div>
                </div>
            )}

            {/* Assessment Finished Step 6 */}
            {step === 6 && (
                <div className="text-center py-10 space-y-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${
                        assessmentResult?.triggered ? 'bg-red-500/20 text-red-500' : 'bg-ohs-green/20 text-ohs-green'
                    }`}>
                        {assessmentResult?.triggered ? (
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        ) : (
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>
                    
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight">Assessment Processed</h3>
                    
                    <div className="max-w-md mx-auto space-y-4">
                        <p className="text-gray-300 text-sm">
                            Your OHS status is currently graded as:
                        </p>
                        <div className={`text-lg font-black uppercase tracking-widest ${
                            assessmentResult?.triggered ? 'text-red-500' : 'text-ohs-green'
                        }`}>
                            {assessmentResult?.triggered ? 'Breach Status Detected' : 'Operational Compliance Maintained'}
                        </div>
                        {assessmentResult?.triggered ? (
                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-200 text-xs font-mono whitespace-normal text-left leading-relaxed">
                                {assessmentResult.reason}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-xs leading-relaxed">
                                Your workplace environment checks out successfully against the OHS compliance vector. Continue implementing regular Professional Resets.
                            </p>
                        )}
                    </div>

                    <div className="pt-6 flex gap-4 justify-center">
                        <button
                            onClick={handleRestart}
                            className="bg-white/5 hover:bg-white/10 text-white font-bold text-xs px-6 py-3 rounded-xl uppercase tracking-wider transition-all cursor-pointer border border-white/10"
                        >
                            Retake Assessment
                        </button>
                        {assessmentResult?.triggered && (
                            <button
                                onClick={() => {
                                    resetCompliance();
                                    handleRestart();
                                }}
                                className="bg-ohs-green text-ohs-navy hover:bg-green-400 font-black text-xs px-6 py-3 rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                            >
                                Quick Resolve
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
