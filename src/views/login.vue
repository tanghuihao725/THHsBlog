<template>
  <div class="container">
    <button class="myButton btn btn-default" @click="$router.push('/myblog')">
      <span class="glyphicon glyphicon-arrow-left"></span>
    </button>
    <button class="myButton btn btn-default changeBtn" @click="change">注册</button>
    <h1>Login</h1>

    <div class="loginPage">
      <div class="form-group">
        <label for="account">账号 Account:</label>
        <input
          type="text"
          id="account"
          v-model="account"
          class="form-control"
          @keydown.enter="getfocus('loginPassword')"
          placeholder="Please enter your account"
        >
      </div>
      <div class="form-group">
        <label for>密码 Password:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="form-control"
          @keydown.enter="submit"
          placeholder="Please enter your password"
        >
      </div>
      <a class="Registertip" @click.prevent="change">还没有账号？立即注册！</a>
      <button type="button" class="btn btn-success btn-lg btn-block" @click="submit">提交</button>
    </div>

    <div class="registerPage">
      <el-form ref="form" label-width="3em" class="rigist_a">
        <el-form-item label="账号">
          <el-input
            v-model="account"
            placeholder="请输入账号(必填)"
            @keydown.enter.native="getfocus('registerPassword')"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input 
          v-model="password" 
          placeholder="请输入密码(必填)" 
          id="rPassword" 
          @keydown.enter.native="getfocus('netName')"
          show-password>
        </el-input>
        </el-form-item>
        <el-form-item 
        label="昵称" 
        class="rigist_nn"
        >
          <el-input 
          v-model="netname" 
          :placeholder="'用户'+account"  
          id="netName" 
          @keydown.enter.native="onSubmit"
          clearable></el-input>
        </el-form-item>
        <button type="button" class="btn btn-success btn-lg btn-block" @click="onSubmit">立即注册</button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import { setTimeout } from "timers";

export default {
  data() {
    return {
      self: this,
      account: "",
      password: "",
      netname: "",
      islogin: true
    };
  },
  computed: mapGetters(["isLogin", "tips"]),
  methods: {
    ...mapMutations(["login"]),
    getfocus(type) {
      switch (type) {
        case "loginPassword":
          document.getElementById("password").focus();
          break;
        case "registerPassword":
          document.getElementById("rPassword").focus();
          break;
        case "netName":
          document.getElementById("netName").focus();
      }
    },
    open: ({ title, type, mes, self }) => {
      // 弹窗提示 title:标题 type种类 success warning error info mes提示信息
      const h = self.$createElement;
      self.$notify({
        title,
        type,
        duration: 1500,
        message: h("i", { style: "color: teal" }, mes)
      });
    },
    submit() {
      if (this.account == "" || this.password == "") {
        this.open({
          title: "错误",
          type: "warning",
          mes: "用户名或密码不能为空",
          self: this.self
        });
      } else {
        // 发送登录请求
        Bmob.User.login(this.account, this.password)
          .then(res => {
            this.login(res);
            this.open({
              title: "登陆成功",
              type: "success",
              mes: "欢迎回来, " + res.netname + "!",
              self: this.self
            });
            this.$router.push("/index");
          })
          .catch(res => {
            this.open({
              title: "错误",
              type: "error",
              mes: "用户名或密码错误",
              self: this.self
            });
            this.account = "";
            this.password = "";
          });
      }
    },
    change() {
      this.account = "";
      this.password = "";
      this.netname = "";
      if (!this.islogin) {
        $("h1").text("Login");
        $(".changeBtn").text("注册");
        $(".registerPage")
          .stop()
          .hide();
        $(".loginPage")
          .stop()
          .show();
        this.islogin = true;
      } else {
        $("h1").text("Register");
        $(".changeBtn").text("登录");
        this.islogin = false;
        $(".loginPage")
          .stop()
          .hide();
        $(".registerPage")
          .stop()
          .show();
      }
    },
    onSubmit() {
      if (this.account == "" || this.password == "") {
        this.open({
          title: "错误",
          type: "warning",
          mes: "用户名或密码不能为空",
          self: this.self
        });
      } else {
        if (this.netname == "") {
          this.netname = "用户" + this.account;
        }
        let params = {
          username: this.account,
          password: this.password,
          netname: this.netname,
          authority: 1
        };
        Bmob.User.register(params)
          .then(res => {
            this.open({
              title: "注册成功",
              type: "info",
              mes: "恭喜，将为您自动登录",
              self: this.self
            });

            this.submit();
          })
          .catch(err => {
            let mes;
            if (err.code == 202) {
              mes = "【 账号 】";
              this.account = "";
            } else {
              mes = "【 昵称 】";
              this.netname = "";
            }
            mes += "已被占用，请重新输入。";
            this.open({
              title: "错误",
              type: "error",
              mes,
              self: this.self
            });
          });
      }
    }
  }
};
</script>

<style scoped>
.loginPage {
  display: block;
}
.registerPage {
  display: none;
}
h1 {
  display: block;
  width: 150px;
  height: 50px;
  background-color: black;
  color: #fff;
  text-align: center;
  line-height: 50px;
  margin-bottom: 20px;
}
p {
  display: block;
  height: 30px;
  line-height: 30px;
  border-radius: 5px;
  text-indent: 2rem;
}
label {
  margin: 20px 0;
}
.btn-success {
  margin-top: 50px;
  outline: none;
}
input {
  height: 50px;
  font-size: 1.2em;
}
</style>


