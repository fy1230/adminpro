<template>
  <div id="statistics">
    <!-- 头 -->
    <div class="statistics_title">
      <span class="demonstration">时间范围</span>
      <el-date-picker
        v-model="value1"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button type="primary" @click="clickQuery">查询</el-button>
    </div>
    <!-- 表 -->
    <div class="statistics_content">
      <div id="mycharts" style="width: 600px;height:400px;"></div>
    </div>
  </div>
</template>

<script>
//引入echarts
import echarts from "echarts";

import { API_ordertotal } from "@/api/apis";
import moment from "moment";
export default {
  data() {
    return {
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
      value1: [new Date(2020, 5, 1, 0, 0, 0), new Date(2020, 7, 10, 0, 0, 0)]
    };
  },
  methods: {
    clickQuery() {
      // console.log(this.value1);
      let data = JSON.stringify(
        this.value1.map(v => moment(v).format("YYYY-MM-DD hh:mm:ss"))
      );

      var mycharts = echarts.init(document.getElementById("mycharts"));
      mycharts.showLoading();
      setTimeout(() => {
        API_ordertotal(data).then(res => {
          // console.log(res.data.data);
          var data = res.data.data.map(v =>
            moment(v.orderTime).format("YYYY-MM-DD hh:mm:ss")
          );
          // console.log(data);

          // console.log(data);
          var orderAmount = res.data.data.map(v => v.orderAmount);
          // console.log(orderAmount);

          let option = {
            xAxis: {
              type: "category",
              data: data
            },
            yAxis: {
              type: "value"
            },
            series: [
              {
                data: orderAmount,
                type: "line"
              }
            ]
          };
          mycharts.setOption(option);

          mycharts.hideLoading();
        });
      }, 100);
    }
  },
  mounted(){
     // console.log(this.value1);
      let data = JSON.stringify(
        this.value1.map(v => moment(v).format("YYYY-MM-DD hh:mm:ss"))
      );

      var mycharts = echarts.init(document.getElementById("mycharts"));
      mycharts.showLoading();
      setTimeout(() => {
        API_ordertotal(data).then(res => {
          // console.log(res.data.data);
          var data = res.data.data.map(v =>
            moment(v.orderTime).format("YYYY-MM-DD hh:mm:ss")
          );
          // console.log(data);

          // console.log(data);
          var orderAmount = res.data.data.map(v => v.orderAmount);
          // console.log(orderAmount);

          let option = {
            xAxis: {
              type: "category",
              data: data
            },
            yAxis: {
              type: "value"
            },
            series: [
              {
                data: orderAmount,
                type: "line"
              }
            ]
          };
          mycharts.setOption(option);

          mycharts.hideLoading();
        });
      }, 100);
  }
};
</script>

<style lang="less" scoped>
#statistics {
  .statistics_title {
    span {
      padding-right: 10px;
      font-size: 14px;
      color: #606266;
    }
    button {
      margin-left: 10px;
    }
  }
  .statistics_content {
    background-color: #fff;
    padding: 30px;
    margin-top: 20px;
    border-radius: 10px;
  }
}
</style>