import { useEffect, useMemo, useRef, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { KeyboardIcon } from '../../components/icons';
import { calculateAccuracy, calculateWpm, generatePassage } from '../../lib/typingTest';

const DURATIONS = [15, 30, 60] as const;
type Duration = (typeof DURATIONS)[number];
type Phase = 'idle' | 'running' | 'done';

// Comfortably covers 150+ WPM sustained for the longest (60s) duration.
const PASSAGE_WORD_COUNT = 250;

export default function TypingSpeedTest() {
  const [duration, setDuration] = useState<Duration>(30);
  const [passage, setPassage] = useState(() => generatePassage(PASSAGE_WORD_COUNT));
  const [typed, setTyped] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [, forceTick] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const restart = (nextDuration: Duration = duration) => {
    setDuration(nextDuration);
    setPassage(generatePassage(PASSAGE_WORD_COUNT));
    setTyped('');
    setPhase('idle');
    startedAtRef.current = null;
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  useEffect(() => {
    if (phase !== 'running') return;
    const interval = window.setInterval(() => {
      const startedAt = startedAtRef.current;
      if (startedAt !== null && Date.now() - startedAt >= duration * 1000) {
        setPhase('done');
      } else {
        forceTick((value) => value + 1);
      }
    }, 200);
    return () => window.clearInterval(interval);
  }, [phase, duration]);

  const handleChange = (value: string) => {
    if (phase === 'done' || value.length > passage.length) return;
    if (phase === 'idle' && value.length > 0) {
      startedAtRef.current = Date.now();
      setPhase('running');
    }
    setTyped(value);
  };

  const correctChars = useMemo(() => {
    let correct = 0;
    for (let i = 0; i < typed.length; i += 1) {
      if (typed[i] === passage[i]) correct += 1;
    }
    return correct;
  }, [typed, passage]);

  const elapsedMs = startedAtRef.current === null ? 0 : Math.min(Date.now() - startedAtRef.current, duration * 1000);
  const secondsLeft = phase === 'idle' ? duration : Math.max(0, duration - Math.floor(elapsedMs / 1000));
  const wpm = calculateWpm(correctChars, elapsedMs || 1);
  const accuracy = calculateAccuracy(correctChars, typed.length);

  return (
    <ToolLayout
      title="Typing Speed Test"
      description="Measure your typing speed in words per minute and accuracy - free, no account needed."
      seoDescription="Free online typing speed test. Measure your words per minute (WPM) and accuracy with randomized passages, right in your browser."
      path="/tools/typing-speed-test"
      icon={KeyboardIcon}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {DURATIONS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => restart(value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                duration === value ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {value}s
            </button>
          ))}
        </div>
        <div className="flex gap-6 text-sm">
          <span className="font-semibold text-slate-700">{secondsLeft}s left</span>
          <span className="font-semibold text-slate-700">{wpm} WPM</span>
          <span className="font-semibold text-slate-700">{accuracy}% accuracy</span>
        </div>
      </div>

      {phase === 'done' ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-5xl font-bold text-brand-600">{wpm}</p>
          <p className="mt-1 text-sm font-medium text-slate-500">words per minute</p>
          <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xl font-bold text-slate-800">{accuracy}%</p>
              <p className="text-slate-500">Accuracy</p>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{correctChars}</p>
              <p className="text-slate-500">Correct chars</p>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{typed.length - correctChars}</p>
              <p className="text-slate-500">Errors</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => restart()}
            className="mt-6 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          <div
            onClick={() => inputRef.current?.focus()}
            className="mt-6 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-lg leading-relaxed tracking-wide select-none"
          >
            {passage.split('').map((char, index) => {
              let className = 'text-slate-400';
              if (index < typed.length) {
                className = typed[index] === char ? 'text-slate-800' : 'text-red-600 bg-red-100';
              } else if (index === typed.length) {
                className = 'text-slate-800 border-l-2 border-brand-600';
              }
              return (
                <span key={index} className={className}>
                  {char}
                </span>
              );
            })}
          </div>
          <input
            ref={inputRef}
            value={typed}
            onChange={(event) => handleChange(event.target.value)}
            onPaste={(event) => event.preventDefault()}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="Click here and start typing..."
          />
          <button type="button" onClick={() => restart()} className="mt-4 rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-700">
            Restart
          </button>
        </>
      )}
    </ToolLayout>
  );
}
