let stepNum = 0;

// Called once per frame, about 60 frames per second
function animateCanvas(renderer) {
  //fillCanvas(renderer, "black");
  let hue = (200*stepNum)%360;
  renderer.beginPath();
  renderer.fillStyle = `hsl(${hue} 80% 80%)`
  renderer.ellipse(250+250*Math.sin(Math.PI*stepNum/(2*Math.PI)),250+250*Math.cos(5*stepNum/(2*Math.PI)),10,10,0,0,2*Math.PI)
  renderer.fill();
  renderer.closePath();
  stepNum+=0.01;
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
