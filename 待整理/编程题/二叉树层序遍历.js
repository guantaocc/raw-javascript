/**
 * 
 * 给定一个二叉树，返回该二叉树层序遍历的结果，（从左到右，一层一层地遍历）
  例如：
  给定的二叉树是{3,9,20,#,#,15,7},
  该二叉树层序遍历的结果是 [ [3], [9, 20], [15, 7] ]
 */

class treeNode {
  constructor(value){
    this.value = value
  }
}

let root = new treeNode(3)
root.left = new treeNode(9)
root.right = new treeNode(20)


function dealTree(root){
  let level = 0
  
}