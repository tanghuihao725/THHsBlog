
<template>
  <div class="container">
    <button class="myButton btn btn-default" @click="$router.push('/myblog')">
      <span class="glyphicon glyphicon-arrow-left"></span>
    </button>

    <!-- AddBlog大黑块 -->
    <h3 class="header">Add Blog</h3>

    <el-input v-model="ruleForm.title" clearable placeholder="请输入标题"></el-input>

    <label class="author">
      作者：
      <span>{{user}}</span>
    </label>

    <!-- loop for tags for showing -->
    <el-checkbox-group v-model="ruleForm.checkedLabels" class="tagWrapper">
      <el-checkbox
        v-for="(tag,id) in ruleForm.labels"
        :label="tag"
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
        v-model="ruleForm.newtag"
        @keydown.enter="addTag"
      >
        <el-button slot="append" icon="el-icon-circle-plus" @click="addTag"></el-button>
        <el-button slot="append" icon="el-icon-delete" @click="removeTag"></el-button>
      </el-input>
    </div>

    <!-- 置顶按钮 -->
    <el-switch
      class="istop"
      style="display: block"
      v-model="ruleForm.istop"
      active-color="#13ce66"
      active-text="置顶"
    ></el-switch>

    <!-- markdown Editor -->
    <div>
      <mavon-editor
        v-model="ruleForm.body"
        :toolbars="isMobile?toolbars_phone:toolbars"
        :autofocus="false"
        :subfield="isMobile?false:true"
        :scrollStyle="true"
        id="md"
        :boxShadow="false"
        @imgAdd="$imgAdd"
        @imgDel="$imgDel"
        ref="md"
      />
    </div>
    <!-- submit -->
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
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      self: this,
      query_tag: null,
      ruleForm: {
        title: "",
        labels: [],
        newtag: "",
        checkedLabels: [],
        istop: false,
        body: "",
        imgs:[],
      }
    };
  },
  methods: {
    ...mapMutations([]),
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
      // 提交博文
      if (this.valid()) {
        // 合法性检测
        const query = Bmob.Query("blogs");
        query.set("blog_title", this.ruleForm.title);
        query.set("blog_body", this.ruleForm.body);
        query.set("author", this.user);
        query.set("tags", this.ruleForm.checkedLabels.map(lab => lab.tag_name));
        query.set("imgs",this.ruleForm.imgs)
        // 设置置顶因子
        let top_factor=0;
        if(this.ruleForm.istop){
          if(Bmob.User.current()){
            top_factor = Bmob.User.current().authority;
          }
        }
        query.set("top_factor",top_factor);
        query
          .save()
          .then(res => {
            this.open({
              title: "成功",
              type: "success",
              mes: "博文添加成功",
              self: this.self
            });
            this.$router.push("/myblog");
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        // 检测不合格
        this.open({
          title: "错误",
          type: "error",
          mes: "标题或内容不可空",
          self: this.self
        });
      }
    },
    valid() {
      // 输入合法性检测
      if (this.ruleForm.title == "") return false;
      if (this.ruleForm.body == "") return false;
      return true;
    },
    addTag() {
      // 添加标签
      if (this.ruleForm.newtag != "") {
        this.query_tag.set("tag_name", this.ruleForm.newtag);
        this.query_tag
          .save()
          .then(res => {
            this.ruleForm.labels.push({
              id: res.objectId,
              tag_name: this.ruleForm.newtag
            });
            this.ruleForm.newtag = "";
            this.open({
              title: "成功",
              type: "success",
              mes: "标签增加成功",
              self: this.self
            });
          })
          .catch(err => console.log(err));
      }
    },
    removeTag() {
      // 移除标签
      this.ruleForm.checkedLabels.forEach(label => {
        this.query_tag
          .destroy(label.id)
          .then(res => {
            this.ruleForm.labels = this.ruleForm.labels.filter(lab => {
              return lab.id != label.id;
            });
            this.open({
              title: "成功",
              type: "success",
              mes: "标签删除成功",
              self: this.self
            });
          })
          .catch(err => console.log(err));
      });
    },
    $imgAdd(pos, $file){
      self = this
      let file = Bmob.File($file.name, $file);
      file.save().then(res=>{
        const url = res[0].url
        this.ruleForm.imgs.push(url)
        self.$refs.md.$img2Url(pos, url);
      })
    },
    $imgDel(file){
        const url = file[1]
        this.ruleForm.imgs = this.ruleForm.imgs.filter(imgUrl=>{
          return imgUrl!=url
        })
        const del = Bmob.File()
        del.destroy(url)
    }
  },
  computed: mapGetters(["user", "isMobile", "toolbars", "toolbars_phone"]),
  created() {
    // 初始化数据 获得数据库对象
    this.query_tag = Bmob.Query("tags");
    this.query_tag.find().then(res => {
      this.ruleForm.labels = res.map(data => {
        return { id: data.objectId, tag_name: data.tag_name };
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
  margin: 15px 0 0px 0;
}
.newtag {
  position: absolute;
  width: 300px;
  left: 0;
}
.istop{
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
