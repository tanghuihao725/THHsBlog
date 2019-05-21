<template>
  <!-- show comments -->
  <div class="container">
    <h3 style="text-align:center;margin:15px">留言板</h3>
    <div class="all">
      <p class="head">
        {{commentText}}区: 共有(
        <span>{{get_comments.length}}</span>)条评论
      </p>
      <h4 class="sofaTip" v-if="get_comments.length==0"><span class="spark glyphicon glyphicon-bullhorn
"></span>:快来抢个沙发吧！</h4>
      <!-- 评论内容展示区 -->
      <ul>
        <li v-for="(comment,id) in show_comments" :key="id">
          <p>
            <i>{{get_comments.length-id}}楼:</i>
            <span class="from" @click.stop="reply(comment.from)">
              {{comment.from}}
              <span v-if="comment.from=='唐慧豪'" style="color:red;margin-right:0">[博主]</span>
            </span>
            <span v-show="comment.to">
              回复
              <span class="to" @click.stop="reply(comment.to)">{{comment.to}}</span>
              <span v-if="comment.to=='唐慧豪'" style="color:red;margin-right:0">[博主]</span>
            </span>
            <span class="saytime">{{isMobile?short_time(comment.createdAt):comment.createdAt}}</span>
          </p>
          <p class="content">{{comment.content}} 
              <del 
              class="pull-right" 
              @click.prevent="deleteItem(comment)"
              v-if="(myuser&&myuser.authority>1)||username==comment.from"
              ><span class="glyphicon glyphicon-trash"></span></del> 
        </p>
          <hr>
        </li>
      </ul>
      <!-- 展示更多 -->
      <div class="showmoreWrapper" style="text-align:center">
        <p class="showmore" @click="updatelength()" 
        v-show="show_comments.length<get_comments.length">
          <span class="glyphicon glyphicon-chevron-down"></span>
          展示更多
        </p>

        <p class="spark" v-show="show_length>num" @click="show_length=num">
          <span class="glyphicon glyphicon-menu-up"></span>
          收起
        </p>
      </div>
    </div>
    <!-- do comment -->
    <div class="withdrawWrapper" v-show="showTable" @click.stop>
      <el-input
        class="username"
        :prefix-icon="myuser?'':'el-icon-edit-outline'"
        v-model="username"
        :disabled="!!myuser"
        @blur="autofill"
        @clear="autofill"
        clearable
      ></el-input>
      <button
        class="btn btn-warning btn-sm"
        v-show="to!=''"
        @click.stop="cancelClick"
      >取消回复:{{to.length>5?to.slice(0,5)+"...":to}}</button>
      <el-form>
        <div class="beforefoot">
          <el-input
            type="textarea"
            class="textarea"
            :autosize="{ minRows: 3, maxRows: 3}"
            :placeholder="'回复'+to+' :'"
            v-model="content"
            @keydown.enter.native="submit"
            clearable
          ></el-input>
          <button class="btn btn-success" @click.prevent.stop="submit">确认</button>
        </div>
      </el-form>
    </div>
    <button v-show="!showTable" @click.stop="write" class="reply btn btn-success">{{commentText}}</button>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  props: ["belong_to", "num", "add", "commentText"],
  data() {
    return {
      self: this,
      query: null,
      comments: [],
      comment_length: 0,
      show_length: 0,
      myuser: null,
      showTable: window.matchMedia("(min-width:768px)").matches,
      username: "",
      content: "",
      to: ""
    };
  },
  created() {
    // 根据模块名字初始化评论数据
    this.fetch_comments({ belong_to: this.belong_to }).then(res => {
      this.comments = res;
      this.comment_length = res.length;
      this.show_length = res.length > this.num ? this.num : res.length;
    });
    // 获取当前用户信息
    this.myuser = Bmob.User.current();
    if (this.myuser) {
      this.username = this.myuser.netname;
    } else {
      this.username = this.user;
    }
  },
  computed: {
    ...mapGetters(["isMobile", "get_comments", "user", "get_pipe"]),
    // 只展示有限数量
    show_comments() {
      if(this.get_comments.length<this.num)
        this.show_length = this.get_comments.length+1;
      return this.get_comments.slice(0, this.show_length);
    }
  },
  methods: {
    ...mapMutations(["set_pipe"]),
    ...mapActions(["fetch_comments", "add_comment","del_comment"]),
    updatelength() {
      this.show_length =
        this.show_length + this.add > this.get_comments.length
          ? this.comments.length
          : this.show_length + this.add;
    },
    reply(name) {
      if(this.isMobile){
          $('.withdrawWrapper').css({'position':'fixed','bottom':'0'}).stop().slideDown();
          $('.container').on('click',()=>{
          // 给body加上默认事件 如果点击body 将收回菜单
          $('.withdrawWrapper').stop().slideUp();
          setTimeout(()=>this.showTable = false,500)
      });
      }
        
      this.showTable = true;
      this.to = name;
      let area = document.getElementsByTagName("textarea")[0];
      if (area) {
        area.focus();
      }
    },
    deleteItem(comment){
        this.del_comment(comment).then(res=>{
            this.$message({
            message: '删除成功!',
            type: 'success'
        });
        }
         )
    }
    ,
    short_time(time) {
      // 手机端显示时间简写
      let res = time.replace(/^[\d]{4}-/, "");
      return res.replace(/:[\d]{2}$/, "");
    },
    autofill() {
      // 如果试图让用户名为空，将自动补成默认
      if (this.username == "") {
        this.username = this.user;
      }
    },
    write() {     
      $('.withdrawWrapper').css({'position':'fixed','bottom':'0'}).stop().slideDown();
      $('.container').on('click',()=>{
          // 给body加上默认事件 如果点击body 将收回菜单
          $('.withdrawWrapper').stop().slideUp();
          setTimeout(()=>this.showTable = false,500)
      });
      this.showTable = true;
      let area = document.getElementsByTagName("textarea")[0];
      if (area) {
        area.focus();
      }
    },
    submit() {
      if (this.content == "") {
        this.$message({
          message: "内容不能为空！",
          type: "warning"
        });
        return;
      }
      let obj = {
        from: this.username,
        to: this.to,
        content: this.content,
        belong_to: this.belong_to
      };
      this.add_comment(obj).then(res => {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.cancelClick();
        this.content = "";
        if(this.isMobile){
            $('.withdrawWrapper').stop().slideUp();
        setTimeout(()=>{
            $('.reply').stop().fadeIn();
            this.showTable=false;
        },500)
        }
      });
    },
    cancelClick() {
      // 取消回复
      this.to = "";
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  text-align: left;
}

.all {
  margin-bottom: 40px;
}
.all div {
  position: relative;
  text-align: left;
}

.all .head {
  display: inline-block;
  font-size: 1em;
  padding: 0.3em 1em 0.3em 1em;
  background-color: black;
  color: #fff;
  margin-bottom: 10px;
}
.all .head span {
  margin: 0 0.6em;
}
.sofaTip{
    text-align: left;
    color:#999;
    padding:10px 30px;
}
i {
  font-size: 0.9em;
  color: #999;
}

.all li {
  list-style: none;
  /* background-color:skyblue; */
  padding: 3px 0px 3px 0px;
  border-radius: 2px;
  margin: 0 10px;
}
.all li p {
  margin: 20px 0px;
}
.all li span {
  margin-right: 0px;
}
.spark {
  animation: spark 1s infinite alternate;
  -webkit-animation: spark 1s infinite alternate;
  text-align: center;
  margin: 10px;
  cursor: pointer;
}
.all .from,
.all .to {
  color: #409eff;
  cursor: pointer;
}

.all .saytime {
  position: absolute;
  font-size: 12px;
  right: 10%;
  color: #999;
}

del{
    text-decoration: none;
    color:rgba(255,0,0,0.6);
    cursor: pointer;
    margin:5px 0 5px 0 0em;
}
del span{
    padding:0 2em 0 0;
}
.showmore {
  text-align: center;
  cursor: pointer;
  margin: 30px;
}
.showmoreWrapper{
    margin-bottom: 80px;
}

.withdrawWrapper {
  position:relative;
  width: 100%;
  text-align: left;
  background-color: rgba(255,255,255,1);
  margin-bottom: 0px;
  padding: 0px 30px 30px 0;
  z-index:1000;

}
.username {
  width: 12em;
  border: none;
  outline: none;
  margin-bottom: 3px;
}
.btn-warning {
  padding: 10px 10px;
  margin-left: 10px;
}
.textarea {
  width: 75%;
}
.withdrawWrapper .btn-success {
  display: inline-block;
  height: 75px;
  width: 25%;
  text-align: center;
}

.reply {
  z-index: 1000;
  display: block;
  position: fixed;
  width: 3em;
  height: 3em;
  line-height: 2em;
  text-align: center;
  font-size: 1.5em;
  border-radius: 50%;
  right: 30px;
  bottom: 50px;
  box-shadow: 0 0 10px green;
}
</style>


