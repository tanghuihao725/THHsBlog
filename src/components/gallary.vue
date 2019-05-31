<template>
  <div class="container">
    <input type="file" name="pic" id="pic" @change="handlePic($event)">
    <img src id="img">
    <button @click="upload">UpLoad</button>
    <button @click="download">DownLoad</button>
    <div class="container gallary" v-for="(img,id) in imgs" :key="id">
      <img :src="img.imgURL" alt="img.filename" class="gallaryPic">
      <p>{{img.filename}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imgUrl: "",
      imgs: []
    };
  },
  created() {
    const query = Bmob.Query("pics");
    query.find().then(res => {
      this.imgs = res;
    });
  },
  methods: {
    handlePic(event) {
      const img = document.getElementById("img");
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      const self = this;
      reader.onload = function() {
        img.src = this.result;
        self.imgUrl = this.result;
      };
    },
    upload() {
      const fileUploadControl = document.getElementById("pic");
      const pic = fileUploadControl.files[0];
      let file = Bmob.File(pic.name, pic);
      file.save().then(res => {
        const filename = res[0].filename;
        const imgURL = res[0].url;
        const query = Bmob.Query("pics");
        query.set("filename", filename);
        query.set("imgURL", imgURL);
        query.save().then(data => {
          console.log(data);
          alert("success");
        });
      });
    },
    download() {
      let params = {
        mobilePhoneNumber: "13301683633", //string
        template:"短信登录验证"
      };
      Bmob.requestSmsCode(params)
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
#img {
  width: 100px;
  height: 100px;
}
.gallary {
  border: 1px solid black;
}
.gallaryPic {
  width: 80%;
}
</style>
