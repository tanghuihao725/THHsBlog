<template>
  <div>
    <div class="control" @click="togglePlay" @dblclick="nextMusic">
      <span class="glyphicon glyphicon-music"></span>
    </div>
    <!-- <iframe id="music" frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=453413861&auto=1&height=66"></iframe> -->
    <!-- 453413861 -->
    <!-- http://music.163.com/song/media/outer/url?id=453413861.mp3 -->
    <audio
      id="music"
      preload="auto"
      src="http://music.163.com/song/media/outer/url?id=453413861.mp3"
    >
      <!-- <source src="src=http://music.163.com/song/media/outer/url?id=453413861.mp3">
      <source src="src=http://music.163.com/song/media/outer/url?id=453413861.mp3">-->
    </audio>
  </div>
</template>

<script>
import { setTimeout, setInterval } from "timers";
export default {
  data() {
    return {
      music: null,
      x: 0,
      y: 0,
      self: this
    };
  },
  methods: {
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
    togglePlay() {
      let music = document.getElementById("music");
      if (music.paused) {
        music.play();
        $(".control").addClass("rotate");
        this.open({
          title: "正在为您播放...",
          mes: "第三人称 - Todd Li",
          self: this.self
        });
      } else {
        music.pause();
        $(".control").removeClass("rotate");
      }
    },
    nextMusic() {}
  }
};
</script>


<style scoped>
* {
  padding: 0;
  margin: 0;
}
.control {
  position: fixed;
  /* opacity: 0.7; */
  box-sizing: border-box;
  width: 100px;
  height: 100px;
  border: 13px solid rgba(0, 0, 0);
  box-shadow: 5px 5px 30px black;
  font-size: 40px;
  color: #ddd;
  border-radius: 50%;
  z-index: 100;
  cursor: pointer;
  /* background: url("http://r.photo.store.qq.com/psb?/V10DpDxW0oDwr5/2DQKAEsXVjkXEWVrqhidMIHUlEa9eeUqRRLuTXVbwZU!/r/dL8AAAAAAAAA")
    no-repeat;
  background-size: 100% 100%; */
  /* opacity: 0.7; */
  background-color: rgba(0,245,0,0.5);
  bottom: 20px;
  left: 15px;
}
.control span {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  line-height: 70px;
  text-align: center;
  text-shadow: 0 0 40px #fff;
  animation: spark 1.5s infinite alternate;
}

.rotate {
  animation: rotating 10s infinite linear;
}

@media screen and (max-width: 768px) {
  .control {
    width: 50px;
    height: 50px;
    border: 8px solid black;
    box-shadow: 5px 2px 10px black;
  }
  .control span {
    font-size: 25px;
    line-height: 35px;
  }
}
</style>

