/*
 * This program renders the mandelbrot set and zooms in
 * on a specified point. It also has rainbows, which are
 * kind of arbitrary at this point, but totally trippy.
 */

// How fine should the grid be?
const x_grid = 400;
const y_grid = 400;

// The point we'll zoom in on
const x_offset = 0.42884;
const y_offset = -0.231345;

// Other fun points

//const x_offset = -1.8;
//const y_offset = 0;
//let x_offset = -1.42884;
//let y_offset = 0;

// Initially the plot is x from -2 to 2
// and y from -2 to 2 but zooming changes it
let x_range = 6;
let y_range = 6;

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
  fillCanvas(renderer, "white");
  // Check every point in the grid
  for(let i = 0; i<x_grid; ++i) {
    for(let j = 0; j <y_grid; ++j) {
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
        for(let k = 0; k<40 && bounded; ++k) {
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
            // bounded values are black pixels
            renderer.beginPath();
            renderer.fillStyle = "black";
            renderer.rect(i,j,1,1);
            renderer.fill();
            //renderer.rect(i,y_grid-j,1,1);
            //renderer.fill();
            renderer.closePath();
        } else {
            // unbounded points are colorful
            renderer.beginPath();
            // this is essentially arbitrary, but pretty
            my_num = (100*(complex_abs(x_iter, y_iter)-2))%360;
            renderer.fillStyle = `hsl(${my_num} 80 80)`;
            renderer.rect(i,j,1,1)
            renderer.fill();
           // renderer.rect(i,y_grid-j,1,1);
            //renderer.fill();
            renderer.closePath();
        }
    }
  }
  // Zoom in 
  x_range*=0.95;
  y_range*=0.95;
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
function setupCanvasAnimation(width = 1000, height = 1000) {
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
