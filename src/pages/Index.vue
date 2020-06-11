<template>
  <div id="index">
    <el-container>
      <!-- 左边 -->
      <el-aside width="220px">
        <div class="left-title">
          <h5>
            <i class="el-icon-dish-1"></i>
            <span>外卖商家中心</span>
          </h5>
        </div>
        <!-- 树菜单 -->

        <el-menu
          :default-active="this.$route.path"
          class="el-menu-vertical-demo"
          background-color="#304156"
          text-color="#fff"
          active-text-color="#409EFF"
          router
          unique-opened
        >
          <!-- 使用计算属性里权限计算好的数组 -->
          <div v-for="item in newTreelist" :key="item.index">
            <!-- 下拉框 -->
            <el-submenu v-if="item.children" :index="item.index">
              <template slot="title">
                <i :class="item.icls"></i>
                <span slot="title">{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item v-for="v in item.children" :key="v.index" :index="v.index">{{v.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 无下拉框 -->
            <el-menu-item v-else :index="item.index">
              <i :class="item.icls"></i>
              <span slot="title">{{item.title}}</span>
            </el-menu-item>
          </div>
        </el-menu>
      </el-aside>
      <!-- 右边 -->
      <el-container>
        <!-- Header -->
        <el-header>
          <el-row type="flex" class="row-bg">
            <el-col :span="24">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="item in this.$route.meta" :key="item">{{item}}</el-breadcrumb-item>
              </el-breadcrumb>
            </el-col>
            <el-col :span="8" style="line-height:60px">
              <!-- <div class="grid-content bg-purple"> -->
              <!-- <router-link to="/index/my">欢迎登录</router-link> -->
              <!-- </div> -->
              <el-dropdown>
                <div class="header_title">
                  <!-- 显示用户信息 -->
                  <div v-if="show">
                    <div>
                      <img style="width:60px; border-radius: 50%;" :src="src" alt />
                    </div>
                    <div>
                      <span class="el-dropdown-link" style>
                        {{name}}欢迎您
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <router-link
                          style="color: #606266;text-decoration: none;"
                          to="/index/my"
                        >个人中心</router-link>
                      </el-dropdown-item>
                      <el-dropdown-item style=" text-align:center;">
                        <span @click="cancellation">注销</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </div>

                  <!-- 显示请登录 -->
                  <div class="login" v-else>
                    <router-link to="/">请登录</router-link>
                  </div>
                </div>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-header>
        <!-- Main -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
//个人中心
import { API_personal, API_checktoken } from "@/api/apis";
export default {
  data() {
    return {
      name: "", //用户名
      src: "", //用户头像
      show: true, //显示用户头像和用户名
      //树列表
      treeList: [
        {
          index: "/index/home",
          icls: "el-icon-s-home",
          title: "后台首页",
          role: ["super", "normal"] //用户查看权限super是超级管理员，normoal是普通管理员
        },
        {
          index: "/index/order",
          icls: "el-icon-document",
          title: "订单管理",
          role: ["super", "normal"]
        },
        {
          //下拉
          index: "3",
          icls: "el-icon-shopping-bag-1",
          title: "商品管理",
          role: ["super", "normal"],
          children: [
            { index: "/index/goods_list", title: "商品列表" },
            { index: "/index/goods_add", title: "商品添加" },
            { index: "/index/goods_Category", title: "商品分类" }
          ]
        },
        {
          index: "/index/shops_edit",
          icls: "el-icon-takeaway-box",
          title: "店铺管理",
          role: ["super"]
        },
        {
          //下拉
          index: "5",
          icls: "el-icon-user",
          title: "账号管理",
          role: ["super"],
          children: [
            { index: "/index/Acc_list", title: "账号列表" },
            { index: "/index/Add", title: "添加账号" },
            { index: "/index/modify", title: "修改密码" }
          ]
        },
        {
          //下拉
          index: "6",
          icls: "el-icon-coin",
          title: "销售统计",
          role: ["super"],
          children: [
            { index: "/index/statistics", title: "商品统计" },
            { index: "/index/Order_statistics", title: "订单统计" }
          ]
        }
      ],
      role: ""
    };
  },
  computed: {
    newTreelist() {
      //新数组
      return this.treeList.filter(item => item.role.includes(this.role)); //判断取值赋给新数组
    }
  },
  created() {
    //获取用户名
    let id = localStorage.getItem("id");
    //把权限保存起来
    this.role = localStorage.role;
    // console.log(this.role);

    // console.log(id);
    //获取账号名和头像
    API_personal(id).then(res => {
      this.name = res.data.accountInfo.account;
      this.src = res.data.accountInfo.imgUrl;
    });
    //用户是否过期
    API_checktoken(localStorage.token).then(res => {
      if (res.data.code == 0) {
        this.show = true;
      } else {
        this.show = false;
      }
    });
  },
  methods: {
    // 注销
    cancellation() {
      // console.log(1);

      localStorage.removeItem("role");
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      this.$router.push("/");
    }
  }
};
</script>

<style lang="less" scoped>
#index {
  height: 100%;
  .el-container {
    height: 100%;

    .left-title {
      h5 {
        text-align: center;
        line-height: 60px;
        font-size: 16px;
        width: 100%;
        i {
          padding: 12px;
          font-size: 20px;
          background-color: #1296db;
          border-radius: 50%;
          margin-right: 10px;
          color: #000;
        }
      }
    }

    .el-header {
      background-color: #fff;
      color: #333;
      text-align: center;
      line-height: 60px;

      .el-breadcrumb {
        line-height: 60px;
      }
      .header_title {
        > div {
          display: flex;

          > div {
            padding-left: 10px;
            &:nth-child(2) {
              height: 40px;
            }
          }
        }
      }
      .login {
        a {
          font-size: 20px;
          text-decoration: none;
          color: red;
        }
      }
    }

    .el-aside {
      background-color: #304156;
      color: #fff;
      text-align: center;
      line-height: 200px;
      height: 100%;
      .el-menu {
        border: 0;
        width: 100%;
        padding: 0;
      }
    }

    .el-main {
      background-color: #f0f2f5;
      color: #333;
      height: 100%;
    }
    /deep/ .el-menu-item-group__title {
      display: none;
    }
  }
}
</style>