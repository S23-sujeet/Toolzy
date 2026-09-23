import { useCallback, useEffect, useRef, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { ScreenRecordIcon } from '../../components/icons';
import { downloadBlob } from '../../lib/fileHelpers';

type Phase = 'idle' | 'recording' | 'stopped';

const SUPPORTED_MIME_TYPES = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default function ScreenRecorder() {
  const isSupported = typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getDisplayMedia) && typeof MediaRecorder !== 'undefined';

  const [phase, setPhase] = useState<Phase>('idle');
  const [includeMic, setIncludeMic] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  const previewRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const tracksRef = useRef<MediaStreamTrack[]>([]);
  const timerRef = useRef<number | null>(null);

  const cleanupTracks = useCallback(() => {
    tracksRef.current.forEach((track) => track.stop());
    tracksRef.current = [];
    if (previewRef.current) previewRef.current.srcObject = null;
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => cleanupTracks(), [cleanupTracks]);

  useEffect(() => {
    if (!recordedBlob) {
      setRecordedUrl(null);
      return;
    }
    const url = URL.createObjectURL(recordedBlob);
    setRecordedUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [recordedBlob]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      let audioTracks = displayStream.getAudioTracks();
      if (includeMic) {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioTracks = micStream.getAudioTracks();
      }
      const combined = new MediaStream([...displayStream.getVideoTracks(), ...audioTracks]);
      tracksRef.current = [...displayStream.getTracks(), ...audioTracks];

      if (previewRef.current) {
        previewRef.current.srcObject = displayStream;
        await previewRef.current.play().catch(() => {});
      }

      const mimeType = SUPPORTED_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(combined, mimeType ? { mimeType } : undefined);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = () => {
        setRecordedBlob(new Blob(chunks, { type: recorder.mimeType || 'video/webm' }));
        cleanupTracks();
        setPhase('stopped');
      };
      recorderRef.current = recorder;

      displayStream.getVideoTracks()[0].addEventListener('ended', stopRecording);

      recorder.start();
      setSeconds(0);
      setPhase('recording');
      timerRef.current = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    } catch (err) {
      cleanupTracks();
      setError(err instanceof Error ? err.message : 'Screen recording permission was denied or canceled.');
    }
  };

  const reset = () => {
    setRecordedBlob(null);
    setPhase('idle');
    setError(null);
    setSeconds(0);
  };

  if (!isSupported) {
    return (
      <ToolLayout title="Screen Recorder" description="Record your screen and download it as a video." path="/tools/screen-recorder" icon={ScreenRecordIcon}>
        <p className="text-sm text-red-600">Screen recording isn't supported in this browser. Try the latest Chrome, Edge or Firefox on desktop.</p>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout
      title="Screen Recorder"
      description="Record your screen (and optionally your microphone) and download a video - nothing is uploaded."
      seoDescription="Free browser-based screen recorder. Record your screen, tab or window and download a WebM video with no uploads or sign-up."
      path="/tools/screen-recorder"
      icon={ScreenRecordIcon}
    >
      {phase !== 'stopped' && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
          <video ref={previewRef} muted autoPlay playsInline className="aspect-video w-full object-contain" />
        </div>
      )}

      {phase === 'idle' && (
        <>
          <label className="mt-5 flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={includeMic} onChange={(event) => setIncludeMic(event.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            Include microphone audio
          </label>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <button
            type="button"
            onClick={() => void startRecording()}
            className="mt-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm"
          >
            Start recording
          </button>
        </>
      )}

      {phase === 'recording' && (
        <div className="mt-5 flex items-center gap-4">
          <span className="flex items-center gap-2 text-sm font-semibold text-red-600">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-600" /> Recording {formatDuration(seconds)}
          </span>
          <button type="button" onClick={stopRecording} className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-700">
            Stop recording
          </button>
        </div>
      )}

      {phase === 'stopped' && recordedUrl && (
        <>
          <video src={recordedUrl} controls className="w-full rounded-xl border border-slate-200" />
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => recordedBlob && downloadBlob(recordedBlob, `screen-recording-${Date.now()}.webm`)}
              className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm"
            >
              Download video
            </button>
            <button type="button" onClick={reset} className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-700">
              Record again
            </button>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
