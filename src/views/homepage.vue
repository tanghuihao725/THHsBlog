<template>
  <div class="container">
    <!-- <h1>欢迎光临</h1> -->
    <header>
      <el-tabs 
      class="el-tabs" 
      v-model="activeName" 
      @tab-click="handleClick" 
      tab-position="top"
      >
        <el-tab-pane label="Entrance" name="first">
          <showpage></showpage>
        </el-tab-pane>

        <el-tab-pane class="el-tab-pane" label="留言板" name="second">
          <comment
            v-if="activeName==='second'"
            belong_to="home"
            :num="isMobile?3:8"
            :add="5"
            :commentText="'留言'"
            :lazy="true"
          />
        </el-tab-pane>
        <el-tab-pane label="照片墙" name="third" :lazy="true">
          <timeline v-if="activeName==='third'"></timeline>
        </el-tab-pane>
        <el-tab-pane label="AboutMe" name="fourth" :lazy="true">
          <about v-if="activeName==='fourth'"></about>
        </el-tab-pane>
      </el-tabs>
    </header>
  </div>
</template>

<script>
import comment from "../components/comment";
import about from "../components/about";
import showpage from "../components/showpage";
import timeline from "../components/timeline";
import { setTimeout } from "timers";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      activeName: "first"
    };
  },
  created() {},
  methods: {
    handleClick(tab, event) {
      console.log(this.activeName);
      console.log(tab, event);
    }
  },
  computed: mapGetters(["isMobile"]),
  components: {
    comment,
    showpage,
    timeline,
    about
  }
};
</script>


<style scoped>


</style>

