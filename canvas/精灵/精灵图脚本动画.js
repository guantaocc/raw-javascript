import { Sprite, SpriteSheetPainter } from "../utils/sprites.js";

let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  spritesheet = new Image(),
  // 脚本图所在位置
  runnerCells = [
    { left: 0, top: 0, width: 47, height: 64 },
    { left: 55, top: 0, width: 44, height: 64 },
    { left: 107, top: 0, width: 39, height: 64 },
    { left: 152, top: 0, width: 46, height: 64 },
    { left: 208, top: 0, width: 49, height: 64 },
    { left: 265, top: 0, width: 46, height: 64 },
    { left: 320, top: 0, width: 42, height: 64 },
    { left: 380, top: 0, width: 35, height: 64 },
    { left: 425, top: 0, width: 35, height: 64 },
  ];

// 精灵行为 (奔跑，移动)

const runInPlace = {
  lastAdvance: 0,
  // 100毫秒切换一次
  PAGEFLIP_INTERVAL: 100,

  execute(sprite, context, time) {
    if (time - this.lastAdvance > this.PAGEFLIP_INTERVAL) {
      sprite.painter.advance();
      this.lastAdvance = time;
    }
  },
};

const move = {
  lastMove: 0,

  execute(sprite, context, time) {
    if (this.lastMove !== 0) {
      sprite.left -= sprite.velocityX * ((time - this.lastMove) / 1000);
      if (sprite.left < 0) {
        sprite.left = canvas.width;
      }
    }
    this.lastMove = time;
  },
};

function drawBackground() {
  var STEP_Y = 12,
      i = context.canvas.height;
  
  while(i > STEP_Y*4) {
     context.beginPath();

     context.moveTo(0, i);
     context.lineTo(context.canvas.width, i);
     context.stroke();

     i -= STEP_Y;
  }
}

// sprite
const sprite = new Sprite('runner', new SpriteSheetPainter(spritesheet, runnerCells), [runInPlace, move])


function animate(time){
  context.clearRect(0,0,canvas.width,canvas.height);
  drawBackground();
  context.drawImage(spritesheet, 0, 0);
  sprite.update(context, time)
  sprite.paint(context)
  window.requestAnimationFrame(animate)
}

spritesheet.src = '../shared/images/running-sprite-sheet.png';

spritesheet.onload = function(e) {
   context.drawImage(spritesheet, 0, 0);
   window.requestAnimationFrame(animate)
};

sprite.velocityX = 50;  // pixels/second
sprite.left = 200;
sprite.top = 100;

context.strokeStyle = 'lightgray';
context.lineWidth = 0.5;