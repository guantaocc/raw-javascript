let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  offscreenCanvas = document.createElement("canvas"),
  offscreenContext = offscreenCanvas.getContext("2d");

  image.src = "../shared/images/arch.png";

image.onload = function () {
  console.log("load");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
};
