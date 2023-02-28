/**
 * 图片数据的转换
 */

// 图片转base64
export function toDataURL(src, callback, outputFormat) {
  var img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = function () {
    var canvas = document.createElement("CANVAS");
    var ctx = canvas.getContext("2d");
    var dataURL;
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
  };
  img.src = src;
  if (img.complete || img.complete === undefined) {
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = src;
  }
}

// baseUrl 转为 File
export function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(",");
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// file 转换 blob
export function filetobase64(file) {
  return new Promise((resolve) => {
    var reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.readAsDataURL(file);
  });
}
