<template>
  <div>
    <!-- header 导航 -->
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <button id="mybtn" type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <router-link class="navbar-brand" to="/index">THH's BLOG <span class="user">[ {{user}} ]</span></router-link>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav" @click="click(self,$event)"> 
            <li class="active" exact><router-link :to="myroute+'index'">主页</router-link></li>
            <li><router-link :to="myroute+'myblog'">我的博客</router-link></li>
            <li><router-link :to="myroute+'projects'">项目展示</router-link></li>
            <li><router-link :to="myroute+'addblog'" v-if="isLogin">添加博客</router-link></li>
            <li><router-link :to="myroute+'login'" v-if="!isLogin" class="login">Login & Register</router-link></li>
            <li @click="quit"><router-link :to="myroute+'myblog'" v-if="isLogin"><span class="quit">退出登录</span></router-link></li>

          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>
    <p></p>
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import { setTimeout } from 'timers'


export default {
  data(){
    return {
      self:this,
      myroute:__dirname,
    }
  },
  computed:mapGetters(['isLogin','isMobile','user']),
  methods:{
    ...mapMutations(['quit']),
    //点击切换active并收回菜单
    click:(self,e)=>{
      const target = e.target.parentElement;
      $('ul li').removeClass('active');
      target.className='active';
      const result = window.matchMedia('(max-width:768px)');
      if(self.isMobile){
        setTimeout(()=>$("#mybtn").trigger('click'),200);    
      }
      },
  }
  
  
}

</script>



<style scoped>
nav{
  position: relative !important;
}


.logintip{
  color:rgba(255,0,0,0.5);
  margin-left: 10px;
  font-size: 1rem;
  /* font-weight: lighter; */
}
.quit{
  color: gray;
  font-size: 1rem;
}

.user{
  color:gray;
  font-size:1rem;
}

</style>
