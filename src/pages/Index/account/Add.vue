<template>
  <div id="modify">
    <h5 class="modify_title">添加账号</h5>
    <el-divider></el-divider>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="user">
        <el-input v-model.number="ruleForm.user" suffix-icon="el-icon-user"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" show-password></el-input>
      </el-form-item>
      <el-form-item label="用户组">
        <el-select v-model="ruleForm.region" placeholder="请选择用户组">
          <el-option label="超级管理员" value="超级管理员"></el-option>
          <el-option label="普通管理员" value="普通管理员"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { API_add } from "@/api/apis";
export default {
  data() {
    var checkuser = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      }
    };

    return {
      issend: true,
      ruleForm: {
        pass: "",
        user: "",
        region: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],

        user: [{ validator: checkuser, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm() {
      //防抖节流

      if (this.issend == false) return;
      //切换
      this.issend = false;
      //发送注册
      API_add(
        this.ruleForm.user,
        this.ruleForm.pass,
        this.ruleForm.region
      ).then(res => {
        // console.log(res);
        if (res.data.code == 0) {
          this.$message({
            message: "注册成功！！！",
            type: "success"
          });
        } else {
          this.$message.error("注册失败！！请稍后重试");
        }
      });
      //3秒后切换
      setTimeout(() => {
        this.issend = true;
      }, 3000);
    },
    //重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
 
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
  .el-select {
    width: 300px;
  }
}
</style>