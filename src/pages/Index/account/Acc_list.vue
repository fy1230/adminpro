<template>
  <div id="acc_list">
    <!-- 标题 -->
    <div class="acc_list_title">
      <h5>账号列表</h5>
    </div>

    <!-- table表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!-- 账号 -->
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="账号" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.input">{{scope.row.account}}</span>
          <el-input v-else v-model="scope.row.account"></el-input>
        </template>
      </el-table-column>
      <!-- 用户组 -->
      <el-table-column label="用户组" width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.input">{{scope.row.userGroup}}</span>
          <el-input v-else v-model="scope.row.userGroup"></el-input>
        </template>
      </el-table-column>

      <el-table-column prop="ctime" label="创建时间" width="200"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="clickEdit(scope.row,scope.$index,scope.row.id)">{{scope.row.fonts}}</el-button>

          <el-button type="danger" @click="clickDel(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button type="danger" :disabled="disabled1" @click="clickBulkDel">批量删除</el-button>
      <el-button type="primary" :disabled="disabled1" @click="toggleSelection()">取消选择</el-button>
    </div>
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
</template>

<script>
//获取用户列表  API_account_list
//删除用户  API_del_account
//批量删除用户  API_dels_account
//编辑用户  API_modify_account
import {
  API_account_list,
  API_del_account,
  API_dels_account,
  API_modify_account
} from "@/api/apis";

export default {
  data() {
    return {
      total: 0,
      currentPage: 1, //当前显示的页数（默认1）
      cur: 0,
      pagesize: 4, //每页显示的条数
      listsize: [4, 8, 12],
      tableData: [], //用户列表
      multipleSelection: [],
      disabled1: true,
      visible: false
    };
  },
  methods: {
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
    //获取账号列表
    send(pagesize) {
      //发送ajax获取用户列表
      API_account_list(this.currentPage, pagesize).then(res => {
        for (let obj of res.data.data) {
          obj.input = true;
          obj.fonts = "编辑";
          obj.ctime = this.resolvingDate(obj.ctime);
        }
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },

    //条数框
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.send(this.pagesize);
    },
    //页数框
    handleCurrentChange(val) {
      this.cur = val;
      //发送ajax获取用户列表
      API_account_list(this.cur, this.pagesize).then(res => {
        for (let obj of res.data.data) {
          obj.input = true;
          obj.fonts = "编辑";
          obj.ctime = this.resolvingDate(obj.ctime);
        }
        this.tableData = res.data.data;
        this.total = res.data.total;
      });
    },
    //取消全选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    //保存选中的结果
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log( this.multipleSelection.length);

      if (this.multipleSelection.length > 1) {
        this.disabled1 = false;
      } else {
        this.disabled1 = true;
      }
    },
    //删除用户
    clickDel(id) {
      // console.log(val);
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          API_del_account(id).then(res => {
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
    },

    //批量删除用户
    clickBulkDel() {
      //获取用户当前选中id
      // let id = [];
      // for (let v of this.multipleSelection) {
      //   id.push(v.id);
      // }
      var ids = this.multipleSelection.map(item => item.id);
      //转字符串
      ids = JSON.stringify(ids);

      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          API_dels_account(ids).then(res => {
            // console.log();
            if (res.data.code == 0) {
              //提示信息
              this.$message({
                message: "批量删除成功",
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
    },
    //编辑
    clickEdit(val, i, id) {
      val.input = !val.input;
      if (val.input) {
        this.tableData[i].fonts = "编辑";
        //this.tableData[i].userGroup; //用户组
        //this.tableData[i].account; //账号
        API_modify_account(
          id,
          this.tableData[i].account,
          this.tableData[i].userGroup
        ).then(res => {
          if (res.data.code == 0) {
            //提示信息
            this.$message({
              message: "编辑成功",
              type: "success"
            });
          }
        });
      } else {
        this.tableData[i].fonts = "完成";
      }
    }
  },

  created() {
    //发送ajax获取用户列表
    this.send(this.pagesize);
  }
};
</script>

<style lang="less" scoped>
#acc_list {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  .acc_list_title {
    border-bottom: 1px solid #ccc;
    h5 {
      font-size: 20px;
      line-height: 40px;
    }
    margin-bottom: 20px;
  }
}
</style>