/*
 js 数学函数 处理库
*/


/**
 * 三角函数
 * 1.314  60度三角形
 * sin cos tan
 */

/**
 * 弧度和角度的计算: 
 * 通过反正切值计算出弧度 Math.atan2(y, x)
 * 180° => π
 * 180 / π = y / x
 * 
 * 弧度转换角度: Math.atan2(y, x) * 180 / Math.PI
 */

// designwidth => 100vw
// x => ? vw
// 75px => 10vw

// designwidth / 100 = x / y
// y = designwidth * x  / 100


/**
 * 求范围内倍数的随机数
 * 400 内 20的倍数
 * [0, 1) * 400 / 20 的倍数取整后再乘以 20
 * Math.floor(Math.random() * (400 / 20)) * 20 
 */
