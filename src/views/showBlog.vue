<template>
  <div class="container">
    <div class="myAlert">
      <div class="alert-head">删除确认</div>
      <div class="alert-content">你确认要删除这篇博客吗？</div>
      <div class="alert-foot">
        <button class="yes btn btn-danger" @click="deleteBlog">确认</button>
        <button class="no btn btn-default" @click="cancel">取消</button>
      </div>
    </div>
    <div class="btnGroup">
      <!-- 右上角的按钮组，删除 编辑 以及 返回 -->
      <button class="myButton btn btn-default" v-show="isLogin" @click="alert">
        <span class="glyphicon glyphicon-trash"></span>
      </button>
      <button
        class="myButton btn btn-default"
        v-show="isLogin"
        @click="updateBlog"
      >
        <span class="glyphicon glyphicon-pencil"></span>
      </button>
      <button class="myButton btn btn-default" @click="goback">
        <span class="glyphicon glyphicon-arrow-left"></span>
      </button>
    </div>
    <transition>
      <div class="all">
        <h1 @click="goback">{{blog.blog_title}}<span v-show="blog.top_factor>0">[置顶]</span></h1>
        <p>
          <span class="glyphicon glyphicon-user"></span>
          {{blog.author}}
        </p>
        <p>
          <span>发布时间:</span>
          <span>{{blog.createdAt}}</span>
        </p>
        <p v-show="blog.createdAt!=blog.updatedAt">
          <span>最新更改:</span>
          <span>{{blog.updatedAt}}</span>
        </p>
        <p>
          <span class="glyphicon glyphicon-tag"></span>
          <span v-for="(tag,id) in blog.tags" :key="id">{{tag}}</span>
        </p>

        <mavon-editor
          id="md"
          :value="blog.blog_body"
          :subfield="prop.subfield"
          :defaultOpen="prop.defaultOpen"
          :toolbarsFlag="prop.toolbarsFlag"
          :editable="prop.editable"
          :scrollStyle="prop.scrollStyle"
          :boxShadow="prop.boxShadow"
        ></mavon-editor>
      </div>
    </transition>
    <comment :belong_to="'blog:'+blogId" :num="isMobile?3:5" :add="5" :commentText="'评论'"/>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import comment from '../components/comment'

export default {
  data() {
    return {
      myroute: __dirname,
      blog: {},
      query: null,
      blogId: ""
    };
  },
  created() {
    this.blogId = this.$route.params.id;
    const query = Bmob.Query("blogs");
    this.query = query;
    query.get(this.blogId).then(res => (this.blog = res));
  },
  mounted() {
    $("#md")
      .find("div")
      .css("border", "none")
      .css("backgroundColor", "white");
  },
  computed: {
    ...mapGetters(["isLogin","isMobile"]),
    prop() {
      let data = {
        subfield: false, // 单双栏模式
        defaultOpen: "preview", //edit： 默认展示编辑区域 ， preview： 默认展示预览区域
        editable: false,
        toolbarsFlag: false,
        scrollStyle: true,
        boxShadow: false
      };
      return data;
    }
  },
  methods: {
    deleteBlog() {
      if(!this.authorityCheck()){
        this.$message({
          message: '您的权限不够，不能删除别人的文章',
          type: 'warning'
        });
        this.cancel();
        return
      }
      this.query
        .destroy(this.$route.params.id)
        .then(res => {
          let query_comment = Bmob.Query('comments');
          query_comment.equalTo("belong_to","==","blog:"+this.blogId);
          query_comment.find().then(res=>{
            res.forEach(data=>query_comment.destroy(data.objectId))
          })
          const del = Bmob.File()
          del.destroy(this.blog.imgs)
          setTimeout(() => {
            this.$router.push("/myblog");
          }, 0);
        })
        .catch(err => console.log(err));
    },
    updateBlog() {
      if(this.authorityCheck()){
        this.$router.push(this.myroute+'update/'+this.blogId)
      }else{
        this.$message({
          message: '您的权限不够，不能编辑别人的博文',
          type: 'warning'
        });
      }
    },
    alert() {
      $(".myAlert")
        .stop()
        .fadeIn();
      $(".wrapper").toggleClass("transparent");
    },
    cancel() {
      $(".myAlert")
        .stop()
        .fadeOut();
      $(".wrapper").removeClass("transparent");
    },
    goback() {
      this.$router.push(__dirname + "myblog");
    },
    authorityCheck(){
      // 权限认证
      if(Bmob.User.current().authority<=1)
      if(Bmob.User.current().netname !== this.blog.author){
        return false;
      }
      return true;
    }
  },
  components:{comment}
};
</script>

<style scoped>
.transparent {
  opacity: 0.2;
}

h1,
p {
  text-align: center;
}
h1 {
  margin-top: 50px;
}

h1 span{
  font-size: 0.6em;
  color:rgba(200,0,0,0.9);
  margin-left: 10px;
  animation: spark 1s infinite alternate;
  -webkit-animation: spark 1s infinite alternate;
}

p {
  color: #999;
}
p span {
  margin: 0 10px;
}
.content {
  word-wrap: break-word;
  color: black;
}
.del {
  color: black;
  height: 50px;
  line-height: 50px;
  text-indent: 3em;
  margin: 10px;
  display: none;
}
.myAlert {
  display: none;
  position: fixed;
  width: 20em;
  height: 200px;
  border: 2px solid black;
  left: 0;
  right: 0;
  margin: 100px auto;
  z-index: 99999;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 5px;
}
.alert-head {
  height: 40px;
  background-color: black;
  line-height: 40px;
  text-align: center;
  font-size: 2rem;
  color: #fff;
}
.alert-content {
  height: 100px;
  line-height: 100px;
  font-size: 1.5em;
  text-indent: 1em;
  background-color: #fff;
}
.alert-foot {
  width: 100%;
  position: absolute;
  background-color: #fff;
  left: 0;
  right: 0;
  margin: auto;
}
.yes {
  margin-left: 1em;
  width: 40%;
}
.no {
  width: 40%;
  margin-left: 1em;
}

#md {
  margin: 10px 0 50px 0;
  padding: 0;
  z-index:100
}

/* 入场动画 */
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
