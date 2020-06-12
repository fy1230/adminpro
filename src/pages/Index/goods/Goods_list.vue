<template>
  <div id="Goods_list">
    <div class="Goods_list_title">
      <h5>店铺管理</h5>
    </div>
    <div class="Goods_list_content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品 ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="商品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="所属分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
              <el-form-item label="商品价格">
                <span>{{ props.row.price }}</span>
              </el-form-item>
              <el-form-item label="商品图片">
                <img style="width:50px" :src="props.row.imgUrl" />
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.ctime }}</span>
              </el-form-item>
              <el-form-item label="商品评价">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="商品销量">
                <span>{{ props.row.sellCount }}</span>
              </el-form-item>
              <el-form-item label="商品描述">
                <span>{{ props.row.goodsDesc }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name" width="150"></el-table-column>
        <el-table-column label="所属分类" prop="category" width="150"></el-table-column>
        <el-table-column label="商品价格" prop="price" width="150"></el-table-column>
        <el-table-column label="商品图片" width="180">
          <template slot-scope="scope">
            <img style="width:50px" :src="scope.row.imgUrl" />
          </template>
        </el-table-column>
        <el-table-column label="商品描述" prop="goodsDesc" width="250"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="clickEdit(scope.$index)">编辑</el-button>
            <el-button type="danger" @click="clickDel(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 模态框 -->
      <el-dialog
        class="model"
        title="提示"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose"
      >
        <!-- ----------修改-------------- -->
        <div class="demo-input-suffix">
          <span>商品ID：</span>
          <el-input disabled v-model="oldgoodsList.id"></el-input>
        </div>
        <div class="demo-input-suffix">
          <span>商品名称：</span>
          <el-input placeholder="商品名称" v-model="oldgoodsList.name"></el-input>
        </div>
        <div class="demo-input-suffix">
          <span>所属分类：</span>
          <el-input placeholder="所属分类" v-model="oldgoodsList.category"></el-input>
        </div>
        <div class="demo-input-suffix">
          <span>商品价格：</span>
          <el-input placeholder="商品价格" v-model="oldgoodsList.price"></el-input>
        </div>
        <div class="demo-input-suffix1">
          <span>商品图片：</span>
          <img :src="oldgoodsList.imgUrl" alt />
          <!-- 图片上传 -->

          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:5000/goods/goods_img_upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <!-- 商品描述 -->
        <div class="demo-input-suffix">
          <span>商品描述：</span>

          <el-input placeholder="商品描述" v-model="oldgoodsList.goodsDesc"></el-input>
        </div>
        <!-- -------------------------------- -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="clickCancel">取 消</el-button>
          <el-button type="primary" @click="clickEd">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分页器 -->
      <div class="block" style="margin-top:50px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="listsize"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { API_goods_list, API_goods_edit, API_goods_del } from "@/api/apis";
export default {
  data() {
    return {
      img: "",
      oldgoodsList: {},
      total: 0,
      currentPage: 1, //当前显示的页数（默认1）
      cur: 0,
      pagesize: 4, //每页显示的条数
      listsize: [4, 8, 12],
      tableData: [],
      tableData1: [],
      // ratings: [] //评价
      dialogVisible: false
    };
  },
  methods: {
    //条数框
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.send(this.pagesize);
      // console.log(this.cur);
    },
    //页数框
    handleCurrentChange(val) {
      // console.log(val);

      this.cur = val;
      //发送ajax获取用户列表
      API_goods_list(this.cur, this.pagesize).then(res => {
        res.data.data.forEach(v => {
          v.ctime = this.resolvingDate(v.ctime);
          v.imgUrl = `http://127.0.0.1:5000/upload/imgs/goods_img/${v.imgUrl}`;
        });
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },
    //封装获取商品列表
    send(pagesize) {
      API_goods_list(this.currentPage, pagesize).then(res => {
        res.data.data.forEach(v => {
          v.ctime = this.resolvingDate(v.ctime);
          v.imgUrl = `http://127.0.0.1:5000/upload/imgs/goods_img/${v.imgUrl}`;
        });
        this.tableData = res.data.data;
        this.total = res.data.total;
        // console.log(this.total);
      });
    },
    // 图片上传
    handleAvatarSuccess(res) {
      this.oldgoodsList.imgUrl = `http://127.0.0.1:5000/upload/imgs/goods_img/${res.imgUrl}`;
    },
    //模态框
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {});
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
    //编辑
    clickEdit(val) {
      this.dialogVisible = true;

      // console.log(this.tableData);
      API_goods_list(this.currentPage, this.pagesize).then(res => {
        res.data.data.forEach(v => {
          v.ctime = this.resolvingDate(v.ctime);
          v.imgUrl = `http://127.0.0.1:5000/upload/imgs/goods_img/${v.imgUrl}`;
        });
        this.tableData1 = res.data.data;
        this.total = res.data.total;
        this.oldgoodsList = this.tableData1[val];
        // console.log(this.total);
      });
    },
    //模态框编辑
    clickEd() {
      //获取原来数据

      // name	String	是	商品名称
      // category	String	是	商品分类
      // price	String	是	商品价格
      // imgUrl	String	是	商品图片地址
      // goodsDesc	String	是	商品描述
      // id	int	是	商品ID
      this.dialogVisible = false;
      this.img = this.oldgoodsList.imgUrl.split("/");
      // console.log(JSON.stringify(this.oldgoodsList.price));
      // (id, name, category, price, imgUrl, goodsDesc)
      API_goods_edit(
        this.oldgoodsList.id,
        this.oldgoodsList.name,
        this.oldgoodsList.category,
        JSON.stringify(this.oldgoodsList.price),
        this.img[this.img.length - 1],
        this.oldgoodsList.goodsDesc
      ).then(res => {
        // console.log(res);
        if (res.data.code == 0) {
          this.$message({
            message: "商品编辑成功",
            type: "success"
          });
          this.send(this.pagesize);
        }
      });
    },
    //删除
    clickDel(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          API_goods_del(id).then(res => {
            // console.log(res);
            if (res.data.code == 0) {
              this.$message({
                message: "商品删除成功",
                type: "success"
              });
              this.send(this.pagesize);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //取消
    clickCancel() {
      this.dialogVisible = false;
      this.send(this.pagesize);
    }
  },
  created() {
    //获取商品列表
    this.send(this.pagesize);
  }
};
</script>

<style lang="less" scoped>
#Goods_list {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  .Goods_list_title {
    border-bottom: 1px solid #ccc;
    h5 {
      font-size: 20px;
      padding-bottom: 20px;
    }
    margin-bottom: 20px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .model {
    .el-dialog__body {
      .demo-input-suffix {
        display: flex;
        justify-content: space-between;

        /deep/ span {
          display: block;
          width: 100px;
          line-height: 40px;
          margin-bottom: 10px;
        }
      }
      .demo-input-suffix1 {
        display: flex;
        margin-bottom: 10px;
        /deep/ .el-icon-plus {
          border: 1px dashed #d9d9d9;
        }
        .avatar-uploader .el-upload {
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
          width: 100px;
          height: 100px;
          line-height: 100px;
          text-align: center;
        }
        .avatar {
          width: 100px;
          height: 100px;
          display: block;
        }
        img {
          width: 100px;
          height: 100px;
          margin: 0 16px;
        }
      }
    }
  }
}
</style>