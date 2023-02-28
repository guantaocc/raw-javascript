import { Canvas, Node } from "butterfly-dag";
import "butterfly-dag/dist/index.css";

const dom = document.getElementById("canvas");

let canvas = new Canvas({
  root: dom, //canvas的根节点(必传)
  zoomable: true, //可缩放(可传)
  moveable: true, //可平移(可传)
  draggable: true, //节点可拖动(可传)
});

class ANode extends Node {
  draw(obj) {
    console.log(obj);
    const { left, top } = obj;
    const node = document.createElement("div");
    node.style.backgroundColor = "#979779";
    node.style.width = "50px";
    node.style.height = "50px";
    node.style.left = left + "px" || 0;
    node.style.top = top + "px" || 0;
    // 必须配置 absolute
    node.style.position = "absolute";
    return node;
  }
}

canvas.draw({
  groups: [], //分组信息
  nodes: [
    {
      id: "1",
      top: 100,
      left: 100,
      Class: ANode, //设置基类之后，画布会根据自定义的类来渲染
    },
  ],
  edges: [], // 连线信息
});
