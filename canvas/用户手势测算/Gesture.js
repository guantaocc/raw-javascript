import { windowToCanvas } from "../utils/coordinate.js";

let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  radius = 50,
  mousedown = {},
  endPos = {},
  dragging = false,
  animating = false,
  vx,
  vy;

function drawCircle(pos) {
  context.save();
  context.beginPath();
  context.fillStyle = "red";
  context.arc(pos.x, pos.y, radius, 0, Math.PI * 2, false);
  context.fill();
  context.restore();
}

drawCircle({ x: canvas.width / 2, y: canvas.height / 2 });

function erase() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// 计算用户手势的速度
function didThrow() {
  let elapsedTime = endPos.time - mousedown.time;
  let elapsedMotion =
    Math.abs(endPos.x - mousedown.x) + Math.abs(endPos.y - mousedown.y);
  return (elapsedMotion / elapsedTime) * 10 > 3;
}

canvas.onmousedown = function (e) {
  if (animating) {
    animating = false;
  } else {
    mousedown = windowToCanvas(canvas, e);
    mousedown.time = new Date().getTime();
    erase();
    drawCircle(mousedown);
    dragging = true;
  }
};

canvas.onmousemove = function (e) {
  if (dragging) {
    erase();
    drawCircle(windowToCanvas(canvas, e));
  }
};

function animate() {
  if (animating) {
    erase();
    if (endPos.x + vx + radius > canvas.width || endPos.x + vx - radius < 0) {
      vx = -vx;
    }
    if (endPos.y + vy + radius > canvas.height || endPos.y + vy - radius < 0) {
      vy = -vy;
    }
    endPos.x = endPos.x + vx;
    endPos.y = endPos.y + vy;
    drawCircle(endPos);
    window.requestAnimationFrame(animate);
  }
}

canvas.onmouseup = function (e) {
  endPos = windowToCanvas(canvas, e);
  endPos.time = new Date().getTime();
  e.preventDefault();
  if (dragging) {
    dragging = false;
    if (didThrow()) {
      animating = true;
      // 抛出
      vx = (endPos.x - mousedown.x) / 100;
      vy = (endPos.y - mousedown.y) / 100;
      window.requestAnimationFrame(animate);
    }
  }
};
