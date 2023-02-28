<template>
  <transition name="el-fade" @after-leave="handleAfterLeave">
    <div v-show="visible" class="el-message" :style="positionStyle">
      <slot>
        <p>{{message}}</p>
      </slot>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'Main',
    data(){
      return {
        message: '',
        customClass: '',
        onClose: null,
        duration: 3000,
        closed: false,
        visible: false,
        timer: null,
        verticalOffset: 20,
      }
    },
    watch: {
      closed(newVal){
        if(newVal){
          this.visible = false
        }
      }
    },
    computed: {
      positionStyle() {
        return {
          'top': `${ this.verticalOffset }px`
        };
      }
    },
    methods: {
      handleAfterLeave(){
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el)
      },
      clearTimer(){
        clearTimeout(this.timer)
      },
      startTimer(){
        this.timer = setTimeout(() => {
          if(!this.closed){
            this.close()
          }
        }, this.duration);
      },
      close(){
        this.closed = true
        // 调用原型的 onClose 函数
        if(typeof this.onClose === 'function'){
          this.onClose(this)
        }
      }
    },
    mounted(){
      this.startTimer()
    }
  }
</script>

<style lang="less">
</style>