import { calculateFps } from "../utils/fps.js";

let canvas = document.querySelector("#canvas"),
  context = canvas.getContext("2d"),
  raf = null,
  paused = false,
  deltaX,
  deltaY,
  discs = [
    {
      x: 150,
      y: 50,
      lastX: 150,
      lastY: 50,
      velocityX: 32,
      velocityY: 35,
      radius: 25,
      innerColor: "rgba(0,255,255,0.3)",
      middleColor: "rgba(0,255,255,0.9)",
      outerColor: "rgba(0,255,255,0.3)",
      strokeStyle: "slateblue",
    },
    {
      x: 75,
      y: 200,
      lastX: 75,
      lastY: 200,
      velocityX: 22,
      velocityY: 25,
      radius: 25,
      innerColor: "rgba(225,225,225,0.1)",
      middleColor: "rgba(225,225,225,0.9)",
      outerColor: "rgba(225,225,225,0.3)",
      strokeStyle: "gray",
    },
    {
      x: 100,
      y: 300,
      lastX: 150,
      lastY: 50,
      velocityX: 1.2,
      velocityY: 1.5,
      radius: 25,
      innerColor: "orange",
      middleColor: "yellow",
      outerColor: "gold",
      shadowColor: "rgba(255,0,0,0.7)",
      strokeStyle: "orange",
    },
  ],
  numDiscs = discs.length,
  lastTime = 0,
  frameCount = 0,
  lastUpdateTime = 0,
  animateButton = document.querySelector("#animateButton");

/**
 * 1. 实现动画
 * 2. 实现显示帧速率的功能
 */

function eraseBackground() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// 动画更新函数
// 运动速度和边界
function update(time) {
  console.log("update");
  let i = numDiscs,
    disc = null;

  let elapsedTime = time - lastUpdateTime
 
  while (i--) {
    disc = discs[i];
    deltaX = disc.velocityX * (elapsedTime / 1000)
    deltaY = disc.velocityY * (elapsedTime / 1000)
    /** delta
     * 恒定速度，独立帧速率播放动画
     * 计算每一帧需要移动的距离
     * 像素 / 帧 =  (像素 / 秒) * (秒 / 帧) 
     */

    if (
      disc.x + deltaX + disc.radius > context.canvas.width ||
      disc.x + deltaX - disc.radius < 0
    ) {
      disc.velocityX = -disc.velocityX;
      deltaX = -deltaX
    }

    if (
      disc.y + deltaY + disc.radius > context.canvas.height ||
      disc.y + deltaY - disc.radius < 0
    ){
      disc.velocityY = -disc.velocityY;
      deltaY = -deltaY
    }

    disc.x += deltaX;
    disc.y += deltaY;
  }
  lastUpdateTime = time
}



function drawDisc(disc) {
  const gradient = context.createRadialGradient(
    disc.x,
    disc.y,
    0,
    disc.x,
    disc.y,
    disc.radius
  );
  gradient.addColorStop(0.3, disc.innerColor);
  gradient.addColorStop(0.7, disc.middleColor);
  gradient.addColorStop(1.0, disc.outerColor);

  context.save();
  context.beginPath();
  context.arc(disc.x, disc.y, disc.radius, 0, Math.PI * 2, false);
  context.clip();

  context.fillStyle = gradient;
  context.strokeStyle = disc.strokeStyle;
  context.lineWidth = 2;
  context.fill();
  context.stroke();

  context.restore();
}

// draw
function draw() {
  let i = numDiscs,
    disc;
  i = numDiscs;
  while (i--) {
    disc = discs[i];
    drawDisc(disc);
    disc.lastX = disc.x;
    disc.lastY = disc.y;
  }
  if (frameCount === 0) {
    console.profile("COREHTML5 Animation, basic");
  } else if (frameCount === 100) {
    console.profileEnd();
    frameCount = -1;
  }
  if (frameCount !== -1 && frameCount < 100) {
    frameCount++;
  }
}

var lastFpsUpdateTime = 0
var lastFpsUpdate = 0


function drawBackground() {
  var STEP_Y = 12,
      i = context.canvas.height;
  
  context.strokeStyle = 'lightgray';
  context.lineWidth = 0.5;

  context.save();
  context.restore();

  while(i > STEP_Y*4) {
     context.beginPath();
     context.moveTo(0, i);
     context.lineTo(context.canvas.width, i);
     context.stroke();
     i -= STEP_Y;
  }

  context.save();

  context.strokeStyle = 'rgba(100,0,0,0.3)';
  context.lineWidth = 1;

  context.beginPath();

  context.moveTo(35,0);
  context.lineTo(35,context.canvas.height);
  context.stroke();

  context.restore();
}

function animate(time) {
  var now = (+new Date),
  fps = 0;
  if (paused) {
    eraseBackground();
    drawBackground();
    update(time);
    draw();
    // 继续执行
    fps = calculateFps(time)
    if(now - lastFpsUpdateTime > 1000){
      lastFpsUpdateTime = now
      lastFpsUpdate = fps
    }
    context.fillStyle = 'cornflowerblue';
    context.fillText(lastFpsUpdate.toFixed() + ' fps', 45, 50);
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
