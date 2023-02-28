const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const offsceenCanvas = document.createElement("canvas"), 
offscreenContext = offsceenCanvas.getContext('2d'),
LENS_RADIUS = canvas.width/5;

const image = new Image();

const handlerBtn = document.getElementById("handler");
const particalBtn = document.getElementById("partical")

let added = false;

// 画滤镜
function drawFilters() {
  worker.postMessage(context.getImageData(0, 0, canvas.width, canvas.height));

  worker.onmessage = function (event) {
    // event data
    console.log(event);
    context.putImageData(event.data, 0, 0);
  };
}

function drawLenses(left, right){
  context.save()
  context.beginPath()
  context.arc(left.x, left.y, LENS_RADIUS, 0, Math.PI * 2, false)
  context.stroke()
  moveTo(right.x, right.y)
  context.arc(right.x, right.y, LENS_RADIUS, 0, Math.PI * 2, false)
  context.stroke()
  context.clip()
  // 将另一个canvas叠加，只绘制 clip的部分
  context.drawImage(offsceenCanvas, 0, 0, canvas.width, canvas.height)
  context.restore()
}
function drawWire(center) {
  context.beginPath();
  context.moveTo(center.x - LENS_RADIUS/4,
                 center.y - LENS_RADIUS/2);

  context.quadraticCurveTo(center.x, center.y - LENS_RADIUS+20,
                           center.x + LENS_RADIUS/4,
                           center.y - LENS_RADIUS/2);
  context.stroke();
}

function drawConnectors(center) {
  context.beginPath();

  context.fillStyle = 'silver';
  context.strokeStyle = 'rgba(0,0,0,0.4)';
  context.lineWidth = 2;

  context.arc(center.x - LENS_RADIUS/4,
              center.y - LENS_RADIUS/2,
              4, 0, Math.PI*2, false);
  context.fill();
  context.stroke();

  context.beginPath();
  context.arc(center.x + LENS_RADIUS/4, center.y - LENS_RADIUS/2,
              4, 0, Math.PI*2, false);
  context.fill();
  context.stroke();
}

particalBtn.onclick = function(){
  // 离屏canvas处理图像再绘制canvas
  putSunglassesOn();
}

function putSunglassesOn() {
  var imagedata,
      center = {
        x: canvas.width/2,
        y: canvas.height/2
      },
      leftLensLocation = {
        x: center.x - LENS_RADIUS - 10,
        y: center.y
      },
      rightLensLocation = {
        x: center.x + LENS_RADIUS + 10,
        y: center.y
      },
  
  imagedata = context.getImageData(0, 0,
                                   canvas.width, canvas.height);

  worker.postMessage(imagedata);

  worker.onmessage = function(event) {
     offscreenContext.putImageData(event.data, 0, 0);
     drawLenses(leftLensLocation, rightLensLocation);
     drawWire(center);
     drawConnectors(center);
  };
}


handlerBtn.onclick = function () {
  if (added) {
    draw();
    added = false;
    handlerBtn.innerText = "加滤镜"
  } else {
    drawFilters();
    handlerBtn.innerText = "还原"
    added = true;
  }
};

// worker
const worker = new Worker("./worker.js");

image.src = "../shared/images/curved-road.png";

function draw() {
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
}

image.onload = function () {
  draw();
};
