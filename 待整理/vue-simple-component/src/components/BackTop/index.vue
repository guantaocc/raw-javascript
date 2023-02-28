<template>
  <transition name="el-fade-in">
    <div class="el-back-top" @click.stop="handleScrollTop" v-if="visible">
      <button>返回顶部</button>
    </div>
  </transition>
</template>

<script>
import throttle from './throttle'
const cubic = value => Math.pow(value, 3);
const easeInOutCubic = value => value < 0.5
  ? cubic(value * 2) / 2
  : 1 - cubic((1 - value) * 2) / 2;
export default {
  props: {
    visibilityHeight: {
      type: Number,
      default: 500,
    },
  },
  data() {
    return {
      visible: false,
      container: null,
    }
  },
  mounted() {
    this.init()
    this.throttleHandler = throttle(this.handleScroll, 300)
    this.container.addEventListener('scroll', this.throttleHandler)
  },
  beforeDestroy() {
    this.container.removeEventListener('scroll', this.throttleHandler)
  },
  methods: {
    handleScroll() {
      const scrollTop = this.el.scrollTop
      this.visible = scrollTop >= this.visibilityHeight
    },
    init() {
      this.container = document
      this.el = document.documentElement
      if (this.target) {
        this.el = document.querySelector(this.target)
        if (!this.el) {
          throw new Error(`target is not existed: ${this.target}`)
        }
        this.container = this.el
      }
    },
    handleScrollTop() {
      const el = this.el
      const beginTime = Date.now()
      const beginValue = el.scrollTop
      const rAF = window.requestAnimationFrame || (func => setTimeout(func, 16))
      const frameFunc = () => {
        const progress = (Date.now() - beginTime) / 500
        if (progress < 1) {
          el.scrollTop = beginValue * (1 - easeInOutCubic(progress))
          rAF(frameFunc)
        } else {
          el.scrollTop = 0
        }
      }
      rAF(frameFunc)
    },
  },
}
</script>

<style lang="less" scoped>
.el-back-top {
  position: fixed;
  right: 20px;
  bottom: 20px;
}
.el-fade-in-enter {
  opacity: 0;
}
.el-fade-in-enter-active {
  transition: opacity 0.5s ease;
}
.el-fade-in-enter-to {
  opacity: 1;
}
</style>
