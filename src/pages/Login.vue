<template>
  <div class="login">
    <div class="login_box">
      <div class="login_title">长安外卖管理系统登录</div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="user">
          <label for="user">
            <el-input v-model="ruleForm.user" suffix-icon="el-icon-user"></el-input>
          </label>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="ruleForm.pwd" show-password></el-input>
        </el-form-item>

        <el-button type="info" @click="clickLogin">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { API_login } from "@/api/apis";
export default {
  data() {
    return {
      ruleForm: {
        user: "",
        pwd: "",
        issend: true
      },
      rules: {
        user: [
          { required: true, message: "长度在 3 到 10 个字符", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        pwd: [
          { required: true, message: "长度在 3 到 10 个字符", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //登录
    clickLogin() {
      // console.log(this.rules.user[0].required);
      if (this.issend == false) return;
      this.issend = false;
      //登录
      API_login(this.ruleForm.user, this.ruleForm.pwd).then(res => {
        if (res.data.code == 0) {
          // 把id存进会话存储
          // sessionStorage.setItem("id", res.data.id);
          localStorage.id = res.data.id;
          //把token放在本地存储
          // localStorage.setItem("token", res.data.token);
          localStorage.token = res.data.token;
          //把用户权限保存在本地
          localStorage.role = res.data.role;
          //提示信息
          this.$message({
            message: "登录成功！！！",
            type: "success"
          });
          //2秒跳转
          setTimeout(() => {
            this.$router.push("/index/home");
          }, 1000);
        } else {
          this.$message.error("登录失败，账户或者用户名错误");
        }
      });
      //3秒后切换
      setTimeout(() => {
        this.issend = true;
      }, 3000);
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  // background-color: #2d3a4b;
  background: url(../assets/imgs/login.jpg) no-repeat;
  background-size: 100% 100%;
  .login_box {
    width: 400px;
    height: 300px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-62%, -50%);

    .el-form {
      .el-form-item {
        margin-bottom: 40px;
      }
      button {
        margin: 0 100px;
        width: 75%;
      }
    }
    .login_title {
      width: 100%;
      padding: 0 45px;
      text-align: center;
      font-size: 25px;
      line-height: 50px;
      color: #fff;
    }
  }
  /deep/ .el-form-item__label {
    color: #fff;
  }
}
// .el-form-item /deep/ .el-form-item__label {
//   color: #fff;
// }
</style>