import { main } from "./main";

// Linear interpolation function.
export function lerp(time: number, a: number, b: number) {
  return (b - a) * time + a;
}

// Map a value from one range to another.
export function mapRange(
  time: number,
  a: number,
  b: number,
  c: number,
  d: number
) {
  return ((time - a) / (b - a)) * (d - c) + c;
}

// Draw a line on the canvas between two points.
export function drawLine(
  ctx: CanvasRenderingContext2D,
  v: [a: number, b: number],
  v2: [a: number, b: number]
) {
  ctx.beginPath();
  ctx.moveTo.apply(ctx, v);
  ctx.lineTo.apply(ctx, v2);
  ctx.stroke();
  ctx.closePath();
}

// Set the size of the canvas element.
export function setCanvasSize(id: string, w: number, h: number) {
  const c = document.getElementById(id);
  c?.setAttribute("width", w.toString());
  c?.setAttribute("height", h.toString());
}

// Set the background color of the canvas.
export function setBackground(
  ctx: CanvasRenderingContext2D,
  r: number,
  g: number,
  b: number,
  a: number,
  w: number,
  h: number
) {
  ctx.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
  ctx.fillRect(0, 0, w, h);
}

// Set the stroke (line) color for drawing.
export function setStroke(
  ctx: CanvasRenderingContext2D,
  r: number,
  g: number,
  b: number,
  a: number
) {
  ctx.strokeStyle = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
}

// Convert RGB pixel data to grayscale values.
export function getGrayscaleFromRGB(
  width: number,
  height: number,
  pixels: Uint8ClampedArray
) {
  return Array.from({ length: width * height }, (_, i) => {
    const pixelIndex = i * 4;
    const r = pixels[pixelIndex + 0];
    const g = pixels[pixelIndex + 1];
    const b = pixels[pixelIndex + 2];
    return (r + b + g) / 3;
  });
}

export function registerDNDHandlers(dropArea: HTMLElement) {
  dropArea?.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("drag-over");
  });

  dropArea?.addEventListener("dragleave", () => {
    dropArea.classList.remove("drag-over");
  });

  dropArea?.addEventListener("drop", (e) => {
    document.querySelector("audio")?.play();
    e.preventDefault();
    dropArea.classList.remove("drag-over");

    const files = e.dataTransfer?.files || [];

    if (files.length > 0) {
      const imageFile = files[0];

      if (imageFile.type.startsWith("image/")) {
        const imageURL = URL.createObjectURL(imageFile);
        const img = new Image();
        img.src = imageURL;
        img.id = "source";
        img.style.display = "none";
        document.body.appendChild(img);
        img.onload = () => {
          const dropArea = document.getElementById("drop-area");
          dropArea!.style.display = "none";
          main(img);
        };
      } else {
        alert("Please select an image file.");
      }
    }
  });

  // Handle clicking to select an image
  dropArea?.addEventListener("click", () => {
    document.querySelector("audio")?.play();
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.addEventListener("change", (e) => {
      const imageFile = (e.target as HTMLInputElement).files?.[0];

      if (imageFile) {
        const imageURL = URL.createObjectURL(imageFile);
        const img = new Image();
        img.src = imageURL;
        img.id = "source";
        // img.width = 800;
        // img.height = 600;
        img.style.display = "none";
        document.body.appendChild(img);
        img.onload = () => {
          const dropArea = document.getElementById("drop-area");
          dropArea!.style.display = "none";
          main(img);
        };
      }
    });

    fileInput.click();
  });
}
