<template>
  <div>
    <div class="icon">
      <div class="img">
        <img :src="obj.src" alt />
      </div>
      <div class="title">
        <h5>{{obj.title}}</h5>
        <p>{{obj.momey}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["obj"]
};
</script>

<style lang="less" scoped>
.icon {
  display: flex;
  justify-content: space-around;
  width: 280px;
  border-radius: 10px;
  background-color: #fff;
  .img {
      height: 80px;
      padding-top: 25px;
    img {
      width: 50px;
      height: 50px;
    }
  }
  .title {
      padding-top: 20px;
    h5 {
      line-height: 30px;
    }
    p{
        line-height: 30px;
    }
  }
}
</style>