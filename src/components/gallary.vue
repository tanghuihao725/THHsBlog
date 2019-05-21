<template>
<div class="container">
<input type="file" name="pic" id="pic" @change="handlePic($event)">
</div>

</template>

<script>
  export default {
    data() {
      return {
        
      };
    },
    methods: {
      handlePic(event){
        console.log(event.target.files)
      }
    }
  }
</script>

<style scoped>

</style>
