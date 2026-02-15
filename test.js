<!DOCTYPE html>
<html>
<body>
<canvas id="fractalCanvas" width="800" height="800" style="background:black"></canvas>

<script>
const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const imgData = ctx.createImageData(width, height);

// 1. SETTINGS (Your Seahorse Valley Coordinates)
const centerR = -0.74364388703715;
const centerI = 0.13182590420642;
const zoom = 0.0000005; // Adjust this to go deeper
const maxIter = 1000;

// 2. GENERATE REFERENCE ORBIT (Z_n)
// For deep zooms, this would use a BigNumber library. 
// For this demo, we use standard doubles.
let refR = new Float64Array(maxIter);
let refI = new Float64Array(maxIter);
let zr = centerR, zi = centerI;

for (let i = 0; i < maxIter; i++) {
    refR[i] = zr;
    refI[i] = zi;
    let nextR = zr * zr - zi * zi + centerR;
    let nextI = 2 * zr * zi + centerI;
    zr = nextR;
    zi = nextI;
    if (zr * zr + zi * zi > 4) break; 
}

// 3. THE PERTURBATION LOOP (The "Taylor-like" Step)
for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
        // dc is the offset of THIS pixel from the center REFERENCE
        let dcR = (px - width / 2) * (zoom / width);
        let dcI = (py - height / 2) * (zoom / width);

        let dzR = 0, dzI = 0;
        let iter = 0;

        while (iter < maxIter) {
            // The Perturbation Formula: 2*Z*dz + dz^2 + dc
            let zr_n = refR[iter];
            let zi_n = refI[iter];

            // 2 * Z * dz
            let tr = 2 * (zr_n * dzR - zi_n * dzI);
            let ti = 2 * (zr_n * dzI + zi_n * dzR);

            // + dz^2
            let dzR2 = dzR * dzR;
            let dzI2 = dzI * dzI;
            let dzR_next = tr + (dzR2 - dzI2) + dcR;
            let dzI_next = ti + (2 * dzR * dzI) + dcI;

            dzR = dzR_next;
            dzI = dzI_next;

            // Check escape against the combined orbit (Z + dz)
            let totalR = zr_n + dzR;
            let totalI = zi_n + dzI;
            if (totalR * totalR + totalI * totalI > 4) break;
            
            iter++;
        }

        // 4. COLORING
        let pix = (py * width + px) * 4;
        let color = iter === maxIter ? 0 : (iter % 255);
        imgData.data[pix] = color * 5;     // Red
        imgData.data[pix + 1] = color * 2; // Green
        imgData.data[pix + 2] = color * 8; // Blue
        imgData.data[pix + 3] = 255;       // Alpha
    }
}

ctx.putImageData(imgData, 0, 0);
</script>
</body>
</html>