import { FilesetResolver, ImageSegmenter } from '@mediapipe/tasks-vision';

// Keep in sync with the installed @mediapipe/tasks-vision version in package.json.
const TASKS_VISION_VERSION = '1.0.1';
const WASM_BASE_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${TASKS_VISION_VERSION}/wasm`;
const SELFIE_MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite';

let segmenterPromise: Promise<ImageSegmenter> | null = null;

/** Lazily creates a single reusable segmenter (Apache-2.0 model) so its ~few-MB assets are only fetched once per session. */
function loadSegmenter(): Promise<ImageSegmenter> {
  if (!segmenterPromise) {
    segmenterPromise = (async () => {
      const vision = await FilesetResolver.forVisionTasks(WASM_BASE_URL);
      return ImageSegmenter.createFromOptions(vision, {
        baseOptions: { modelAssetPath: SELFIE_MODEL_URL, delegate: 'CPU' },
        runningMode: 'IMAGE',
        outputCategoryMask: false,
        outputConfidenceMasks: true,
      });
    })();
  }
  return segmenterPromise;
}

/**
 * Removes the background from a photo of a person, returning a transparent PNG.
 * Runs entirely client-side via an on-device MediaPipe selfie-segmentation model - the
 * photo itself is never uploaded, only generic (non-user) model/runtime assets are fetched.
 */
export async function removeBackground(file: File): Promise<Blob> {
  const segmenter = await loadSegmenter();

  const bitmap = await createImageBitmap(file);
  const sourceCanvas = document.createElement('canvas');
  sourceCanvas.width = bitmap.width;
  sourceCanvas.height = bitmap.height;
  const sourceCtx = sourceCanvas.getContext('2d');
  if (!sourceCtx) throw new Error('Your browser could not prepare the image.');
  sourceCtx.drawImage(bitmap, 0, 0);
  bitmap.close();

  const result = await new Promise<import('@mediapipe/tasks-vision').ImageSegmenterResult>((resolve) => {
    segmenter.segment(sourceCanvas, resolve);
  });

  // The selfie segmenter model exports a single foreground-confidence channel (index 0). Some
  // segmentation models instead export one channel per category (background=0, person=1) -
  // handle both shapes defensively.
  const masks = result.confidenceMasks ?? [];
  const personMask = masks.length > 1 ? masks[1] : masks[0];
  if (!personMask) {
    masks.forEach((mask) => mask.close());
    throw new Error('Background removal failed to produce a result. Try a different photo.');
  }

  const maskWidth = personMask.width;
  const maskHeight = personMask.height;
  const maskFloats = personMask.getAsFloat32Array();
  result.confidenceMasks?.forEach((mask) => mask.close());

  // Paint the confidence mask (0..1 per pixel) into an alpha-only canvas, then let the browser
  // upscale it to the photo's full resolution with bilinear smoothing for soft, anti-aliased edges.
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = maskWidth;
  maskCanvas.height = maskHeight;
  const maskCtx = maskCanvas.getContext('2d');
  if (!maskCtx) throw new Error('Your browser could not prepare the segmentation mask.');
  const maskImageData = maskCtx.createImageData(maskWidth, maskHeight);
  for (let i = 0; i < maskFloats.length; i += 1) {
    maskImageData.data[i * 4 + 3] = Math.max(0, Math.min(255, Math.round(maskFloats[i] * 255)));
  }
  maskCtx.putImageData(maskImageData, 0, 0);

  const scaledMaskCanvas = document.createElement('canvas');
  scaledMaskCanvas.width = sourceCanvas.width;
  scaledMaskCanvas.height = sourceCanvas.height;
  const scaledMaskCtx = scaledMaskCanvas.getContext('2d');
  if (!scaledMaskCtx) throw new Error('Your browser could not scale the segmentation mask.');
  scaledMaskCtx.imageSmoothingEnabled = true;
  scaledMaskCtx.imageSmoothingQuality = 'high';
  scaledMaskCtx.drawImage(maskCanvas, 0, 0, maskWidth, maskHeight, 0, 0, scaledMaskCanvas.width, scaledMaskCanvas.height);
  const scaledAlpha = scaledMaskCtx.getImageData(0, 0, scaledMaskCanvas.width, scaledMaskCanvas.height);

  const outputImageData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
  for (let i = 0; i < outputImageData.data.length; i += 4) {
    outputImageData.data[i + 3] = scaledAlpha.data[i + 3];
  }
  sourceCtx.putImageData(outputImageData, 0, 0);

  return new Promise<Blob>((resolve, reject) => {
    sourceCanvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Image export failed.'))), 'image/png');
  });
}
