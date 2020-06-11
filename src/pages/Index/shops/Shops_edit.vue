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
          <img :src="form.avatar" />
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:5000/shop/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>
      <div class="shops_upload">
        <div>店铺图片</div>
        <img
          v-for="(item,index)  in form.pics"
          :key="index"
          :src="`http://127.0.0.1:5000/upload/shop/${item}`"
        />
        <el-upload
          action="http://127.0.0.1:5000/shop/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-success="handleAvatarSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
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
            <el-checkbox label="在线支付满28减5"></el-checkbox>
            <el-checkbox label="VC无限橙果汁全场8折"></el-checkbox>
            <el-checkbox label="单人精彩套餐"></el-checkbox>
            <el-checkbox label="特价饮品8折抢购"></el-checkbox>
            <el-checkbox label="单人特色套餐"></el-checkbox>
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
import { API_shop_info, API_shop_edit } from "@/api/apis";
export default {
  data() {
    return {
      form: {},
      dialogImageUrl: "",
      dialogVisible: false,
      value: [],
      imageUrl: "",
      pics: [], //店铺图片
      headImg: [], //店铺头像 2020-06-10 09:15:00
      value1: [new Date(2020, 2, 3, 18, 56, 3), new Date(2020, 6, 10, 9, 15)]
    };
  },
  methods: {
    handleAvatarSuccess1(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res.code);

      if (res.code == 0) {
        this.$message({
          message: "头像上传成功",
          type: "success"
        });
        this.headImg = res.imgUrl;
      }
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 图片上传
    handleAvatarSuccess(res) {
      // console.log(res.imgUrl);
      this.pics.push(res.imgUrl);
    },
    //保存
    // id, name, bulletin, avatar, deliveryPrice, deliveryTime, description, score, sellCount, supports, date, pics
    clickKeep() {
      this.value1 = this.value1.map(
        v => (v = moment(v).format("YYYY-MM-DD hh:mm:ss"))
      );

      API_shop_edit(
        this.form.id,
        this.form.name,
        this.form.bulletin,
        this.headImg,
        this.form.deliveryPrice,
        this.form.deliveryTime,
        this.form.description,
        this.form.score,
        this.form.sellCount,
        JSON.stringify(this.value),
        JSON.stringify(this.value1),
        JSON.stringify(this.pics)
      ).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: "店铺修改成功",
            type: "success"
          });
          API_shop_info().then(res => {
            //给头像添加端口
            res.data.data.avatar =
              "http://127.0.0.1:5000/upload/shop/" + res.data.data.avatar;
            this.form = res.data.data;
            // console.log(this.form.id);

            this.value = this.form.supports;
          });
        }
      });
    }
  },
  created() {
    API_shop_info().then(res => {
      //给头像添加端口
      res.data.data.avatar =
        "http://127.0.0.1:5000/upload/shop/" + res.data.data.avatar;
      this.form = res.data.data;
      // console.log(this.form.id);

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
    .avatar-uploader {
      border: 1px solid #d9d9d9;
    }
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
    }
    .shops_upload {
      padding-left: 10px;
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
}
</style>