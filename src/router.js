// import Vue from 'vue'
// import Router from 'vue-router'

import myblog from './views/myBlog'
import addblog from './views/addBlog'
import showblog from './views/showBlog'
import login from './views/login'
import projects from './views/projects'
import homepage from './views/homepage'
import update from './views/updateBlog'

Vue.use(VueRouter)

export default new VueRouter({
  base: process.env.BASE_URL,
  routes: [
    { path: __dirname+'myblog', component(resolve){
        require(['./views/myBlog'],resolve)
    }},
    { path: __dirname+'addblog', component(resolve){
      require(['./views/addBlog'],resolve)
  }},
    { path: __dirname+'blog/:id', component(resolve){
      require(['./views/showBlog'],resolve)
  }},
    { path: __dirname+'login', component(resolve){
      require(['./views/login'],resolve)
  }},
    { path: __dirname+'projects', component(resolve){
      require(['./views/projects'],resolve)
  }},
    { path: __dirname+'index', component(resolve){
      require(['./views/homepage'],resolve)
  }},
    { path:__dirname+'update/:id',component(resolve){
      require(['./views/updateBlog'],resolve)
  }},
    {path:__dirname+'*',component(resolve){
      require(['./views/homepage'],resolve)
  }}

  ]
})
