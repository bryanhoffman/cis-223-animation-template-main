/*
 * This program renders the mandelbrot set and zooms in
 * on a specified point. It also has rainbows, which are
 * kind of arbitrary at this point, but totally trippy.
 */

// How fine should the grid be?
const x_grid = 1920;
const y_grid = 1080;

// The point we'll zoom in on
//const x_offset = 0.42884;
//const y_offset = -0.231345;

// Other fun points

//const x_offset = -1.8;
//const y_offset = 0;
let x_offset = -1.42884;
let y_offset = 0;

// Initially the plot is x from -2 to 2
// and y from -2 to 2 but zooming changes it
let x_range = 6;
let y_range = 6;

const max_iter_val = 40;

// Gemini wrote this for me LOL
function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    
    const r = Math.round(255 * f(0));
    const g = Math.round(255 * f(8));
    const b = Math.round(255 * f(4));

    // Pack as ABGR (Alpha, Blue, Green, Red) for Little Endian
    return (255 << 24) | (b << 16) | (g << 8) | r;
}

// function that returns the absolute value
// of a complex number a+bi or a+bj if you
// prefer the electrical engineering notation
function complex_abs(a,b){
    return (a**2+b**2)**0.5;
}

// Calculate the real portion of the squaring
// of a complex number and add the real part
// of c
function x_iter_func(a,b,c_x) {
    return a**2-b**2+c_x;
}

// Calculates the imaginary portion when
// a complex number is squared and adds
// the imaginary part of c
function y_iter_func(a,b,c_y) {
    return 2*a*b+c_y
}

// Pre-calculate 360 colors into the Uint32 format
const rainbowLUT = new Uint32Array(360);
for (let h = 0; h < 360; h++) {
    const {r, g, b} = hslToRgb(h, 100, 50); 
    rainbowLUT[h] = (255 << 24) | (b << 16) | (g << 8) | r;
}

// Define our precision (e.g., 60 decimal places)
const PRECISION_BITS = 80n; 
const SCALE = 1n << PRECISION_BITS; // Using powers of 2 is faster for the CPU

function animateCanvas(renderer) {
    const width = 1920;
    const height = 1080;
    const imgData = renderer.createImageData(width, height);
    const data32 = new Uint32Array(imgData.data.buffer);

    // Convert our float offsets/ranges to BigInt once per frame
    // We multiply by our SCALE to shift the decimal point 'right'
    let x_off_bi = BigInt(Math.floor(x_offset * Number(SCALE)));
    let y_off_bi = BigInt(Math.floor(y_offset * Number(SCALE)));
    let x_rng_bi = BigInt(Math.floor(x_range * Number(SCALE)));
    let y_rng_bi = BigInt(Math.floor(y_range * Number(SCALE)));

    for (let j = 0; j < height / 2; j++) {
        for (let i = 0; i < width; i++) {
            
            // Calculate start points as BigInt
            let x_val = (x_rng_bi * BigInt(i) / BigInt(width) - x_rng_bi / 2n) + x_off_bi;
            let y_val = (y_rng_bi * BigInt(j) / BigInt(height) - y_rng_bi / 2n) + y_off_bi;


let x_iter = x_val;
let y_iter = y_val;
let iteration = max_iter_val; 

// We pre-calculate the escape value squared and scaled
const escape_val_sq = 4n << PRECISION_BITS;
for (let k = 0; k < max_iter_val; k++) {
    // 1. Calculate squares (Keep them as BigInt)
    let x2 = (x_iter * x_iter) >> PRECISION_BITS;
    let y2 = (y_iter * y_iter) >> PRECISION_BITS;
    
    // 2. Check escape condition (Squared comparison)
    // No complex_abs needed!
    if (x2 + y2 > escape_val_sq) {
        iteration = k;
        break;
    }
    
    // 3. Iteration math (Keep everything BigInt)
    // y = 2xy + c_y -> bit shift left by 1 is the same as * 2
    y_iter = ((x_iter * y_iter) >> (PRECISION_BITS - 1n)) + y_val;
    // x = x^2 - y^2 + c_x
    x_iter = x2 - y2 + x_val;
}

            
            // GET COLOR FROM LUT (No BigInts involved here!)
            const pixelColor = rainbowLUT[iteration];
            data32[j * width + i] = pixelColor;
            data32[(height - 1 - j) * width + i] = pixelColor;
        }
    }
    renderer.putImageData(imgData, 0, 0);
    
    // Zoom logic remains floats for simplicity until it hits the limit
    x_range *= 0.95;
    y_range *= 0.95;
}

// Fill the canvas with one color (or other fill style)
function fillCanvas(renderer, fillStyle) {
  const { canvas } = renderer;

  renderer.save();

  renderer.fillStyle = fillStyle;

  renderer.fillRect(0, 0, canvas.width, canvas.height);

  renderer.restore();
}

// Create the canvas and initializes the animation loop
function setupCanvasAnimation(width = 1920, height = 1080) {
  const canvas = document.createElement("canvas");

  canvas.width = width;

  canvas.height = height;

  document.body.append(canvas);

  const context = canvas.getContext("2d");

  if (context === null) {
    throw new Error("Rendering context is null.");
  }

  function animationLoop() {
    animateCanvas(context);

    requestAnimationFrame(animationLoop);
  }

  animationLoop();
}

setupCanvasAnimation();
