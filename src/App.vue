<template>
  <div id="app">
  <myhead/>
  <router-view></router-view>
  <!-- <musicplayer/> -->
  <myfoot/>
  </div>
</template>

<script>
import myhead from './views/header'
import myfoot from './views/footer'
import musicplayer from './components/musicplay'

export default {
  name: 'app',
  components: {
    myhead,myfoot,musicplayer
  }
}
</script>

<style>
*{
  box-sizing: border-box;
  padding:0;
  margin:0;
}

/* 全局小按钮样式 */
.myButton{
  display:inline-block;
  padding:5px 10px;
  margin: 0 3px;
  float:right;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* 全局动画 */

/* 闪烁 呼吸灯 */
@keyframes spark {
  from {opacity: 1}
  to {opacity:0.5}
}
@-webkit-keyframes spark {
  from {opacity: 1}
  to {opacity:0.5}
}
</style>
