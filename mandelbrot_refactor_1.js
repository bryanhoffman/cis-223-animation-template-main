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

// Modified to match aspect ratio
let x_range = 16;
let y_range = 9;

// Gemini wrote this for me LOL
function packHSL(h, s, l) {
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

// Called once per frame, about 60 frames per second ... well not anymore
// it gets pretty intense, note I could save some compute because the graphic
// is always symmetric across the x-axis
function animateCanvas(renderer) {
  const imgData = renderer.createImageData(1920, 1080);
  const data32 = new Uint32Array(imgData.data.buffer);
  // Check every point in the grid
  let pixelCounter = 0;
  for(let i = 0; i<x_grid; ++i) {
    for(let j = 0; j <Math.ceil(y_grid/2)+1; ++j) {
        // assume the orbit of chosen constant C is bounded
        let bounded = true;
        // Convert pixel value to (x,y) value centered on x and y offsets
        let x_val = (x_range/x_grid*i-x_range/2)+x_offset;
        let y_val = (y_range/y_grid*j-y_range/2)+y_offset;
        // The real part of Z_n-1
        let x_iter = x_val;
        // The imaginary part of Z_n-1
        let y_iter = y_val;
        // Compute Z_n s.t. Z_n = Z_n-1**2 + C
        for(let k = 0; k< 50 && bounded; ++k) {
            let x_iter_temp = x_iter_func(x_iter,y_iter,x_val);
            let y_iter_temp = y_iter_func(x_iter,y_iter,y_val);
            x_iter = x_iter_temp;
            y_iter = y_iter_temp;
            // if the absolute value of Z_n ever exceeds 2 it's unbounded
            if(complex_abs(x_iter,y_iter)>2){
                bounded = false;
            }
        }
        if(bounded) {
            // Top half index
            data32[j * x_grid + i] = 0xFF000000; // Black
            // Mirror to bottom half
            data32[(y_grid - 1 - j) * x_grid + i] = 0xFF000000;
        } else {
            let hue = (100*(complex_abs(x_iter, y_iter)-2))%360; 
            val = packHSL(hue, 80, 80);
            data32[j * x_grid + i] = val;
            data32[(y_grid - 1 - j) * x_grid + i] = val;
        }
        pixelCounter++;
    }
  }
  // render whole frame
  renderer.putImageData(imgData, 0, 0);

  // Zoom in 
  x_range*=0.97;
  y_range*=0.97;
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