onmessage = function (event){
  let imageData = event.data

  data = imageData.data
  for(let i = 0; i < data.length - 4; i+=4){
    // i, i+1, i+2  RGB
    average = (data[i] + data[i+1] + data[i+2]) / 3
    data[i] = data[i+1] = data[i+2] = average
  }
  // 黑白滤镜 取平均值
  postMessage(imageData)
}