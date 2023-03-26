<template>
  <div class="login_container">
    <vue-particles
      class="login-bg"
      color="#39AFFD"
      :particleOpacity="0.7"
      :particlesNumber="100"
      shapeType="circle"
      :particleSize="4"
      linesColor="#8DD1FE"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
    <!-- 登录区域 -->
    <div class="login_box">
      <div class="title">农家便民生活平台</div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <el-form-item prop="username">
          <el-input clearable v-model="loginForm.username" prefix-icon="iconfont iconyonghu1"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input clearable v-model="loginForm.password" prefix-icon="iconfont icon3702mima" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click.prevent="login" native-type="submit">登录</el-button>
          <el-button type="primary" @click="dialogFormVisible = true">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 注册区域 -->
    <el-dialog title="欢迎注册" :visible.sync="dialogFormVisible" :close-on-click-modal="false" @close="reset('registFormRef')" width="28%">
      <el-form ref="registFormRef" :model="registForm" :rules="registFormRules" label-width="0px" class="regist_from" autocomplete="off">
        <div>
          <el-form-item prop="name">
            <el-input v-model="registForm.name" placeholder="用户名" />
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="registForm.email" placeholder="邮箱" />
            <el-button :disabled="clickstatu == true" size="mini" round @click="sendMsg">{{ btnText }}</el-button>
          </el-form-item>
          <el-form-item prop="code">
            <el-input v-model="registForm.code" maxlength="6" placeholder="验证码" />
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input v-model="registForm.pwd" type="password" placeholder="密码" />
          </el-form-item>
          <el-form-item prop="cpwd">
            <el-input v-model="registForm.cpwd" type="password" placeholder="确认密码" />
          </el-form-item>
          <el-button round type="primary" style="width: 100%" @click="regist">注册</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: 0,
      timer: null,
      clickstatu: '',
      btnText: '获取验证码',
      dialogFormVisible: false,
      statusMsg: '',
      loginForm: {
        username: '',
        password: '',
      },
      registForm: {
        name: '',
        code: '',
        pwd: '',
        cpwd: '',
        email: '',
      },
      verifyForm: {
        code: '',
        email: '',
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
        ],
      },

      registFormRules: {
        name: [
          {
            required: true,
            type: 'string',
            message: '请输入用户名',
            trigger: 'blur',
          },
        ],
        email: [
          {
            required: true,
            type: 'email',
            message: '请输入邮箱',
            trigger: 'blur',
          },
        ],
        pwd: [
          {
            required: true,
            message: '创建密码',
            trigger: 'blur',
          },
        ],
        cpwd: [
          {
            required: true,
            message: '确认密码',
            trigger: 'blur',
          },
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入密码'))
              } else if (value !== this.registForm.pwd) {
                callback(new Error('两次输入密码不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
      },
    }
  },

  created() {
    this.loginflag()
  },

  methods: {
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.status !== 200) return this.$message.error(res.msg)
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token', res.token)
        window.sessionStorage.setItem('user_id', res.user_id)
        this.$router.push('/home')
      })
    },
    //判断是否已登录
    loginflag() {
      var has = window.sessionStorage.getItem('token')
      if (has !== null) this.$router.push('/home')
    },
    regist() {
      this.$refs['registFormRef'].validate(async (valid) => {
        if (!valid) return
        var vcode = window.sessionStorage.getItem('verifycode')
        if (this.registForm.code != vcode) return this.$message.error('验证码错误！')
        const { data: res } = await this.$http.post('regist', this.registForm)
        if (res.status !== 200) return this.$message.error(res.msg)
        this.$message.success('注册成功')
        this.dialogFormVisible = false
      })
    },
    reset(formName) {
      this.$refs[formName].resetFields()
    },
    //发送验证码
    async sendMsg() {
      if (this.registForm.email == null || this.registForm.email == '') return this.$message.error('请填写邮箱！')
      this.verifyForm.email = this.registForm.email
      var vercode = Math.random().toString().slice(-6)
      this.verifyForm.code = vercode
      window.sessionStorage.setItem('verifycode', vercode)
      const { data: res } = await this.$http.post('verify', this.verifyForm)
      if (res.status !== 200) return this.$message.error(res.msg)
      this.$message.success("发送成功")
      this.clickstatu = true
      this.time = 60
      this.timer1()
    },
    //验证码60s内不能继续点击的函数
    timer1() {
      if (this.time > 0) {
        this.time--
        this.btnText = this.time + 's后重新获取'
        this.timer = setTimeout(this.timer1, 1000)
      } else {
        this.time = 0
        this.btnText = '获取验证码'
        this.clickstatu = false
        clearTimeout(this.timer)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #3e3e3e;
}
.login-bg {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-image: url('../assets/1.jpg');
}

.login_box {
  width: 400px;
  height: 270px;
  background: hsla(0, 0%, 100%, 0);
  border: 1px solid #f7f7f7;
  border-radius: 5px;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60px;
    font-size: 24px;
    color: white;
    border-bottom: 1px solid #ffffff;
  }
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
