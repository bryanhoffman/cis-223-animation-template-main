let frameCount = 0;
const TOTAL_FRAMES_TO_CAPTURE = 3600; // Set a limit so your browser doesn't crash

const x_grid = 1920;
const y_grid = 1080;

let x_offset = -1.42884;
let y_offset = 0;
let x_range = 4.0; 
let y_range = 2.25; // Matching 16:9 aspect ratio

const max_iter_val = 60; // Increased for better detail

// Fixed: This now returns a single packed 32-bit integer correctly
function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    const r = Math.round(255 * f(0));
    const g = Math.round(255 * f(8));
    const b = Math.round(255 * f(4));
    return (255 << 24) | (b << 16) | (g << 8) | r;
}

// Pre-calculate colors. 
// We make the LUT size max_iter_val + 1 to avoid index errors.
const rainbowLUT = new Uint32Array(max_iter_val + 1);
for (let i = 0; i < max_iter_val; i++) {
    // Map iteration count to a hue (0-360)
    rainbowLUT[i] = hslToRgb((i * 10) % 360, 100, 50);
}
rainbowLUT[max_iter_val] = (255 << 24); // Black for points inside the set

const PRECISION_BITS = 80n; 
const SCALE = 1n << PRECISION_BITS;

function animateCanvas(renderer) {
    const width = 1920;
    const height = 1080;
    const imgData = renderer.createImageData(width, height);
    const data32 = new Uint32Array(imgData.data.buffer);

    let x_off_bi = BigInt(Math.floor(x_offset * Number(SCALE)));
    let y_off_bi = BigInt(Math.floor(y_offset * Number(SCALE)));
    let x_rng_bi = BigInt(Math.floor(x_range * Number(SCALE)));
    let y_rng_bi = BigInt(Math.floor(y_range * Number(SCALE)));

    // Escape value: 4.0 scaled to our BigInt precision
    const escape_limit = 4n << PRECISION_BITS;

    for (let j = 0; j < height / 2; j++) {
        for (let i = 0; i < width; i++) {
            // Mapping screen pixels to complex plane
            let x_val = (x_rng_bi * BigInt(i) / BigInt(width) - x_rng_bi / 2n) + x_off_bi;
            let y_val = (y_rng_bi * BigInt(j) / BigInt(height) - y_rng_bi / 2n) + y_off_bi;

            let x_iter = x_val;
            let y_iter = y_val;
            let iteration = max_iter_val; 

            for (let k = 0; k < max_iter_val; k++) {
                let x2 = (x_iter * x_iter) >> PRECISION_BITS;
                let y2 = (y_iter * y_iter) >> PRECISION_BITS;
                
                if (x2 + y2 > 4n << PRECISION_BITS) { 
                    iteration = k;
                    break;
                }
                
                // y = 2xy + c_y
                y_iter = ((x_iter * y_iter) >> (PRECISION_BITS - 1n)) + y_val;
                // x = x^2 - y^2 + c_x
                x_iter = x2 - y2 + x_val;
            }

            const pixelColor = rainbowLUT[iteration];
            data32[j * width + i] = pixelColor;
            data32[(height - 1 - j) * width + i] = pixelColor;
        }
    }
    renderer.putImageData(imgData, 0, 0);
    
    x_range *= 0.98;
    y_range *= 0.98;
}

function setupCanvasAnimation(width = 1920, height = 1080) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    document.body.style.margin = "0";
    document.body.style.backgroundColor = "black";
    document.body.append(canvas);
    const context = canvas.getContext("2d");

    function animationLoop() {
        animateCanvas(context);
        requestAnimationFrame(animationLoop);
    }
    animationLoop();
}

setupCanvasAnimation();