<template>
  <div id="app">
    <button @click="clickMessage">点击弹窗</button>
    <BackTop />
    <hr />
    <Calendar />
  </div>
</template>

<script>
import Message from './components/Message/message.js'
import BackTop from './components/BackTop'
import Calendar from './components/Calendar'

export default {
  name: "App",
  components: {
    BackTop,
    Calendar
  },
  methods: {
    clickMessage(){
      Message({
        message: '这是一个弹窗',
        onClose: function(){
          console.log('user on close')
        }
      })
    }
  }
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  height: 2000px;
}
</style>
