/**
 * WGS84 和 笛卡尔坐标转换
 * 
 * WGS84: 经纬度 角度/弧度
 * 
 * 笛卡尔：绘图标识 X, Y, Z
 */


// 弧度(Radians)，角度(degrees)
let radians = Cesium.Math.toRadians(degrees);


// WGS84 -> Cartsian3 (笛卡尔)

// [113.21, 25.61]
let cartesian3 = Cesium.Cartseian3.fromDegress(lon, lat, height)

let cartesian3_1 = Cesium.Cartographic.fromDegress(lon, lat, height)

let cartesian3_2 = Cesium.Ellipsoid.WGS84.cartographicToCartesian(position)

// 多个坐标
let cartesian3s = Cesium.Ellipsoid.WGS84.cartographicArrayToCartesianArray(positions);



// Cartesian -> WGS84
let cartographic = Cesium.Cartographic.fromCartesian(cartesian3);
// 单个坐标
let cartographic1 = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian3);
// 多个坐标
let cartographics = Cesium.Ellipsoid.WGS84.cartesianArrayToCartographic(cartesain3Array);


// 屏幕坐标
// cartesian2 -> cartesian3
let cartesain3 = viewer.scene.camera.pickEllipsoid(cartesian2);

// 包含地形和模型等的场景空间坐标
let cartesian3_s = viewer.scene.pickPosition(cartesian2);

// 通过相机与屏幕点位连线来求取坐标
let ray = viewer.camera.getPickRay(cartesian2);
let cartesian3_s1 = globe.pick(ray,viewer.scene);


// cartesian2 -> cartesian3
let cartesian2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(cartesian3);


// 局部笛卡尔矩阵计算转换，点为局部坐标系的中心
let modelMatrix = Cesium.Transforms.esatNorthUpToFixedFrame(cartesian3);


// point：局部坐标；result：椭球笛卡尔坐标
let result = Cesium.Matrix4.multiplyByPoint(modelMatrix, point, new Cesium.Cartesian3());
