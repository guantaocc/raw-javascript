import { windowToCanvas } from "../utils/coordinate.js";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let mousedown = {};
let point = {};
let dragging = false,
  imageData;

let imageDataCopy = ctx.createImageData(canvas.width, canvas.height);
let rubberbandRectangle = {};
ctx.lineWidth = 1.0;
ctx.storkeStyle = "navy";
const image = new Image();

image.src = "../shared/images/arch.png";

image.onload = function () {
  console.log("load");
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
};

function copyCanvasPixels() {
  var i = 0;

  // Copy red, green, and blue components of the first pixel

  for (i = 0; i < 3; i++) {
    imageDataCopy.data[i] = imageData.data[i];
  }

  // Starting with the alpha component of the first pixel,
  // copy imageData, and make the copy more transparent

  for (i = 3; i < imageData.data.length - 4; i += 4) {
    imageDataCopy.data[i] = imageData.data[i] / 2; // Alpha: more transparent
    imageDataCopy.data[i + 1] = imageData.data[i + 1]; // Red
    imageDataCopy.data[i + 2] = imageData.data[i + 2]; // Green
    imageDataCopy.data[i + 3] = imageData.data[i + 3]; // Blue
  }
}

function captureCanvasPixels() {
  imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  copyCanvasPixels();
}

function setRubberbandRectangle(x, y) {
  rubberbandRectangle.left = Math.min(x, mousedown.x);
  rubberbandRectangle.top = Math.min(y, mousedown.y);
  (rubberbandRectangle.width = Math.abs(x - mousedown.x)),
    (rubberbandRectangle.height = Math.abs(y - mousedown.y));
}

// 脏矩形，只重置选中的这部分
function restoreRubberbandPixels() {
  var deviceWidthOverCSSPixels = imageData.width / canvas.width,
    deviceHeightOverCSSPixels = imageData.height / canvas.height;

  // Restore the Canvas to what it looked like when the mouse went down

  ctx.putImageData(imageData, 0, 0);

  // 这部分只重置脏矩形选中部分
  ctx.putImageData(
    imageDataCopy,
    0,
    0,
    rubberbandRectangle.left + ctx.lineWidth,
    rubberbandRectangle.top + ctx.lineWidth,
    (rubberbandRectangle.width - 2 * ctx.lineWidth) * deviceWidthOverCSSPixels,
    (rubberbandRectangle.height - 2 * ctx.lineWidth) * deviceHeightOverCSSPixels
  );
}

function drawRubbleRect() {
  let { left, top, width, height } = rubberbandRectangle;
  ctx.strokeRect(left, top, width, height);
}

canvas.onmousedown = function (e) {
  let pos = windowToCanvas(canvas, e);
  mousedown = pos;
  rubberbandRectangle.left = mousedown.x;
  rubberbandRectangle.top = mousedown.y;
  rubberbandRectangle.width = 0;
  rubberbandRectangle.height = 0;

  dragging = true;
  // 保存 Pixel 像素
  captureCanvasPixels();
};

canvas.onmousemove = function (e) {
  if (dragging) {
    if (
      rubberbandRectangle.width > 2 * ctx.lineWidth &&
      rubberbandRectangle.height > 2 * ctx.lineWidth
    ) {
      if (imageData !== undefined) {
        restoreRubberbandPixels();
      }
    }
    let pos = windowToCanvas(canvas, e);
    setRubberbandRectangle(pos.x, pos.y);
    if (
      rubberbandRectangle.width > 2 * ctx.lineWidth &&
      rubberbandRectangle.height > 2 * ctx.lineWidth
    ) {
      drawRubbleRect();
    }
  }
};

canvas.onmouseup = function (e) {
  dragging = false;
  // reset rules
  ctx.putImageData(imageData, 0, 0);

  ctx.drawImage(
    canvas,
    rubberbandRectangle.left + ctx.lineWidth * 2,
    rubberbandRectangle.top + ctx.lineWidth * 2,
    rubberbandRectangle.width - 4 * ctx.lineWidth,
    rubberbandRectangle.height - 4 * ctx.lineWidth,
    0,
    0,
    canvas.width,
    canvas.height
  );

  dragging = false;
  imageData = undefined;
};

document.getElementById("reset").onclick = function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
};
