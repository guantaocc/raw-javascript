"use strict";
var App = /** @class */ (function () {
    function App(canvas, opts) {
        /** 设备像素比，为了解决高清屏模糊问题 */
        this.dpr = 1;
        this.canvas = canvas;
        this.ctx2d = canvas.getContext("2d");
        this.adaptDPR();
    }
    // 根据 dpr 把 canvas 的 width、height 属性都放大，css 大小不变
    // canvas 会自己把画布缩小到适应 css 的大小，于是放大和缩小的效果就抵消了，这样做的原因是为了解决高清屏的模糊问题
    App.prototype.adaptDPR = function () {
        var _a;
        var dpr = window.devicePixelRatio;
        var _b = this.canvas, width = _b.width, height = _b.height;
        this.dpr = dpr;
        // 这里我们把初始的宽高记下来，用于后面的计算用，因为这里我们适配的高清屏只是自己偷偷放大，值还是要原来真实的值
        this.width = width;
        this.height = height;
        this.halfWidth = width / 2;
        this.halfHeight = height / 2;
        // 重新设置 canvas 自身宽高大小和 css 大小
        this.canvas.width = Math.round(width * dpr);
        this.canvas.height = Math.round(height * dpr);
        this.canvas.style.width = width + "px";
        this.canvas.style.height = height + "px";
        // 方法一：直接用 scale 放大，这样就不用每个 api 都放大了，但是你要知道我们是一直在 scale 这个状态下的，有时候你不小心重置了画布，这个东西就不生效了
        (_a = this.ctx2d) === null || _a === void 0 ? void 0 : _a.scale(dpr, dpr);
        // 方法二：不要用 scale，而是放大每一个 api，也就是说接下来的绘制操作都需要乘以 dpr，这样一来就会很麻烦；
        // 所以我们需要把一些绘制的入口收敛统一成一些工具方法，也就是封装成一个个绘制函数，比如 drawLine、fillText、strokeRect 等方法
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
    };
    App.prototype.handleMouseDown = function (e) {
        console.log(e);
        // 简单画一个点
        var pos = this.viewportToCanvasPosition(e);
        // drawPoint
        this.drawPoint(pos);
    };
    // pos is circle
    App.prototype.inPointPath = function (pos) {
        var _a, _b;
        (_a = this.ctx2d) === null || _a === void 0 ? void 0 : _a.rect(0, 0, this.ctx2d.canvas.width, this.ctx2d.canvas.height);
        return (_b = this.ctx2d) === null || _b === void 0 ? void 0 : _b.isPointInPath(pos.x, pos.y);
    };
    App.prototype.drawPoint = function (pos) {
        if (this.ctx2d && this.inPointPath(pos)) {
            this.ctx2d.save();
            this.ctx2d.beginPath();
            this.ctx2d.fillStyle = '#000';
            this.ctx2d.strokeStyle = 'red';
            this.ctx2d.lineWidth = 2;
            this.ctx2d.arc(pos.x, pos.y, 10, 0, Math.PI * 2, false);
            this.ctx2d.stroke();
            this.ctx2d.fill();
            this.ctx2d.restore();
        }
    };
    App.prototype.viewportToCanvasPosition = function (e) {
        var clientX = e.clientX, clientY = e.clientY;
        var _a = this.canvas.getBoundingClientRect(), top = _a.top, left = _a.left;
        var x = clientX - top;
        var y = clientY - left;
        return new Point(x, y);
    };
    return App;
}());
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var canvas = document.getElementById('canvas');
console.log(canvas);
new App(canvas, {});
