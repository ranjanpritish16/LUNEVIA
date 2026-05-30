import {
  FaceLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

let faceLandmarker: FaceLandmarker | null = null;

async function initFaceLandmarker() {
  if (faceLandmarker) return faceLandmarker;

  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.5/wasm"
  );

  faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
    },
    runningMode: "IMAGE",
  });

  return faceLandmarker;
}

export interface FaceMeasurements {
  faceLength: number;
  jawWidth: number;
  foreheadWidth: number;
  cheekboneWidth: number;
  lengthToWidthRatio: number;
  jawToForeheadRatio: number;
  cheekboneToJawRatio: number;
}

export interface FaceShapeResult {
  measurements: FaceMeasurements;
  landmarks?: Array<{ x: number; y: number; z: number }>;
}

/**
 * Analyzes an image to extract facial measurements using MediaPipe Face Mesh.
 * Returns measurements (ratios, widths, lengths) for Gemini-based shape classification.
 */
export async function analyzeFaceShape(
  imageSource: HTMLImageElement | HTMLCanvasElement
): Promise<FaceShapeResult> {
  const landmarker = await initFaceLandmarker();

  const results = landmarker.detect(imageSource);

  if (!results.faceLandmarks || results.faceLandmarks.length === 0) {
    throw new Error(
      "Could not detect face. Please ensure your face is clearly visible and well-lit."
    );
  }

  const landmarks = results.faceLandmarks[0];

  // Get image dimensions for converting normalized coordinates to pixels
  let imageWidth = 640;
  let imageHeight = 480;
  
  if (imageSource instanceof HTMLImageElement) {
    imageWidth = imageSource.naturalWidth || imageSource.width;
    imageHeight = imageSource.naturalHeight || imageSource.height;
  } else if (imageSource instanceof HTMLCanvasElement) {
    imageWidth = imageSource.width;
    imageHeight = imageSource.height;
  }

  // Key landmark indices from MediaPipe 468-point model
  // MediaPipe returns normalized coordinates (0-1), so multiply by image dimensions
  const foreheadTop = landmarks[10]; // Top of head
  const chin = landmarks[152]; // Chin center
  const jawLeft = landmarks[133]; // Left jaw angle
  const jawRight = landmarks[362]; // Right jaw angle
  const cheekboneLeft = landmarks[205]; // Left cheekbone
  const cheekboneRight = landmarks[425]; // Right cheekbone
  const templeLeft = landmarks[21]; // Left temple
  const templeRight = landmarks[251]; // Right temple

  // Calculate measurements in pixels (landmarks are in normalized coords 0-1)
  const faceLength = Math.abs((foreheadTop.y - chin.y) * imageHeight);
  const jawWidth = Math.abs((jawRight.x - jawLeft.x) * imageWidth);
  const foreheadWidth = Math.abs((templeRight.x - templeLeft.x) * imageWidth);
  const cheekboneWidth = Math.abs((cheekboneRight.x - cheekboneLeft.x) * imageWidth);

  // Calculate ratios
  const lengthToWidthRatio = faceLength / jawWidth;
  const jawToForeheadRatio = jawWidth / foreheadWidth;
  const cheekboneToJawRatio = cheekboneWidth / jawWidth;

  const measurements: FaceMeasurements = {
    faceLength: Math.round(faceLength),
    jawWidth: Math.round(jawWidth),
    foreheadWidth: Math.round(foreheadWidth),
    cheekboneWidth: Math.round(cheekboneWidth),
    lengthToWidthRatio: Math.round(lengthToWidthRatio * 100) / 100,
    jawToForeheadRatio: Math.round(jawToForeheadRatio * 100) / 100,
    cheekboneToJawRatio: Math.round(cheekboneToJawRatio * 100) / 100,
  };

  return {
    measurements,
    landmarks: landmarks.slice(0, 10), // Return top 10 landmarks for debugging
  };
}
