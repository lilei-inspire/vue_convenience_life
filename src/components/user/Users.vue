<template>
  <div>
    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
      <el-form-item label="用户名">
        <el-input v-model="editForm.user_name" disabled></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nick_name">
        <el-input v-model="editForm.nick_name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="editForm.password" show-password></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio v-model="editForm.sex" label="男">男</el-radio>
        <el-radio v-model="editForm.sex" label="女">女</el-radio>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="editUserInfo">确认修改</el-button>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    method: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      editForm: {},
      editFormRules: {
        email: [{ required: true, message: '请输入用户邮箱', trigger: 'blur' }],
        nick_name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo() {
      var id = window.sessionStorage.getItem('user_id')
      const { data: res } = await this.$http.get('users/' + id)
      if (res.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.editForm)
        if (res.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }
        this.$message.success('更新用户信息成功！')
        this.method()
      })
    },
  },
}
</script>