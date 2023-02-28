import Canvas from "../interface/canvas";

const _ = require("lodash");

import "./baseCanvas.css";

// 画布和屏幕坐标换算(变换)

class BaseCanvas extends Canvas {
  constructor(options) {
    super(options);
    this.root = options.root;
    this.zoomable = options.zoomable || false; // 可缩放
    this.moveable = options.moveable || false; // 可平移
    this.draggable = options.draggable || false; // 可拖动
    this.theme = {
      group: {
        type: _.get(options, "theme.group.type") || "normal",
        includeGroups: _.get(options, "theme.group.includeGroups", false),
        dragGroupZIndex: _.get(options, "theme.group.dragGroupZIndex", 50),
      },
      node: {
        dragNodeZIndex: _.get(options, "theme.node.dragNodeZIndex", 250),
      },
      edge: {
        type: _.get(options, "theme.edge.type") || "node",
        shapeType: _.get(options, "theme.edge.shapeType") || "Straight",
        hasRadius: _.get(options, "theme.edge.hasRadius") || false,
        Class: _.get(options, "theme.edge.Class") || Edge,
        arrow: _.get(options, "theme.edge.arrow"),
        arrowShapeType: _.get(options, "theme.edge.arrowShapeType", "default"),
        arrowPosition: _.get(options, "theme.edge.arrowPosition"),
        arrowOffset: _.get(options, "theme.edge.arrowOffset"),
        draggable: _.get(options, "theme.edge.draggable"),
        label: _.get(options, "theme.edge.label"),
        labelPosition: _.get(options, "theme.edge.labelPosition"),
        labelOffset: _.get(options, "theme.edge.labelOffset"),
        labelUpdateInterval: _.get(
          options,
          "theme.edge.labelUpdateInterval",
          20
        ),
        isRepeat: _.get(options, "theme.edge.isRepeat") || false,
        isLinkMyself: _.get(options, "theme.edge.isLinkMyself") || false,
        isExpandWidth: _.get(options, "theme.edge.isExpandWidth") || false,
        defaultAnimate: _.get(options, "theme.edge.defaultAnimate") || false,
        dragEdgeZindex: _.get(options, "theme.edge.dragEdgeZindex", 499),
      },
    };

    // 贯穿所有对象的配置
    this.global = _.get(options, "global", {
      isScopeStrict: _.get(options, "global.isScopeStrict"), // 是否为scope的严格模式
      limitQueueLen: 5, // 默认操作队列只有5步
      isCloneDeep: _.get(options, "global.isCloneDeep", true), // addNode,addEdge,addGroup传入的数据是否深拷贝一份
    });

    // 放大缩小和平移的数值
    this._zoomData = 1;
    this._moveData = [0, 0];
    this._zoomTimer = null;

    this.groups = [];
    this.nodes = [];
    this.edges = [];

    this.svg = null;
    this.wrapper = null;
    this.canvasWrapper = null;

    // 节点,线段,节点组z-index值，顺序：节点 > 线段 > 节点组
    this._dragGroupZIndex = this.theme.group.dragGroupZIndex;
    this._dragNodeZIndex = this.theme.node.dragNodeZIndex;
    this._dragEdgeZindex = this.theme.edge.dragEdgeZindex;

    // 加一层wrapper方便处理缩放，平移
    this._genWrapper();
    // 加一层svg画线条
    this._genSvgWrapper();
    // 加一层canvas方便处理辅助
    // this._genCanvasWrapper();

    // 统一处理画布拖动事件
    this._dragType = null;
    this._dragNode = null;
    this._mouseMoved = false;
    this._dragEndpoint = null;
    this._dragEdges = []; // 拖动连线的edge
    this._dragPathEdge = null; // 拖动edge中的某段path改变路径
    this._dragGroup = null;

    // 初始化一些参数
    this._rootWidth = $(this.root).width();
    this._rootHeight = $(this.root).height();
    $(this.root).css("overflow", "hidden");
    if ($(this.root).css("position") === "static") {
      $(this.root).css("position", "relative");
    }

    // undo & redo队列
    this.actionQueue = [];
    this.actionQueueIndex = -1;

    // 画布边缘
    this._autoMoveDir = [];
    this._autoMoveTimer = null;

    // 画布是否初始化成功
    this._hasInited = false;

    this._cache = {
      nodes: {},
    };

    // redraw的promise
    this._redrawPromises = [];
    this._isRedraw = false;
  }

  // 渲染
  draw(opts, callback) {
    const groups = opts.groups || [];
    const nodes = opts.nodes || [];
    const edges = opts.edges || [];

    const drawPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        this.addNodes(nodes);
        resolve();
      });
    });

    drawPromise.then(() => {});
  }

  addNodes() {}

  _genWrapper() {
    // 生成wrapper
    const wrapper = $('<div class="butterfly-wrapper"></div>').appendTo(
      this.root
    );
    return (this.wrapper = wrapper[0]);
  }

  _genSvgWrapper() {
    function _detectMob() {
      const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
        /Electron/i,
      ];
      return toMatch.some((toMatchItem) => {
        return window.navigator.userAgent.match(toMatchItem);
      });
    }
    let _isMobi = _detectMob();
    let _SVGWidth = "100%";
    let _SVGHeight = "100%";

    let _detectZoom = () => {
      let ratio = 0;
      let screen = window.screen;
      let ua = window.navigator.userAgent.toLowerCase();

      if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
      } else if (~ua.indexOf("msie")) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
          ratio = screen.deviceXDPI / screen.logicalXDPI;
        }
      } else if (
        window.outerWidth !== undefined &&
        window.innerWidth !== undefined
      ) {
        ratio = window.outerWidth / window.innerWidth;
      }

      if (ratio) {
        ratio = Math.round(ratio * 100);
      }
      return ratio;
    };

    // hack 适配浏览器的缩放比例
    if (!_isMobi) {
      let _scale = 1 / (_detectZoom() / 200);
      _SVGWidth = 1 * _scale + "px";
      _SVGHeight = 1 * _scale + "px";
    }

    // 生成svg的wrapper
    const svg = $(document.createElementNS("http://www.w3.org/2000/svg", "svg"))
      .attr("class", "butterfly-svg")
      .attr("width", _SVGWidth)
      .attr("height", _SVGHeight)
      .attr("version", "1.1")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .css("z-index", this._dragEdgeZindex)
      .appendTo(this.wrapper);

    if (!_isMobi) {
      // hack 监听浏览器的缩放比例并适配
      window.onresize = () => {
        let _scale = 1 / (_detectZoom() / 200);
        svg.attr("width", 1 * _scale + "px").attr("height", 1 * _scale + "px");
      };

      // hack 因为width和height为1的时候会有偏移
      let wrapperOffset = $(this.wrapper)[0].getBoundingClientRect();
      let svgOffset = svg[0].getBoundingClientRect();
      svg
        .css("top", wrapperOffset.top - svgOffset.top + "px")
        .css("left", wrapperOffset.left - svgOffset.left + "px");
    }

    return (this.svg = svg);
  }

  _genCanvasWrapper() {
    // 生成canvas wrapper
    this.canvasWrapper = new SelectCanvas();
    this.canvasWrapper.init({
      root: this.root,
      _on: this.on.bind(this),
      _emit: this.emit.bind(this),
    });
  }
}

export default BaseCanvas;
