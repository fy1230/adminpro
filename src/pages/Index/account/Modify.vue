<template>
  <div id="modify">
    <h5 class="modify_title">修改密码</h5>
    <el-divider></el-divider>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="原密码" prop="pwd">
        <el-input v-model="ruleForm.pwd" @change="checkoldpwd(ruleForm.pwd)" show-password></el-input>
        <span class="err" v-show="err">原密码错误</span>
      </el-form-item>

      <el-form-item label="新密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" show-password></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
//验证密码是否正确
import { API_old_pwd, API_new_pwd } from "@/api/apis";
export default {
  data() {
    var checkpwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      err: false,
      send: false,
      issend: true,
      ruleForm: {
        pass: "",
        checkPass: "",
        pwd: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        pwd: [{ validator: checkpwd, trigger: "blur" }]
      }
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //验证旧密码是否正确
    checkoldpwd(val) {
      API_old_pwd(val, localStorage.getItem("id")).then(res => {
        // console.log(res.data);
        if (res.data.code == "00") {
          this.err = false;
          this.send = true;
        } else {
          this.err = true;
          this.send = false;
        }
      });
    },
    //发送ajax修改密码
    submitForm() {
      // console.log(1);
      // console.log(this.ruleForm.pass);
      // console.log(sessionStorage.getItem("id"));
      if (this.issend == false) return;
      this.issend = false;

      if (this.send) {
        API_new_pwd(this.ruleForm.pass, Number(localStorage.getItem("id"))).then(
          res => {
            // console.log(res);
            if (res.data.code == 0) {
              //提示信息
              this.$message({
                message: "修改密码成功请重新登录",
                type: "success"
              });
              // 2秒跳转
              setTimeout(() => {
                this.$router.push("/");
              }, 2000);
            }
          }
        );
      } else {
        this.$message.error("修改失败，请检查密码是否正确");
      }
      //3秒后切换
      setTimeout(() => {
        this.issend = true;
      }, 3000);
    }
  }
};
</script>
<style lang="less" scoped>
#modify {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  .modify_title {
    font-size: 20px;
  }
  .el-input {
    width: 300px;
  }
  .err {
    color: #f56c6c;
    font-size: 12px;
    margin-left: 10px;
  }
}
</style>