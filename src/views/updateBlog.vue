
<template>
  <div class="container">
    <button class="myButton btn btn-default" @click="$router.push(myroute+'blog/'+blogId)">
      <span class="glyphicon glyphicon-arrow-left"></span>
    </button>
    <h3 class="header">Edit Blog</h3>
    <el-input v-model="title" clearable placeholder="请输入标题"></el-input>

    <label class="author">
      作者：
      <span>{{user}}</span>
    </label>

    <el-checkbox-group v-model="checkedLabels" class="tagWrapper">
      <el-checkbox
        v-for="(tag,id) in labels"
        :label="tag.tag_name"
        :key="id"
        size="mini"
        class="tags"
      >{{tag.tag_name}}</el-checkbox>
    </el-checkbox-group>

    <!-- new Tag adder -->
    <div class="newTagWrapper">
      <el-input
        class="newtag"
        placeholder="增加标签,或删除选中标签"
        prefix-icon="el-icon-edit"
        v-model="newtag"
        @keydown.enter="addTag"
      >
        <el-button slot="append" icon="el-icon-circle-plus" @click="addTag"></el-button>
      </el-input>
    </div>

    <!-- 置顶按钮 -->
    <el-switch
      class="istop"
      style="display: block"
      v-model="istop"
      active-color="#13ce66"
      active-text="置顶"
    ></el-switch>

    <!-- markdown Editor -->
    <div>
      <mavon-editor
        v-model="body"
        :toolbars="isMobile?toolbars_phone:toolbars"
        :autofocus="false"
        :subfield="isMobile?false:true"
        :scrollStyle="true"
        id="md"
        :boxShadow="false"
      />
    </div>

    <input
      type="submit"
      class="btn btn-success btn-block"
      value="Submit"
      @click.prevent="post"
      id="submit"
    >
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      self: this,
      myroute: __dirname,
      query_tag: null,
      query_blog: null,
      blog: null,
      title: "",
      labels: [],
      newtag: "",
      checkedLabels: [],
      istop: false,
      body: "",
      blogId: ""
    };
  },
  methods: {
    open: ({ title, type, mes, self }) => {
      // 弹窗提示 title:标题 type种类 success warning error info mes提示信息
      const h = self.$createElement;
      self.$notify({
        title,
        type,
        duration: 2000,
        message: h("i", { style: "color: teal" }, mes)
      });
    },
    post() {
      if (!this.valid()) {
        this.open({
          title: "失败",
          type: "warning",
          mes: "内容或标题不能为空",
          self: this.self
        });
        return;
      }
      this.query_blog
        .get(this.blogId)
        .then(res => {
          res.set("blog_title", this.title);
          res.set("tags", this.checkedLabels);
          res.set("author", this.user);
          // 设置置顶因子
          let top_factor = 0;
          if (this.istop) {
            if (Bmob.User.current()) {
              top_factor = Bmob.User.current().authority;
            }
          }
          res.set("top_factor", top_factor);
          res.set("blog_body", this.body);
          res.save().then(data => {
            this.open({
              title: "成功",
              type: "success",
              mes: "已成功更改",
              self: this.self
            });
            this.$router.push(this.myroute + "blog/" + this.blogId);
          });
        })
        .catch(err => console.log(err));
    },
    valid() {
      if (this.title == "") return false;
      if (this.body == "") return false;
      return true;
    },
    addTag() {
      if (this.newtag != "") {
        this.query_tag.set("tag_name", this.newtag);
        this.query_tag
          .save()
          .then(res => {
            this.labels.push({ id: res.objectId, tag_name: this.newtag });
            this.newtag = "";
            this.open({
              title: "成功",
              type: "success",
              mes: "成功添加标签",
              self: this.self
            });
          })
          .catch(err => console.log(err));
      }
    }
  },
  computed: mapGetters(["user", "isMobile", "toolbars", "toolbars_phone"]),
  created() {
    this.query_tag = Bmob.Query("tags");
    this.query_tag.find().then(res => {
      this.labels = res.map(data => {
        return { id: data.objectId, tag_name: data.tag_name };
      });
      this.query_blog = Bmob.Query("blogs");
      this.blogId = this.$route.params.id;
      this.query_blog.get(this.blogId).then(res => {
        this.blog = res;
        this.title = this.blog.blog_title;
        this.checkedLabels = this.blog.tags.map(tag => tag);
        this.body = this.blog.blog_body;
        this.istop = this.blog.top_factor>0?true:false;
      });
    });
  }
};
</script>

<style scoped>
.container {
  min-height: 800px;
}
/* 大黑块样式 */
.header {
  border: 2px solid black;
  background-color: #000;
  color: #fff;
  padding: 10px;
  width: 50%;
  text-align: center;
  margin-bottom: 20px;
}
.author {
  display: block;
  padding: 10px 0;
  text-align: left;
  margin: 15px 0 0 10px;
}
.tagWrapper {
  position: relative;
  padding: 10px 10px;
  text-align: left;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
}

.newTagWrapper {
  position: relative;
  height: 50px;
  margin: 15px 0;
}
.newtag {
  position: absolute;
  width: 300px;
  left: 0;
}
.istop {
  text-align: left;
  margin-bottom: 10px;
}

#submit {
  margin: 10px 0 80px 0;
}

mavon-editor {
  z-index: 100;
}
</style>
