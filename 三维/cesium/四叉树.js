// 关于四叉树


// cesium获取瓦片层级（四叉树的一种实现）
// https://blog.csdn.net/weixin_45782925/article/details/123751718


function tileLevel(){
  let tiles = new Set();
  // 当前需要渲染的瓦片
	let tilesToRender = viewer.scene.globe._surface._tilesToRender;
	if (Cesium.defined(tilesToRender)) {
	    for (let i = 0; i < tilesToRender.length; i++) {
	        tiles.add(tilesToRender[i].level);
	    }
	    console.log("当前地图瓦片级别为:");
	    console.log(tiles);
	}
}

