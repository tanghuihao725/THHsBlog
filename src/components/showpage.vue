<template>
  <div @click.stop class="mywrapper">
    <el-carousel :interval="3000" arrow="always" height="580px" id="card" v-if="!isMobile">
      <el-carousel-item>
        <img src="../assets/1.jpg" alt>
      </el-carousel-item>
      <el-carousel-item>
        <img src="../assets/2.jpg" alt>
      </el-carousel-item>
      <el-carousel-item>
        <img src="../assets/3.jpg" alt>
      </el-carousel-item>
      <el-carousel-item>
        <img src="../assets/4.jpg" alt>
      </el-carousel-item>
      <el-carousel-item>
        <img src="../assets/5.jpg" alt>
      </el-carousel-item>
    </el-carousel>

    <el-carousel :interval="3000" arrow="always" height="470px" id="card" v-if="isMobile">
      <el-carousel-item>
        <img src="../assets/4.jpg" alt>
      </el-carousel-item>
      <el-carousel-item>
        <img src="../assets/1.jpg" alt>
      </el-carousel-item>
      <el-carousel-item>
        <img src="../assets/9.jpg" alt>
      </el-carousel-item>
      <el-carousel-item>
        <img src="../assets/6.jpg" alt>
      </el-carousel-item>
    </el-carousel>

    <div class="showText" v-if="!isMobile">
      <h1>WELCOME!</h1>
      <h3>{{user}}</h3>
      <h1>{{getDay}}</h1>
      <h3 class="note">一定要爱着点什么，恰似草木对阳光的钟情</h3>
    </div>

    <div class="mobileWrapper" v-if="isMobile">
      <div class="mobile">
        <h1>Welcome!</h1>
        <h1>{{getDay}}</h1>
        <router-link tag="h3" to="/myblog">进入博客</router-link>
        <router-link tag="h4" to="/login" v-if="!Bmob.User.current()">快速登录</router-link>
      </div>
    </div>
  </div>
</template>



<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      mobile: false,
      time: {
        year: "",
        month: "",
        day: "",
        date: "",
        year: "",
        hour: "",
        minute: "",
        seconds: ""
      }
    };
  },
  created() {
    const arr = ["日", "一", "二", "三", "四", "五", "六"];
    const date = new Date();
    this.time.year = date.getFullYear();
    this.time.month = date.getMonth();
    this.time.day = "星期" + arr[date.getDay()];
    this.time.date = date.getDate();
  },
  computed: {
    ...mapGetters(["isMobile", "user"]),
    getHeight() {
      return this.isMobile ? "550px" : "680px";
    },
    getDay() {
      return `${this.time.year}.${this.time.month + 1}.${this.time.date} ${
        this.time.day
      }`;
    }
  },
  methods: {}
};
</script>

<style scoped>
.mywrapper {
  display: relative;
  margin: 10px 0 60px 0;
}
.showText,
.mobileWrapper {
  z-index: 100;
  position: absolute;

  top:30%;
  left: 0;
  right: 0;
  margin: 0 auto;
  color: #fff;
  text-shadow: 5px 5px 50px #fff;

  text-align: center;
}

.mobileWrapper{
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  top: 10px;
  height: 470px;
}
.mobile {
  position: absolute;
  top: 30%;
  left: 10%;
}

.showText h1 {
  font-size: 5rem;
}
.showText h2 {
  font-size: 4rem;
}
.note {
  animation: spark 5s infinite alternate;
  -webkit-animation: spark 5s infinite alternate;
}
</style>