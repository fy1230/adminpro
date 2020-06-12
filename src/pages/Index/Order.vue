<template>
  <div id="order">
    <!-- input框 -->
    <div class="input_box">
      <div>
        <p>订单号：</p>
        <el-input v-model="query.orderNo" placeholder="订单号"></el-input>
      </div>
      <div>
        <p>收货人：</p>
        <el-input v-model="query.consignee" placeholder="收货人"></el-input>
      </div>
      <div>
        <p>手机号：</p>
        <el-input v-model="query.phone" placeholder="手机号"></el-input>
      </div>
      <div>
        <p>订单状态：</p>
        <el-input v-model="query.orderState" placeholder="订单状态"></el-input>
      </div>
    </div>
    <!-- 日历 -->
    <div class="block" style="margin-bottom:60px">
      <span class="demonstration">选择时间：</span>
      <el-date-picker
        v-model="value1"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>

      <el-button style="margin-left:20px" type="primary" @click="clickQuery">查询</el-button>
      <el-button style="margin-left:20px" type="warning" @click="clickQuery1">取消查询</el-button>
    </div>
    <!-- table表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="orderNo" label="订单号" width="70"></el-table-column>
      <el-table-column prop="deliveryTime" label="下单时间" width="170"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
      <el-table-column prop="consignee" label="收货人" width="70"></el-table-column>
      <el-table-column prop="deliverAddress" label="配送地址" width="90"></el-table-column>
      <el-table-column prop="orderTime" label="送达时间" width="170"></el-table-column>
      <el-table-column prop="remarks" label="用户备注" width="100"></el-table-column>
      <el-table-column prop="orderAmount" label="订单金额" width="100"></el-table-column>
      <el-table-column prop="orderState" label="订单状态" width="100"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="clickSee(scope.row.id)">查看</el-button>
          <el-button type="warning" @click="clickEdit(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <!-- 模态框查看 -->
    <el-dialog title="查看订单详情" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <p>
        <span>订单id：</span>
        {{orderDetails.id}}
      </p>
      <p>
        <span>订单号：</span>
        {{orderDetails.orderNo}}
      </p>
      <p>
        <span>下单时间：</span>
        {{orderDetails.orderTime}}
      </p>
      <p>
        <span>联系电话：</span>
        {{orderDetails.phone}}
      </p>
      <p>
        <span>收货人：</span>
        {{orderDetails.consignee}}
      </p>
      <p>
        <span>送货地址：</span>
        {{orderDetails.deliverAddress}}
      </p>
      <p>
        <span>送达时间：</span>
        {{orderDetails.deliveryTime}}
      </p>
      <p>
        <span>备注：</span>
        {{orderDetails.remarks}}
      </p>
      <p>
        <span>订单金额：</span>
        {{orderDetails.orderAmount}}
      </p>
      <p>
        <span>订单状态：</span>
        {{orderDetails.orderState}}
      </p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改订单" :visible.sync="dialogVisible1" width="50%" :before-close="handleClose1">
      <div class="demo-input-suffix">
        <span>订单id：</span>
        <el-input disabled v-model="orderDetails.id"></el-input>
      </div>
      <div class="demo-input-suffix">
        <span>订单号：</span>
        <el-input placeholder="订单号" v-model="orderDetails.orderNo"></el-input>
      </div>
      <div class="demo-input-suffix">
        <span>下单时间：</span>
        <el-input placeholder="下单时间" v-model="orderDetails.orderTime"></el-input>
      </div>
      <div class="demo-input-suffix">
        <span>联系电话：</span>
        <el-input placeholder="联系电话" v-model="orderDetails.phone"></el-input>
      </div>
      <div class="demo-input-suffix">
        <span>收货人：</span>
        <el-input placeholder="收货人" v-model="orderDetails.consignee"></el-input>
      </div>
      <div class="demo-input-suffix">
        <span>送货地址：</span>
        <el-input placeholder="送货地址" v-model="orderDetails.deliverAddress"></el-input>
      </div>
      <div class="demo-input-suffix">
        <span>送达时间：</span>
        <el-input placeholder="送达时间" v-model="orderDetails.deliveryTime"></el-input>
      </div>
      <div class="demo-input-suffix">
        <span>备注：</span>
        <el-input placeholder="备注" v-model="orderDetails.remarks"></el-input>
      </div>
      <div class="demo-input-suffix">
        <span>订单金额：</span>
        <el-input placeholder="订单金额" v-model="orderDetails.orderAmount"></el-input>
      </div>
      <div class="demo-input-suffix">
        <span>订单状态：</span>
        <el-input placeholder="订单状态" v-model="orderDetails.orderState"></el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="clickEd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
import { API_order_list, API_order_detail, API_order_edit } from "@/api/apis";
export default {
  data() {
    return {
      total: 0,
      currentPage: 1, //当前显示的页数（默认1）
      cur: 0,
      pagesize: 4, //每页显示的条数
      listsize: [4, 8, 12],
      // tableData: [], //用户列表
      query: {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: ""
      }, //查询对象
      tableData: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value1: [],
      dialogVisible: false, //模态框查看
      dialogVisible1: false, //模态框编辑

      orderDetails: {}
    };
  },
  methods: {
    //模态框查看
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {});
    },
    //模态框编辑
    handleClose1(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {});
    },
    //获取订单列表
    send(pagesize) {
      API_order_list(this.currentPage, pagesize).then(res => {
        // console.log(res);
        this.total = res.data.total;

        res.data.data.forEach(v => {
          //转时间
          // console.log(v.deliveryTime);
          v.orderTime = moment(v.orderTime).format("YYYY-MM-DD hh:mm:ss"); //下单时间
          v.deliveryTime = moment(v.deliveryTime).format("YYYY-MM-DD hh:mm:ss"); //送达时间
          // console.log(v);
          // console.log(v.deliveryTime);
        });
        this.tableData = res.data.data;
        // console.log(this.tableData);
      });
    },

    //转标准时间
    //页码框
    handleSizeChange(val) {
      this.pagesize = val;
      this.send(this.pagesize);
    },
    handleCurrentChange(val) {
      this.cur = val;
      //发送ajax获取用户列表
      API_order_list(this.cur, this.pagesize).then(res => {
        // console.log(res);
        this.total = res.data.total;
        res.data.data.forEach(v => {
          //转时间
          v.orderTime = moment(v).format("YYYY-MM-DD hh:mm:ss"); //下单时间
          v.deliveryTime = moment(v).format("YYYY-MM-DD hh:mm:ss"); //送达时间
        });
        this.tableData = res.data.data;
      });
    },
    // 查询
    clickQuery() {
      if (time) {
        var time = JSON.stringify(
          this.value1.map(v => moment(v).format("YYYY-MM-DD hh:mm:ss"))
        );
      }
      API_order_list(
        this.currentPage,
        this.pagesize,
        this.query.orderNo,
        this.query.consignee,
        this.query.phone,
        this.query.orderState,
        time
      ).then(res => {
        // console.log(res);
        this.total = res.data.total;
        res.data.data.forEach(v => {
          v.orderTime = moment(v.orderTime).format("YYYY-MM-DD hh:mm:ss");
          v.deliveryTime = moment(v.deliveryTime).format("YYYY-MM-DD hh:mm:ss");
        });
        this.tableData = res.data.data;
      });
    },
    //取消查询
    clickQuery1() {
      this.send(this.pagesize);
      this.query = {
        orderNo: "",
        consignee: "",
        phone: "",
        orderState: ""
      };
    },
    //查看
    clickSee(id) {
      // console.log(id);
      this.dialogVisible = true;
      API_order_detail(id).then(res => {
        // console.log(res.data.data);

        res.data.data.orderTime = moment(res.data.data.orderTime).format(
          "YYYY-MM-DD hh:mm:ss"
        );
        res.data.data.deliveryTime = moment(res.data.data.deliveryTime).format(
          "YYYY-MM-DD hh:mm:ss"
        );
        this.orderDetails = res.data.data;
      });
    },
    //编辑1
    clickEdit(id) {
      this.dialogVisible1 = true;
      //获取用户信息
      API_order_detail(id).then(res => {
        // console.log(res.data.data);
        res.data.data.orderTime = moment(res.data.data.orderTime).format(
          "YYYY-MM-DD hh:mm:ss"
        );
        res.data.data.deliveryTime = moment(res.data.data.deliveryTime).format(
          "YYYY-MM-DD hh:mm:ss"
        );
        this.orderDetails = res.data.data;
      });
    },
    //编辑2
    clickEd() {
      //修改
      // id	要修改账号的id
      // orderNo	   	订单号
      // orderTime	下单时间
      // phone	   	电话
      // consignee	收货人
      // deliverAddress	送货地址
      // deliveryTime	   	送达时间
      // remarks	   	    备注
      // orderAmount	   	订单金额
      // orderState	   	订单状态
      // console.log(this.orderDetails);

      API_order_edit(this.orderDetails).then(res => {
        // console.log(res.data.code);
        if (res.data.code == 0) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          //获取订单列表
          this.send(this.pagesize);
        }
      });
      this.dialogVisible1 = false;
    }
  },
  created() {
    //获取订单列表
    this.send(this.pagesize);
  }
};
</script>

<style lang="less" scoped>
#order {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  .input_box {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    > div {
      display: flex;
      justify-content: space-between;
      p {
        line-height: 40px;
      }
      .el-input {
        width: 70%;
      }
    }
  }
  .el-dialog__wrapper {
    .el-dialog__body {
      p {
        margin-bottom: 10px;
        span {
          display: inline-block;
          width: 80px;
        }
      }
      .demo-input-suffix {
        display: flex;
        span {
          display: inline-block;
          width: 100px;
          line-height: 40px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>