import {
  getGrayscaleFromRGB,
  mapRange,
  registerDNDHandlers,
  setCanvasSize,
  setBackground,
  setStroke,
  drawLine,
} from "./utils";

export function main(source: HTMLImageElement) {
  // Create a temporary canvas element and its 2D rendering context.
  const psuedoCanvas = document.createElement("canvas");
  const psuedoCanvasCtx = psuedoCanvas.getContext("2d");

  // Set the temporary canvas dimensions to match the source image.
  psuedoCanvas.width = source.width;
  psuedoCanvas.height = source.height;

  // Draw the source image on the temporary canvas.
  psuedoCanvasCtx?.drawImage(source, 0, 0, source.width, source.height);

  // Get image data from the temporary canvas.
  const imgData = psuedoCanvasCtx?.getImageData(
    0,
    0,
    source.width,
    source.height
  );
  const pixels = imgData?.data as Uint8ClampedArray;

  // Extract width, height, and grayscale pixel data from the image.
  const width = source.width;
  const height = source.height;
  const grayScalePixels = getGrayscaleFromRGB(width, height, pixels);

  // Configure parameters for rendering the waveform.
  const hDivisions = 60;
  const hDivisionSize = height / hDivisions;
  const maxAmplitude = hDivisionSize / 2;

  // Initialize variables for wave animation.
  let frequency = 150;
  let phase = 0;
  let time = 0;

  // Get the rendering context for the main canvas.
  const ctx = (
    document.getElementById("main-canvas") as HTMLCanvasElement
  ).getContext("2d") as CanvasRenderingContext2D;

  // Set the main canvas size and background.
  setCanvasSize("main-canvas", width, height);
  setBackground(ctx, 255, 255, 255, 1, width, height);
  setStroke(ctx, 255, 255, 255, 1);

  console.log("rendering options:", {
    width,
    hDivisions,
    hDivisionSize,
    grayScalePixels,
    ctx,
    maxAmplitude,
    frequency,
    phase,
    time,
  });

  // The render function that continuously updates the waveform animation.
  const render = () => {
    // Clear the background for the next frame.
    setBackground(ctx, 0, 0, 0, 1, width, height);
    // Update phase and frequency based on time for animation.
    phase = time / 2;
    frequency = mapRange(Math.sin(time / 30), -1, 1, 20, 200);

    // Loop through horizontal divisions and draw the waveform.
    for (let hDiv = 0; hDiv < hDivisions; hDiv++) {
      const y = hDivisionSize / 2 + hDiv * hDivisionSize;

      let prevPoint: [a: number, b: number] = [-1, y];
      for (let x = 0; x < width; x++) {
        const angle = mapRange(x, 0, width, 0, Math.PI * 2);
        const sinValue = Math.sin(phase + angle * frequency);
        const grayIndex = Math.floor(y) * width + x;
        const grayValue = grayScalePixels[grayIndex];
        const amplitude = mapRange(grayValue, 0, 255, maxAmplitude, 0);

        const point: [a: number, b: number] = [x, y + sinValue * amplitude];

        // Draw lines to create the waveform.
        drawLine(ctx, prevPoint, point);
        // setStroke(
        //   ctx,
        //   hDiv + Math.random() * 100,
        //   255 + Math.random() * 100,
        //   255,
        //   1
        // );
        prevPoint = point;
      }
    }

    // Increment time and request the next frame for animation.
    time++;
    requestAnimationFrame(render);
  };

  // Start the animation loop.
  render();
}

function init() {
  // Get the drop area element
  const dropArea = document.getElementById("drop-area");

  // Register DND event handlers
  registerDNDHandlers(dropArea as HTMLElement);

  // BG audio
  document.addEventListener("DOMContentLoaded", () => {
    const audio = document.querySelector("audio");
    if (audio) {
      audio.setAttribute("preload", "auto");
      audio.volume = 0.05;
    }
  });
}

init();
