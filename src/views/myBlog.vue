
<template>
  <div class="container">
    <!-- 展示未登录用户的提示信息 -->
    <p class="tip" v-show="!isLogin">
      tip : 您是访客身份登录，无法对博客进行增加或修改操作
    </p>
    <!-- TAG FILTER标签 -->
    <p class="btn btn-default filter" @click.prevent="show_tag">
      <span class="glyphicon glyphicon-tags"></span>
      Tag Filter
      <span class="num">{{computed_blogs.length}}</span>
    </p>
    <div class="wrapper"> 
      <!-- 展示标签 -->
      <li v-for="(tag,id) in tags" @click="selecting" :key="id">{{tag}}</li>
    </div>

    <transition-group mode="out-in">
      <!-- 每条博文的展示 被动画组包裹--> 
      <router-link
        tag="div"
        v-for="(blog,id) in computed_blogs"
        class="single"
        :to="'/blog/'+blog.objectId"
        :key="id">
        <h3>{{blog.blog_title}}
          <span v-show="blog.top_factor" class="top_tip">[置顶]</span>
        </h3>
        <p class="info">
          <span class="glyphicon glyphicon-user"></span>
          <span>{{blog.author}}</span>
          创建时间:
          <span>{{blog.createdAt.replace(/:\d{2}$/,"")}}</span>
        </p>
        <p class="info" v-show="showUpdate(blog)">
          于
          <span>{{blog.updatedAt.replace(/:\d{2}$/,"")}}</span>
          更改
        </p>
        <p class="info">
          <span class="glyphicon glyphicon-tag" v-show="blog.tags.length"></span>
          <span v-for="(tag,id) in blog.tags" class="tag" :key="id">{{tag}}</span>
        </p>
        <p class="content">{{snipped(blog.blog_body.replace(/[#`!\*\[\]-]/g," "))}}</p>
        <div class="readmore">
          阅读全文
          <span class="glyphicon glyphicon-menu-right"></span>
        </div>
        <hr>
      </router-link>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { setTimeout } from "timers";
import { async } from "q";

export default {
  data() {
    return {
      blogs: [],
      tags: [],
      selected_tags: [], // 标签选择器选择的结果
      query_blog: null,
      query_tag: null,
      lock: false,
    };
  },
  computed: {
    ...mapGetters(["isLogin", "isMobile"]),
    computed_blogs() {
      // 和标签选择器匹配出所需要展示的博文
      let computed_blogs = this.blogs;
      computed_blogs = computed_blogs.filter(blog => {
        let isOne = true;
        this.selected_tags.forEach(tag => {
          if (
            !blog.tags.find(t => {
              return t == tag;
            })
          ) {
            isOne = false;
          }
        });
        return isOne;
      });
      return computed_blogs;
    }//computed_blogs
  },
  created() {
    // 初始化数据库，并给data赋值
    this.query_blog = Bmob.Query("blogs");
    this.query_blog.order("-top_factor","-updatedAt");
    this.query_blog.find().then(res => {
      this.blogs = res;
    });
    this.query_tag = Bmob.Query("tags");
    this.query_tag.find().then(res => {
      this.tags = res.map(data => data.tag_name);
    });
  },
  methods: {
    snipped(str) {
      // 过长博文斩断为省略号
      let limit = this.isMobile ? 140 : 300;
      if (str.length > limit) {
        return str.slice(0, limit) + "...";
      } else {
        return str;
      }
    },
    show_tag() {
      $(".wrapper")
        .stop()
        .slideToggle();
    },
    selecting(e) {
      // 自选标签选择器和selected配合
      if (e.target.className === "") {
        e.target.className = "selected";
        this.selected_tags.push(e.target.innerText);
      } else {
        e.target.className = "";
        this.selected_tags = this.selected_tags.filter(tag => {
          return tag !== e.target.innerText;
        });
      }
    },
    showUpdate(blog) {
      // 对于只创建未修改的博文不展示更新时间
      if (blog.createdAt == blog.updatedAt) return false;
      return true;
    }
  }
};
</script>

<style scoped>


*::-webkit-scrollbar {
  /* 解决safari出现滚动条产生位移，使画面内容抖动 */
  width: 0;
}

.tip {
  font-size: 12px;
  color: #999;
  text-align: center;
}

/* 标签筛选器及下级标签样式 */
.filter {
  position: relative;
  left:0;
  right:0;
  margin: 0 auto;
  padding: 10 50px;
  animation: spark 1s infinite alternate;
  -webkit-animation: spark 1s infinite alternate;
}
.filter .num {
  display: inline-block;
  height: 1.5em;
  width: 1.5em;
  font-size: 12px;
  line-height: 1.5em;
  text-align: center;
  border-radius: 30%;
  background: black;
  color: #fff;
}
.wrapper {
  display: none;
  padding: 10px 5px;
  left: 0;
  right: 0;
  margin: 0 auto;
  text-align: center;
}
.wrapper li {
  list-style: none;
  display: inline-block;
  border: 1px solid black;
  padding: 3px 6px;
  border-radius: 5px;
  margin: 5px 5px;
  cursor: pointer;
}
.selected {
  background-color: black;
  color: #fff;
}

/* 博文项块样式 */
.single {
  width: 100%;
  padding: 20px;
  margin: 10px 0;
  cursor: pointer;
}
h3 {
  text-align: center;
  margin-bottom: 25px;
}
h3 span{
  font-size: 0.7em;
  color:rgba(200,0,0,0.9);
  margin-left: 10px;
  animation: spark 1s infinite alternate;
  -webkit-animation: spark 1s infinite alternate;
}
.info {
  text-align: center;
  color: #999;
  font-size: 12px;
}
.info span,
.btn span {
  margin: 0 5px;
}
.tag {
  border-bottom: 1px dotted #999;
  padding: 0 0 1px 0;
}
.content {
  position: relative;
  left: 0;
  right: 0;
  margin: 20px auto;
  width: 80%;
  word-wrap: break-word;
  text-align: center;
  text-indent: 2em;
}
.readmore {
  position: relative;
  width: 8em;
  height: 2.5em;
  line-height: 2.5em;
  text-align: center;
  background-color: black;
  color: #fff;
  text-shadow: 0 0 10px #fff;
  left: 0;
  right: 0;
  margin: 0 auto;
}
.readmore span {
  font-size: 12px;
  animation: spark 2s infinite alternate;
  -webkit-animation: spark 2s infinite alternate;
}

/* 出场动画效果 */
.v-enter {
  opacity: 0;
  transform: translate(0, 10px);
  -webkit-transform: translate(0, 10px);
}
.v-enter-active {
  transition: all 1s;
  -webkit-transition: all 1s;
}
</style>
