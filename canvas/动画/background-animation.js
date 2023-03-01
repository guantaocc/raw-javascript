import { calculateFps } from "../utils/fps.js";

let canvas = document.querySelector("#canvas"),
  context = canvas.getContext("2d"),
  raf = null,
  paused = false,
  animateButton = document.querySelector("#animateButton");


const image = new Image()
image.src = '../shared/images/sky.png';

image.onload = function(){
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
}

let offsetVelocity = 30
let offset = 0

function update(now) {
  let fps = calculateFps(now)
  offset = offset < canvas.width ? offset + (offsetVelocity / fps) : 0
  context.save()
  context.translate(-offset, 0)
  context.drawImage(image, 0, 0)
  context.drawImage(image, canvas.width - 2, 0) 
  context.restore()
}

function erase(){
  context.clearRect(0,0,canvas.width,canvas.height);
}

function animate(time) {
  if (paused) {
    erase();
    update(time);
    raf = window.requestAnimationFrame(animate);
  }
}

context.font = "48px Helvetica";

canvas.onclick = function (e) {
  paused = paused ? false : true;
};

context.canvas.width = canvas.width;
context.canvas.height = canvas.height;

animateButton.onclick = function (e) {
  paused = paused ? false : true;
  if (paused) {
    animateButton.value = "Pause";
    raf = window.requestAnimationFrame(animate);
  } else {
    window.cancelAnimationFrame(raf);
    animateButton.value = "Animate";
  }
};

context.font = "48px Helvetica";
