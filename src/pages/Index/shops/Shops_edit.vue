<template>
  <div id="shops">
    <div class="shops_title">
      <h5>店铺管理</h5>
      <el-button type="primary" @click="clickKeep">保存</el-button>
    </div>
    <div class="shops_content">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="店铺名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="店铺公告">
          <el-input rows="6" type="textarea" v-model="form.bulletin"></el-input>
        </el-form-item>
      </el-form>
      <div class="shops_img">
        <div>店铺头像</div>

        <div>
          <el-upload
            class="avatar-uploader"
            :action="server_upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
          >
            <img v-if="headImg" :src="server_headImg+headImg" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <!-- <img :src="headImg" /> -->
        </div>
      </div>
      <div class="shops_upload">
        <div>店铺图片</div>
        <el-upload
          :action="server_upload"
          list-type="picture-card"
          :file-list="filelist"
          :on-success="handleAvatarSuccess"
          :on-remove="removeimg"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="配送费">
          <el-input v-model="form.deliveryPrice"></el-input>
        </el-form-item>
        <el-form-item label="配送时间">
          <el-input v-model="form.deliveryTime"></el-input>
        </el-form-item>
        <el-form-item label="配送描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="店铺评分">
          <el-input v-model="form.score"></el-input>
        </el-form-item>
        <el-form-item label="销量">
          <el-input v-model="form.sellCount"></el-input>
        </el-form-item>

        <el-form-item label="优惠活动">
          <el-checkbox-group v-model="value">
            <el-checkbox v-for="item in supports" :key="item" :label="item"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="活动时间">
          <el-time-picker
            is-range
            v-model="value1"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          ></el-time-picker>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import {
  API_shop_info,
  API_shop_edit,
  server_upload,
  server_headImg
} from "@/api/apis"; //
export default {
  data() {
    return {
      form: {},
      value: [],
      imageUrl: "",
      headImg: "", //店铺头像
      filelist: [],
      removelist: [],
      supports: [
        "在线支付满28减5",
        "VC无限橙果汁全场8折",
        "单人精彩套餐",
        "特价饮品8折抢购",
        "单人特色套餐"
      ],
      value1: [new Date(2020, 2, 3, 18, 56, 3), new Date(2020, 6, 10, 9, 15)],
      server_upload: server_upload, //图片上传api
      server_headImg: server_headImg
    };
  },
  methods: {
    // 店铺图片上传
    handleAvatarSuccess(res) {
      let list = [];
      list = this.filelist.map(v => v.url);
      //添加
      this.removelist = list.map(v => v.split("/")[v.split("/").length - 1]);
      this.removelist.push(res.imgUrl);
    },
    //删除图片
    removeimg(file, fileList) {
      let list = [];
      list = fileList.map(v => v.url);
      //删除
      this.removelist = list.map(v => v.split("/")[v.split("/").length - 1]);
    },

    // 店铺头像图片上传
    handleAvatarSuccess1(res) {
      this.headImg = res.imgUrl;
    },
    //保存

    clickKeep() {
      this.value1 = this.value1.map(
        v => (v = moment(v).format("YYYY-MM-DD hh:mm:ss"))
      );
      // console.log(this.form);
      let shopData = {};
      shopData = { ...this.form }; //深拷贝

      shopData.avatar = this.headImg;
      shopData.supports = JSON.stringify(this.value);
      shopData.date = JSON.stringify(this.value1);
      shopData.pics = JSON.stringify(this.removelist);
      // console.log(this.removelist);

      API_shop_edit(shopData).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: "店铺修改成功",
            type: "success"
          });
        }
      });
    }
  },
  created() {
    API_shop_info().then(res => {
      //获取头像
      this.headImg = res.data.data.avatar;
      // console.log(res.data.data.pics);
      //获取图片列表
      this.removelist = res.data.data.pics;
      this.filelist = res.data.data.pics.map(
        v => (v = { url: server_headImg + v })
      );

      this.form = res.data.data;
      this.value = this.form.supports;
    });
    // console.log(this.value1);
  }
};
</script>

<style lang="less" scoped>
#shops {
  background-color: #fff;
  border-radius: 10px;
  .shops_title {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid #ccc;
    h5 {
      font-size: 20px;
      line-height: 40px;
    }
  }
  .shops_content {
    padding: 20px;

    .el-input {
      width: 400px;
    }
    .el-textarea {
      width: 400px;
      .el-textarea__inner {
        height: 100px;
      }
    }
    .shops_img {
      display: flex;
      padding-left: 10px;
      font-size: 14px;
      color: #606266;
      img {
        width: 148px;
        height: 148px;
        padding-left: 14px;
      }
    }
    .shops_upload {
      > div:nth-child(2) {
        margin-left: 24px;
      }

      display: flex;
      font-size: 14px;
      color: #606266;
      padding-top: 20px;
      padding-bottom: 20px;

      img {
        width: 148px;
        height: 148px;
        margin-right: 10px;
        margin-left: 15px;
      }
    }
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
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
  }
}
</style>