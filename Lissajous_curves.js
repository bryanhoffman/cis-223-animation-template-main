/*
 * There's lots of arbitrary stuff going on here
 * but hey, it makes a pretty rainbow curve
 */

// alter these for different curves
// if a is equal to b, you just get a circle
// co-prime numbers or irrational numbers are
// the most interesting
a = 13;
b = 34;

// how fast it moves
// try a low value like 0.001 and a high value like 1
incr = 0.1;

// how quick colors change
color_speed = 150;


let stepNum = 0;

// Called once per frame, about 60 frames per second
function animateCanvas(renderer) {
  //fillCanvas(renderer, "black");

  renderer.beginPath();
  hue = color_speed*stepNum%360;
  renderer.fillStyle = `hsl(${hue} 80 80)`;
  renderer.ellipse(250+250*Math.sin(a*Math.PI*stepNum/(2*Math.PI)),250+250*Math.cos(b*stepNum/(2*Math.PI)),10,10,0,0,2*Math.PI)
  renderer.fill();
  renderer.closePath();
  stepNum+=incr;
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
function setupCanvasAnimation(width = 500, height = 500) {
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
