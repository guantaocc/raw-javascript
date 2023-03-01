import { windowToCanvas } from "../utils/coordinate.js";

let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  offscreenCanvas = document.createElement("canvas"),
  offscreenContext = offscreenCanvas.getContext("2d");

let moveing = false
let glassRadius = 100
let scale = 1.5

let currentPos = {};

// 计算包围坐标
let bBoxRectangle = {}

const image = new Image();
image.src = "../shared/images/camp.png";

let imageData = null;

function saveImageData() {
  imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  offscreenContext.putImageData(imageData, 0, 0);
}

function restoreImageData() {
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
}


function drawCircle(pos) {
  context.save();
  context.beginPath();
  context.arc(pos.x, pos.y, glassRadius, 0, 2 * Math.PI, false);
  context.lineWidth = 2;
  context.strokeStyle = "red";
  context.stroke();
  context.clip();

  let scaleBboxRectange = {
    width: bBoxRectangle.width * scale,
    height: bBoxRectangle.height * scale
  }
  // 区域放大并且剪辑
  context.drawImage(canvas,
    bBoxRectangle.x - bBoxRectangle.width / 2, bBoxRectangle.y - bBoxRectangle.height / 2,
    bBoxRectangle.width, bBoxRectangle.height,
    bBoxRectangle.x - scaleBboxRectange.width / 2,
    bBoxRectangle.y - scaleBboxRectange.height / 2,
    scaleBboxRectange.width,
    scaleBboxRectange.height);
  context.restore();
}

function setBboxRectangle(mouse){
  bBoxRectangle.x = mouse.x
  bBoxRectangle.y = mouse.y
  bBoxRectangle.width = glassRadius * 2
  bBoxRectangle.height = glassRadius * 2
}

canvas.onmousedown = function (e) {
  let pos = windowToCanvas(canvas, e);
  currentPos = pos;
  setBboxRectangle(pos)
  drawCircle(pos);
  moveing = true;
};

canvas.onmousemove = function (e) {
  if (moveing) {
    let pos = windowToCanvas(canvas, e);
    currentPos = pos;
    setBboxRectangle(pos)
    restoreImageData();
    drawCircle(pos);
  }
};

document.onmouseup = function (e) {
  restoreImageData();
  moveing = false;
};

image.onload = function () {
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  saveImageData();
};
