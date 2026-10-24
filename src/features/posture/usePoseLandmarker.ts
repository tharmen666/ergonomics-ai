import { useState, useEffect, useRef, useCallback } from 'react';
import { FilesetResolver, PoseLandmarker, NormalizedLandmark } from '@mediapipe/tasks-vision';

export interface PostureMetrics {
  neckFlexionAngle: number; // degrees deviation from vertical or baseline
  torsoSlouchAngle: number; // degrees deviation from vertical or baseline
  shoulderTiltAngle: number; // lateral shoulder imbalance degrees
  postureScore: number; // 0 - 100
  postureStatus: 'optimal' | 'warning' | 'critical';
  statusLabel: string;
  isCalibrated: boolean;
  sustainedBadPostureSeconds: number;
  landmarksDetected: boolean;
}

export interface UsePoseLandmarkerOptions {
  alertThresholdSeconds?: number; // seconds of bad posture to trigger alert
  onSustainedBadPosture?: (metrics: PostureMetrics, issueType: string) => void;
  voiceCooldownSeconds?: number;
}

export const usePoseLandmarker = (options: UsePoseLandmarkerOptions = {}) => {
  const {
    alertThresholdSeconds = 5,
    onSustainedBadPosture,
    voiceCooldownSeconds = 25
  } = options;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);

  const [metrics, setMetrics] = useState<PostureMetrics>({
    neckFlexionAngle: 0,
    torsoSlouchAngle: 0,
    shoulderTiltAngle: 0,
    postureScore: 100,
    postureStatus: 'optimal',
    statusLabel: 'Initializing Posture Engine...',
    isCalibrated: false,
    sustainedBadPostureSeconds: 0,
    landmarksDetected: false
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Baselines for personalized calibration
  const baselineNeckRef = useRef<number | null>(null);
  const baselineTorsoRef = useRef<number | null>(null);

  // Timers and tracking
  const badPostureStartTimeRef = useRef<number | null>(null);
  const lastAlertTimeRef = useRef<number>(0);
  const lastVideoTimeRef = useRef<number>(-1);

  // Initialize MediaPipe PoseLandmarker
  useEffect(() => {
    let isMounted = true;

    async function initLandmarker() {
      try {
        setIsLoading(true);
        setInitError(null);

        // Load WASM binaries from Google CDN
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.1/wasm'
        );

        if (!isMounted) return;

        // Try GPU first with fallback to CPU
        let landmarker: PoseLandmarker;
        try {
          landmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
              delegate: 'GPU'
            },
            runningMode: 'VIDEO',
            numPoses: 1,
            minPoseDetectionConfidence: 0.5,
            minPosePresenceConfidence: 0.5,
            minTrackingConfidence: 0.5
          });
        } catch (gpuErr) {
          console.warn('GPU delegate failed for PoseLandmarker, falling back to CPU:', gpuErr);
          landmarker = await PoseLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
              delegate: 'CPU'
            },
            runningMode: 'VIDEO',
            numPoses: 1
          });
        }

        if (!isMounted) return;
        landmarkerRef.current = landmarker;
        setIsLoading(false);
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Failed to initialize MediaPipe PoseLandmarker:', err);
        setInitError(err.message || 'Failed to initialize MediaPipe PoseLandmarker');
        setIsLoading(false);
      }
    }

    initLandmarker();

    return () => {
      isMounted = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
        landmarkerRef.current = null;
      }
      stopCamera();
    };
  }, []);

  // Biomechanical Angle Calculations
  const calculateAngles = useCallback(
    (landmarks: NormalizedLandmark[]) => {
      // Landmark indices:
      // Nose: 0
      // Left Ear: 7, Right Ear: 8
      // Left Shoulder: 11, Right Shoulder: 12
      // Left Hip: 23, Right Hip: 24

      const nose = landmarks[0];
      const leftEar = landmarks[7];
      const rightEar = landmarks[8];
      const leftShoulder = landmarks[11];
      const rightShoulder = landmarks[12];
      const leftHip = landmarks[23];
      const rightHip = landmarks[24];

      // Midpoints
      const earMid = {
        x: (leftEar.x + rightEar.x) / 2,
        y: (leftEar.y + rightEar.y) / 2
      };

      const shoulderMid = {
        x: (leftShoulder.x + rightShoulder.x) / 2,
        y: (leftShoulder.y + rightShoulder.y) / 2
      };

      const hasHips = (leftHip.visibility ?? 1) > 0.4 && (rightHip.visibility ?? 1) > 0.4;
      const hipMid = hasHips
        ? {
            x: (leftHip.x + rightHip.x) / 2,
            y: (leftHip.y + rightHip.y) / 2
          }
        : null;

      // 1. Neck Flexion Angle (vector from shoulder to ear relative to vertical)
      const neckDx = earMid.x - shoulderMid.x;
      const neckDy = shoulderMid.y - earMid.y; // positive when ear is above shoulder
      const rawNeckAngle = Math.abs(Math.atan2(neckDx, Math.max(0.01, neckDy)) * (180 / Math.PI));

      // 2. Torso Slouch Angle (vector from hip to shoulder relative to vertical)
      let rawTorsoAngle = 0;
      if (hipMid) {
        const torsoDx = shoulderMid.x - hipMid.x;
        const torsoDy = hipMid.y - shoulderMid.y;
        rawTorsoAngle = Math.abs(Math.atan2(torsoDx, Math.max(0.01, torsoDy)) * (180 / Math.PI));
      } else {
        // Approximate slouch via nose-to-shoulder vertical compression ratio
        const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
        const headDrop = Math.max(0.001, shoulderMid.y - nose.y);
        const compressionRatio = headDrop / Math.max(0.05, shoulderWidth);
        // Typical upright ratio ~ 0.8 - 1.1; slouching drops it below 0.6
        if (compressionRatio < 0.7) {
          rawTorsoAngle = Math.min(35, Math.round((0.7 - compressionRatio) * 60));
        }
      }

      // 3. Lateral Shoulder Tilt
      const shoulderDx = rightShoulder.x - leftShoulder.x;
      const shoulderDy = rightShoulder.y - leftShoulder.y;
      const rawTiltAngle = Math.abs(Math.atan2(shoulderDy, Math.max(0.01, Math.abs(shoulderDx))) * (180 / Math.PI));

      // Calibrated adjustments
      const baseNeck = baselineNeckRef.current ?? 10;
      const baseTorso = baselineTorsoRef.current ?? 6;

      const effectiveNeckFlexion = Math.max(0, Math.round(rawNeckAngle - (baselineNeckRef.current ? baseNeck - 8 : 0)));
      const effectiveTorsoSlouch = Math.max(0, Math.round(rawTorsoAngle - (baselineTorsoRef.current ? baseTorso - 5 : 0)));
      const effectiveTilt = Math.round(rawTiltAngle);

      // Scoring model (100 - penalties)
      let penalty = 0;
      if (effectiveNeckFlexion > 15) penalty += (effectiveNeckFlexion - 15) * 2.2;
      if (effectiveTorsoSlouch > 12) penalty += (effectiveTorsoSlouch - 12) * 2.5;
      if (effectiveTilt > 8) penalty += (effectiveTilt - 8) * 1.5;

      const score = Math.max(0, Math.min(100, Math.round(100 - penalty)));

      let status: 'optimal' | 'warning' | 'critical' = 'optimal';
      let statusLabel = 'Optimal Alignment';

      if (score < 60 || effectiveNeckFlexion >= 26 || effectiveTorsoSlouch >= 22) {
        status = 'critical';
        statusLabel = effectiveNeckFlexion >= 26 ? 'Critical Tech-Neck Strain' : 'Severe Torso Slouch';
      } else if (score < 80 || effectiveNeckFlexion > 17 || effectiveTorsoSlouch > 14) {
        status = 'warning';
        statusLabel = 'Moderate Postural Strain';
      }

      return {
        neckFlexionAngle: effectiveNeckFlexion,
        torsoSlouchAngle: effectiveTorsoSlouch,
        shoulderTiltAngle: effectiveTilt,
        postureScore: score,
        postureStatus: status,
        statusLabel,
        rawNeckAngle,
        rawTorsoAngle
      };
    },
    []
  );

  // Draw overlay skeleton on canvas
  const drawSkeleton = useCallback(
    (landmarks: NormalizedLandmark[], status: 'optimal' | 'warning' | 'critical', metricsData: any) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = (canvas.width = video.videoWidth || 640);
      const height = (canvas.height = video.videoHeight || 480);

      ctx.clearRect(0, 0, width, height);

      // Colors based on status
      const strokeColor =
        status === 'optimal'
          ? 'rgba(16, 185, 129, 0.9)' // Emerald Green
          : status === 'warning'
          ? 'rgba(245, 158, 11, 0.9)' // Amber
          : 'rgba(239, 68, 68, 0.95)'; // Crimson Red

      const glowColor =
        status === 'optimal'
          ? 'rgba(16, 185, 129, 0.4)'
          : status === 'warning'
          ? 'rgba(245, 158, 11, 0.4)'
          : 'rgba(239, 68, 68, 0.5)';

      const point = (lm: NormalizedLandmark) => ({
        x: lm.x * width,
        y: lm.y * height
      });

      const drawSegment = (fromLm: NormalizedLandmark, toLm: NormalizedLandmark, widthPx: number = 3) => {
        if ((fromLm.visibility ?? 1) < 0.3 || (toLm.visibility ?? 1) < 0.3) return;
        const p1 = point(fromLm);
        const p2 = point(toLm);

        ctx.save();
        ctx.strokeStyle = strokeColor;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 12;
        ctx.lineWidth = widthPx;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.restore();
      };

      const drawJoint = (lm: NormalizedLandmark, radius: number = 5) => {
        if ((lm.visibility ?? 1) < 0.3) return;
        const p = point(lm);

        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      };

      // Key landmark indices
      const nose = landmarks[0];
      const leftEar = landmarks[7];
      const rightEar = landmarks[8];
      const leftShoulder = landmarks[11];
      const rightShoulder = landmarks[12];
      const leftElbow = landmarks[13];
      const rightElbow = landmarks[14];
      const leftWrist = landmarks[15];
      const rightWrist = landmarks[16];
      const leftHip = landmarks[23];
      const rightHip = landmarks[24];

      // Draw Upper Body Connections
      drawSegment(leftShoulder, rightShoulder, 4); // Clavicle
      drawSegment(leftShoulder, leftElbow, 3);
      drawSegment(leftElbow, leftWrist, 3);
      drawSegment(rightShoulder, rightElbow, 3);
      drawSegment(rightElbow, rightWrist, 3);

      // Cervical Neck Vector (Shoulder mid to Ear mid)
      const earMidLm = {
        x: (leftEar.x + rightEar.x) / 2,
        y: (leftEar.y + rightEar.y) / 2,
        z: 0,
        visibility: 1
      };
      const shoulderMidLm = {
        x: (leftShoulder.x + rightShoulder.x) / 2,
        y: (leftShoulder.y + rightShoulder.y) / 2,
        z: 0,
        visibility: 1
      };
      drawSegment(shoulderMidLm as any, earMidLm as any, 4);
      drawSegment(earMidLm as any, nose, 2);

      // Torso Vector (if hips visible)
      if ((leftHip.visibility ?? 1) > 0.4 && (rightHip.visibility ?? 1) > 0.4) {
        drawSegment(leftShoulder, leftHip, 3);
        drawSegment(rightShoulder, rightHip, 3);
        drawSegment(leftHip, rightHip, 3);
      }

      // Draw Joints
      [nose, leftEar, rightEar, leftShoulder, rightShoulder, leftElbow, rightElbow, leftWrist, rightWrist].forEach(lm =>
        drawJoint(lm, 5)
      );

      // Draw real-time HUD label next to neck
      const neckPoint = point(earMidLm as any);
      ctx.save();
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      const text = `Neck: ${metricsData.neckFlexionAngle}°`;
      ctx.fillText(text, neckPoint.x + 12, neckPoint.y - 6);

      const statusTag = `Slouch: ${metricsData.torsoSlouchAngle}°`;
      ctx.fillText(statusTag, neckPoint.x + 12, neckPoint.y + 12);
      ctx.restore();
    },
    []
  );

  // Main processing loop
  const processFrame = useCallback(() => {
    if (!landmarkerRef.current || !videoRef.current || !isCameraActive) return;

    const video = videoRef.current;
    if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      const startTimeMs = performance.now();

      try {
        const detectionResult = landmarkerRef.current.detectForVideo(video, startTimeMs);

        if (detectionResult && detectionResult.landmarks && detectionResult.landmarks.length > 0) {
          const rawLandmarks = detectionResult.landmarks[0];
          const calculated = calculateAngles(rawLandmarks);

          // Sustained bad posture timing
          const now = Date.now();
          const isBad = calculated.postureStatus === 'critical' || calculated.postureStatus === 'warning';

          let sustainedSeconds = 0;
          if (isBad) {
            if (!badPostureStartTimeRef.current) {
              badPostureStartTimeRef.current = now;
            } else {
              sustainedSeconds = Math.round((now - badPostureStartTimeRef.current) / 1000);
            }

            // Check if alert threshold reached and cooldown expired
            if (
              sustainedSeconds >= alertThresholdSeconds &&
              now - lastAlertTimeRef.current >= voiceCooldownSeconds * 1000
            ) {
              lastAlertTimeRef.current = now;
              const issue =
                calculated.neckFlexionAngle > 22 && calculated.torsoSlouchAngle > 18
                  ? 'combined-slouch'
                  : calculated.neckFlexionAngle > 22
                  ? 'neck-flexion'
                  : 'torso-slouch';

              if (onSustainedBadPosture) {
                onSustainedBadPosture(
                  {
                    ...calculated,
                    isCalibrated: baselineNeckRef.current !== null,
                    sustainedBadPostureSeconds: sustainedSeconds,
                    landmarksDetected: true
                  },
                  issue
                );
              }
            }
          } else {
            badPostureStartTimeRef.current = null;
          }

          setMetrics({
            ...calculated,
            isCalibrated: baselineNeckRef.current !== null,
            sustainedBadPostureSeconds: sustainedSeconds,
            landmarksDetected: true
          });

          // Draw skeleton
          drawSkeleton(rawLandmarks, calculated.postureStatus, calculated);
        } else {
          setMetrics(prev => ({
            ...prev,
            landmarksDetected: false,
            statusLabel: 'Searching for User / Align in Camera...'
          }));
        }
      } catch (detectErr) {
        console.warn('Frame detection error:', detectErr);
      }
    }

    animFrameIdRef.current = requestAnimationFrame(processFrame);
  }, [isCameraActive, calculateAngles, drawSkeleton, alertThresholdSeconds, voiceCooldownSeconds, onSustainedBadPosture]);

  // Start Webcam
  const startCamera = useCallback(async () => {
    try {
      setCameraPermissionError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsCameraActive(true);
        };
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraPermissionError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in your browser to enable live biomechanical monitoring.'
          : err.message || 'Failed to access camera'
      );
      setIsCameraActive(false);
    }
  }, []);

  // Stop Webcam
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    setIsCameraActive(false);
    badPostureStartTimeRef.current = null;
    setMetrics(prev => ({
      ...prev,
      landmarksDetected: false,
      statusLabel: 'Camera Paused'
    }));
  }, []);

  // Start processing loop whenever camera activates
  useEffect(() => {
    if (isCameraActive) {
      animFrameIdRef.current = requestAnimationFrame(processFrame);
    } else if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [isCameraActive, processFrame]);

  // Calibrate user's current posture as neutral baseline
  const calibrateNeutralPosture = useCallback(() => {
    baselineNeckRef.current = metrics.neckFlexionAngle;
    baselineTorsoRef.current = metrics.torsoSlouchAngle;
    setMetrics(prev => ({
      ...prev,
      isCalibrated: true,
      postureScore: 100,
      postureStatus: 'optimal',
      statusLabel: 'Neutral Posture Calibrated'
    }));
  }, [metrics.neckFlexionAngle, metrics.torsoSlouchAngle]);

  const resetCalibration = useCallback(() => {
    baselineNeckRef.current = null;
    baselineTorsoRef.current = null;
    setMetrics(prev => ({
      ...prev,
      isCalibrated: false
    }));
  }, []);

  return {
    videoRef,
    canvasRef,
    isLoading,
    initError,
    isCameraActive,
    cameraPermissionError,
    metrics,
    startCamera,
    stopCamera,
    calibrateNeutralPosture,
    resetCalibration
  };
};
