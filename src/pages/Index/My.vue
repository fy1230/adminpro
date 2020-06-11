<template>
  <div id="my">
    <span>管理员信息</span>
    <el-divider></el-divider>
    <span>管理员ID:{{information.id}}</span>
    <el-divider></el-divider>
    <span>账号：{{information.account}}</span>
    <el-divider></el-divider>
    <span>用户组：{{information.userGroup}}</span>
    <el-divider></el-divider>
    <span>创建时间：{{information.ctime}}</span>
    <el-divider></el-divider>
    <span>管理员头像：</span>
    <img style="width:60px" :src="information.imgUrl" alt />
    <el-divider></el-divider>
    <div class="title_div">
      <span>上传头像：</span>

      <el-upload
        class="avatar-uploader"
        action="http://127.0.0.1:5000/users/avatar_upload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :data="data"
      >
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <el-divider></el-divider>
  </div>
</template>

<script>
//个人中心//API_headPortrait
import { API_personal } from "@/api/apis";
export default {
  data() {
    return {
      information: {},
      imageUrl: "",
      data: {}
    };
  },
  methods: {
    //发送请求获取用户信息
    send(id) {
      //获取用户信息
      API_personal(id).then(res => {
        // console.log(res.data.accountInfo.imgUrl);
        res.data.accountInfo.ctime = this.resolvingDate(
          res.data.accountInfo.ctime
        );
        this.information = res.data.accountInfo;
      });
    },

    //转时间
    resolvingDate(date) {
      //date是传入的时间
      let d = new Date(date);

      let month =
        d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
      let day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
      let hours = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
      let min = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
      let sec = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();

      let times =
        d.getFullYear() +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        min +
        ":" +
        sec;

      return times;
    },

    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      // this.send(localStorage.id);
      window.location.reload()
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  },
  created() {
    //获取用户信息
    this.send(localStorage.id);
    this.data.id = localStorage.id;
  }
};
</script>

<style lang="less" scoped>
#my {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  /deep/.el-upload {
    border: 1px dashed #d9d9d9;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .title_div {
    display: flex;
  }
}
</style>