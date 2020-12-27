let points = [];
const canvas = document.getElementsByTagName('canvas')[0];
const clearButton = document.getElementById('clearButton');
const ctx = canvas.getContext('2d');

/////////////////////
// Event listeners //
/////////////////////

clearButton.addEventListener('click', e => {
  e.stopPropagation();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  resetConstants();
  points = [];
});

canvas.addEventListener(
  'mouseup',
  e => {
    const x = e.pageX - canvas.offsetLeft;
    const y = e.pageY - canvas.offsetTop;
    points.push({x, y});
    updateConstants(x, y);
    populateCanvas();
  },
  false,
);

///////////////////////
// Linear regression //
///////////////////////

let sx2;
let sx;
let syx;
let sy;

resetConstants();

function resetConstants() {
  sx2 = 0;
  sx = 0;
  syx = 0;
  sy = 0;
}

function updateConstants(x, y) {
  sx2 += x * x;
  sx += x;
  syx += y * x;
  sy += y;
}

function getOptimalModel() {
  return gaussianElimitation2(
    [
      [sx2, sx],
      [sx, points.length],
    ],
    [syx, sy],
  );
}

function gaussianElimitation2(a, b) {
  const alpha = a[1][0] / a[0][0];
  a[1][1] -= a[0][1] * alpha;
  b[1] -= b[0] * alpha;

  b[0] -= (b[1] * a[0][1]) / a[1][1];

  return [b[0] / a[0][0], b[1] / a[1][1]];
}

//////////////////////
// Canvas functions //
//////////////////////

function populateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  points.forEach(({x, y}) => drawPlus(x, y));
  if (points.length >= 2) {
    const [a, b] = getOptimalModel();
    drawLine(a, b);
  }
}

function drawPlus(x, y) {
  ctx.beginPath();

  ctx.moveTo(x - 5, y);
  ctx.lineTo(x + 5, y);

  ctx.moveTo(x, y - 5);
  ctx.lineTo(x, y + 5);
  ctx.stroke();
}

function drawLine(a, b) {
  ctx.beginPath();

  ctx.moveTo(0, b);
  ctx.lineTo(canvas.width, canvas.width * a + b);

  ctx.stroke();
}
