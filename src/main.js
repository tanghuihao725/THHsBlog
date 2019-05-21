// import Vue from 'vue'
import App from './App.vue'
import router from './router' // 使用路由
import Bomb from "hydrogen-js-sdk" // 外接数据库
import mavonEditor from 'mavon-editor' // md编译器
import 'mavon-editor/dist/css/index.css' // md 编译器样式
// import 'bootstrap' // bootstrap插件
import {store} from './store' // Vuex
// import './plugins/element.js' // Element-ui


Vue.config.productionTip = false
Vue.use(mavonEditor)

Bomb.initialize("79949b6bf5ba595646a6e0579ceefb28",
  "a804bb79991d4243bcae97a7fd9ea552")
Vue.prototype.Bmob = Bmob


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
