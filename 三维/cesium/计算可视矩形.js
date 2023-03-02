// 计算可视矩形

viewer.camera.moveEnd.addEventListener(() => {
  let rectangle = viewer.camera.computeViewRectangle()
  console.log('rectangle', rectangle)
})