// 动画计时器
// 线性计算
let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  startBtn = document.getElementById("start"),
  pauseBtn = document.getElementById("pause");

startBtn.onclick = function () {
  target.start();
};

pauseBtn.onclick = function () {};

let startTimestamp

class Target {
  constructor() {
    this.timerSetting = 1;
    this.posStart = {
      x: 100,
      y: 100,
    };
    this.width = 0;
    this.maxWidth = 100;
    this.height = 20;
    // 速度
    this.velocity = this.maxWidth / (this.timerSetting);
    this.raf = null;
    this.running = true;
  }
  isRunning() {
    return !!this.running;
  }
  start() {
    this.raf = window.requestAnimationFrame(animate);
  }
  stop() {
    window.cancelAnimationFrame(this.raf);
    this.running = false
  }
  getElapseTime() {}
  update(delta) {
    if (this.width + delta > this.maxWidth) {
      this.stop();
      return;
    }
    this.width = this.width + delta;
  }
}

const target = new Target();

function erase() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// 计算帧速率
let lastTime = 0

function draw(now) {
  context.save();
  context.beginPath();
  context.fillStyle = "red";
  context.rect(
    target.posStart.x,
    target.posStart.y,
    target.width,
    target.height
  );
  context.fill();
  context.restore();
}

function animate(now) {
  if (target.isRunning()) {
    erase();
    
    if(!startTimestamp){
      startTimestamp = now
    }

    // 如何计算当前帧?
    // let dt = (now - startTimestamp) / 1000
    // let fps = 1 / dt

    // 消耗的时间s
    const elapseTime = (now - startTimestamp) / 1000
    target.width = Math.min(target.velocity * elapseTime, target.maxWidth)

    draw(now);

    if(elapseTime < target.timerSetting){
      // 动画结束
      target.raf = window.requestAnimationFrame(animate);
    }
  }
}

class AnimationTimer {
  constructor(target, duration) {
    this.duration = duration;
    this.target = target;
  }

  start() {
    this.target.start();
  }

  stop() {
    this.target.stop();
  }

  getElapseTime() {
    let elapseTime = this.target.getElapseTime();
    if (!this.isRunning()) {
      return undefined;
    } else {
      return elapseTime;
    }
  }

  isRunning() {
    return this.target.isRunning();
  }

  isOver() {
    return this.target.getElapseTime() > this.duration;
  }
}
