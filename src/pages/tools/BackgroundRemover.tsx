import { useEffect, useState } from 'react';
import FileDropzone from '../../components/FileDropzone';
import ToolLayout from '../../components/ToolLayout';
import { CutoutIcon } from '../../components/icons';
import { useAsyncTask } from '../../hooks/useAsyncTask';
import { downloadBlob, stripExtension } from '../../lib/fileHelpers';
import { removeBackground } from '../../lib/backgroundRemoval';

const CHECKERBOARD_STYLE = {
  backgroundImage:
    'linear-gradient(45deg,#f1f5f9 25%,transparent 25%),linear-gradient(-45deg,#f1f5f9 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#f1f5f9 75%),linear-gradient(-45deg,transparent 75%,#f1f5f9 75%)',
  backgroundSize: '16px 16px',
  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
};

export default function BackgroundRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const { status, error, run } = useAsyncTask();

  useEffect(() => {
    if (!file) {
      setOriginalUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (!resultBlob) {
      setResultUrl(null);
      return;
    }
    const url = URL.createObjectURL(resultBlob);
    setResultUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [resultBlob]);

  const handleFiles = (files: File[]) => {
    const [selected] = files;
    if (!selected) return;
    setFile(selected);
    setResultBlob(null);
  };

  const chooseAnother = () => {
    setFile(null);
    setResultBlob(null);
  };

  const process = () => {
    if (!file) return;
    void run(async () => {
      const blob = await removeBackground(file);
      setResultBlob(blob);
    });
  };

  return (
    <ToolLayout
      title="Background Remover"
      description="Remove the background from a photo and download a transparent PNG - powered by on-device AI, no uploads."
      seoDescription="Free background remover that cuts out photo backgrounds locally in your browser using on-device AI. No uploads, no sign-up, unlimited use."
      path="/tools/background-remover"
      icon={CutoutIcon}
    >
      {!file || !originalUrl ? (
        <FileDropzone
          accept="image/png,image/jpeg,image/webp"
          onFiles={handleFiles}
          label="Drop a photo here"
          hint="Works best on portraits and product photos - processed locally"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Original</p>
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img src={originalUrl} alt="Original upload" className="max-h-full max-w-full object-contain" />
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Background removed</p>
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-slate-200" style={CHECKERBOARD_STYLE}>
                {resultUrl ? (
                  <img src={resultUrl} alt="Background removed" className="max-h-full max-w-full object-contain" />
                ) : (
                  <p className="p-4 text-center text-sm text-slate-400">Result will appear here</p>
                )}
              </div>
            </div>
          </div>

          {status === 'error' && error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={status === 'processing'}
              onClick={process}
              className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm disabled:opacity-50"
            >
              {status === 'processing' ? 'Removing background... (first run downloads a small AI model)' : 'Remove background'}
            </button>
            {resultBlob && (
              <button
                type="button"
                onClick={() => downloadBlob(resultBlob, `${stripExtension(file.name)}-no-bg.png`)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-700"
              >
                Download PNG
              </button>
            )}
            <button type="button" onClick={chooseAnother} className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-700">
              Choose another photo
            </button>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
