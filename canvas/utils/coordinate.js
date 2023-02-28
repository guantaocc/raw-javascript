export function windowToCanvas(canvas, mouseEvent){
  let x = mouseEvent.x || mouseEvent.clientX
  let y = mouseEvent.y || mouseEvent.clientY

  let rect = canvas.getBoundingClientRect()
  return {
    x: x - rect.left * (canvas.width / rect.width),
    y: y - rect.top * (canvas.height / rect.height)
  }
}