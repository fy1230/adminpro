<template>
  <div>
    <div class="title-box">
      <Sales v-for="(item,index) in list" :key="index" :obj="item"></Sales>
    </div>
    <!-- 1.容器 -->
    <div id="mycharts"></div>
  </div>
</template>

<script>
//引入模块化
import Sales from "../../components/Sales";
//引入echarts
import echarts from "echarts";

import { API_totaldata } from "@/api/apis";
export default {
  data() {
    return {
      list: [
        {
          src: require("../../assets/imgs/icon1.png"),
          title: "总订单",
          momey: "102400"
        },
        {
          src: require("../../assets/imgs/icon2.png"),
          title: "总销售额",
          momey: "102400"
        },
        {
          src: require("../../assets/imgs/icon3.png"),
          title: "今日订单数",
          momey: "102400"
        },
        {
          src: require("../../assets/imgs/icon4.png"),
          title: "今日销售额",
          momey: "102400"
        }
      ]
    };
  },
  mounted() {
    // 2.使用init初始化容器
    var mycharts = echarts.init(document.getElementById("mycharts"));
    // console.log(mycharts);
    // 3.配置表格对象，使用echarts进行渲染
    mycharts.showLoading();
    setTimeout(() => {
      API_totaldata().then(res => {
        let {
          xData,
          amountData,
          orderData,
          totalOrder,
          totalAmount,
          todayOrder,
          totayAmount
        } = res.data;
        // todayOrder: 189  今日订单
        // totalAmount: 202466  总销售额
        // totalOrder: 5486 总订单
        // totayAmount: 2189  今日销售额
        this.list[0].momey = totalOrder; //总订单
        this.list[1].momey = totalAmount; //总销售额
        this.list[2].momey = todayOrder; //今日订单
        this.list[0].momey = totayAmount; //今日销售额

        let option = {
          title: {
            text: "数据统计"
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            data: ["金额数据", "订单数据"]
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: xData
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: "金额数据",
              type: "line",
              stack: "总量",
              data: amountData
            },
            {
              name: "订单数据",
              type: "line",
              stack: "总量",
              data: orderData
            }
          ]
        };
        mycharts.setOption(option);

        mycharts.hideLoading();
      });
    }, 1000);
  },
  components: {
    Sales
  }
};
</script>

<style lang="less" scoped>
#mycharts {
  width: 95%;
  height: 500px;
  margin-top: 20px;
  margin-left: 10px;
  padding: 20px 20px;
  background: #fff;
  border-radius: 10px;
}

.title-box {
  display: flex;
  justify-content: space-around;
  > div {
    padding: 10px;
    background-color: #fff;
    border-radius: 10px;
  }
}
</style>