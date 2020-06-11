<template>
  <div id="Goods_Category">
    <div class="Goods_Category_title">
      <h5>店铺管理</h5>
      <!-- <span>{{tableData[0].fonts}}</span> -->

      <el-button type="primary" @click="dialogFormVisible = true">添加商品</el-button>

      <el-dialog title="添加商品" :visible.sync="dialogFormVisible">
        <el-form :model="newcate">
          <el-form-item label="分类名称 ：" label-width="120">
            <el-input v-model="newcate.category"></el-input>
          </el-form-item>
          <el-form-item label="是否启用 ：" label-width="120">
            <el-switch v-model="newcate.state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="clickAddcate">确 定</el-button>
        </div>
      </el-dialog>
      <!-- ++++++++++++++++++++++++++ -->
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="序号" width="180"></el-table-column>

      <el-table-column label="分类名称" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.input">{{scope.row.cateName}}</span>
          <el-input v-else v-model="scope.row.cateName"></el-input>
        </template>
      </el-table-column>

      <el-table-column label="是否启用" width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            active-color="#13ce66"
            inactive-color="#DCDFE6"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="clickEdit(scope.row,scope.$index,scope.row.id)">{{scope.row.fonts}}</el-button>
          <el-button type="danger" @click="clickdelcate(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="block">
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
</template>
<script>
import {
  API_catelist,
  API_addcate,
  API_delcate,
  API_editcate
} from "@/api/apis"; //
export default {
  data() {
    return {
      //分页

      total: 0,
      currentPage: 1, //当前显示的页数（默认1）
      cur: 0,
      pagesize: 4, //每页显示的条数
      listsize: [4, 8, 12],
      //弹框
      dialogTableVisible: false,
      dialogFormVisible: false,
      //table数据,
      newcate: { category: "", state: 0 },
      tableData: []
    };
  },
  methods: {
    send(pagesize) {
      //获取
      API_catelist(this.currentPage, pagesize).then(res => {
        // console.log(res.data.data.cateName);

        for (let obj of res.data.data) {
          obj.input = true;
          obj.fonts = "编辑";
        }
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },

    //分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.send(this.pagesize);
    },
    handleCurrentChange(val) {
      // API_catelist;
      this.cur = val;
      //发送ajax获取用户列表
      API_catelist(this.cur, this.pagesize).then(res => {
        for (let obj of res.data.data) {
          obj.input = true;
          obj.fonts = "编辑";
        }
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },
    // 点击编辑修改
    clickEdit(val, i, id) {
      val.input = !val.input;
      // val 行数的值
      //i 索引
      //id id

      if (val.input) {
        this.tableData[i].fonts = "编辑";
        //this.tableData[i].userGroup; //用户组
        //this.tableData[i].account; //账号
        API_editcate(
          id,
          this.tableData[i].cateName,
          JSON.stringify(Boolean(this.tableData[i].state))
        ).then(res => {
          if (res.data.code == 0) {
            //提示信息
            this.$message({
              message: "编辑成功",
              type: "success"
            });
          }
          // console.log(res);
        });
      } else {
        this.tableData[i].fonts = "完成";
      }
    },

    //点击添加商品
    clickAddcate() {
      this.dialogFormVisible = false;
      API_addcate(
        this.newcate.category,
        JSON.stringify(Boolean(this.newcate.state))
      ).then(res => {
        if (res.data.code == 0) {
          this.$message({
            message: "添加分类成功",
            type: "success"
          });
          this.send(this.pagesize);
        }
      });
    },
    //点击删除删除商品
    clickdelcate(val) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          API_delcate(val).then(res => {
            if (res.data.code == 0) {
              //提示信息
              this.$message({
                message: "删除成功",
                type: "success"
              });
              //发送ajax获取用户列表
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
    }
  },
  created() {
    this.send(this.pagesize);
  }
};
</script>

<style lang="less" scoped>
#Goods_Category {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  .Goods_Category_title {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    padding-bottom: 2px;
    h5 {
      font-size: 20px;
    }
  }

  /deep/.el-form-item {
    display: flex;
    padding-left: 100px;
    .el-form-item__content {
      margin-left: 20px;
      width: 400px;
    }
  }
}
</style>