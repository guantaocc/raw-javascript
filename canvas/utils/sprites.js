/**
 * @description sprite精灵绘制器
 */

export class Sprite {
  constructor(name, painter, behaviors) {
    this.left = 0;
    this.top = 0;
    this.width = 10;
    this.height = 10;
    this.velocityX = 0;
    this.velocityY = 0;
    this.visible = true;
    this.name = name
    this.painter = painter || undefined;
    this.behaviors = behaviors || [];
  }

  paint(context) {
    if (this.painter && this.visible) {
      this.painter.paint(this, context);
    }
  }

  /**
   * 
   * @param {*} context 绘制上下文
   * @param {*} time 当前帧时间
   */
  update(context, time) {
    for (let i = this.behaviors.length; i > 0; --i) {
      this.behaviors[i - 1].execute(this, context, time);
    }
  }
}


// 图片绘制器
export class ImagePointer {
  constructor(url) {
    this.image = new Image();
    this.image.src = url;
  }

  paint(sprite, context) {
    if (!this.image) return;
    if (!this.image.complete) {
      this.image.onload = function (e) {
        sprite.width = this.width;
        sprite.height = this.height;
        context.drawImage(
          this.image,
          sprite.left,
          sprite.top,
          sprite.width,
          sprite.height
        );
      };
    } else {
      context.drawImage(
        this.image,
        sprite.left,
        sprite.top,
        sprite.width,
        sprite.height
      );
    }
  }
}

// 图片脚本绘制器
export class SpriteSheetPainter {
  constructor(target, cells) {
    this.target = target
    this.cells = cells || [];
    this.cellIndex = 0;
  }

  /**
   * 改变下一个需要绘制的图像
   */
  advance() {
    if (this.cellIndex == this.cells.length - 1) {
      this.cellIndex = 0;
    } else {
      this.cellIndex++;
    }
  }

  // 绘制函数
  paint(sprite, context) {
    let cell = this.cells[this.cellIndex];
    context.drawImage(
      this.target,
      cell.left,
      cell.top,
      cell.width,
      cell.height,
      sprite.left,
      sprite.top,
      cell.width,
      cell.height
    );
  }
}


/**
 * 精灵动画控制
 */

export class SpriteAnimater {
  constructor(painters, elapsedCallback){
    this.painters = painters || []
    this.elapsedCallback = elapsedCallback
  }
}