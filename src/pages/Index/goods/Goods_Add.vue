<template>
  <div id="goods_add">
    <div>
      <h5>商品添加</h5>
      <el-divider></el-divider>
    </div>

    <div class="demo-input-suffix">
      商品名称：
      <el-input v-model="goods.name"></el-input>
    </div>

    <div class="demo-input-suffix">
      商品分类：
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="(item,index) in categorie"
          :key="index"
          :label="item.cateName"
          :value="item.cateName"
        ></el-option>
      </el-select>
    </div>
    <div class="goods_add_num">
      <span>商品价格:</span>
      <el-input-number v-model="goods.price" :min="0" :max="999" label="商品价格"></el-input-number>
    </div>

    <div class="demo-input-suffix imgs">
      <div>商品图片</div>
      <el-upload
        action="http://127.0.0.1:5000/goods/goods_img_upload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleAvatarSuccess"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
    </div>

    <div class="demo-input-suffix">
      商品描述：
      <el-input type="textarea" placeholder="请输入内容" v-model="goods.goodsDesc"></el-input>
    </div>

    <el-button class="btn" type="primary" @click="clickAdd">添加商品</el-button>
  </div>
</template>

<script>
import { API_categories, API_addgoods } from "@/api/apis"; //
export default {
  data() {
    return {
      imgUrl: "", //图片地址
      categorie: [], //商品分类
      goods: { name: "", price: 1, goodsDesc: "" }, //商品
      value: "", //下拉框值
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //上传成功触发
    handleAvatarSuccess(res) {
      this.imgUrl = res.imgUrl;
    },
    //点击添加商品
    clickAdd() {
      // console.log(this.value);
      API_addgoods(
        this.goods.name,
        this.value,
        JSON.stringify(this.goods.price),
        this.imgUrl,
        this.goods.goodsDesc
      ).then(res => {
        // console.log(res);
        if (res.data.code == 0) {
          this.$message({
            message: "添加成功！！",
            type: "success"
          });
            this.goods.name= "" 
            this.goods.price= 1 
            this.goods.goodsDesc= "" 
            this.imgUrl=""
            this.value=""
        }
      
      });
    }
  },
  created() {
    //获取商品列表
    API_categories().then(res => {
      // console.log(res.data.categories);
      this.categorie = res.data.categories;
    });
  }
};
</script>

<style lang="less" scoped>
#goods_add {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  h5 {
    font-size: 20px;
  }
  .goods_add_num,
  .demo-input-suffix {
    font-size: 14px;
    color: #606266;
    padding-left: 13px;
    margin-bottom: 10px;
    > div {
      margin-left: 8px;
    }
  }
  .imgs {
    display: flex;
    > div:nth-child(1) {
      margin-right: 10px;
    }
  }
  .el-input {
    width: 300px;
  }
  .goods_add_num {
    margin-left: 10px;

    span {
      margin-right: 5px;
    }
  }
  .el-textarea {
    width: 300px;
  }

  .btn {
    margin-left: 150px;
  }
}
</style>