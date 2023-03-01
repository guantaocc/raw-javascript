
// 计算帧速率
let lastTime = 0

export function calculateFps(){
  let now = new Date().getTime()
  let fps = 1000 / (now - lastTime)
  lastTime = now
  return fps
}