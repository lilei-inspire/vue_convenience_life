<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入用户昵称" v-model="queryInfo.query" clearable @clear="getuserlist">
            <el-button slot="append" icon="el-icon-search" @click="getuserlist"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="user_name"></el-table-column>
        <el-table-column label="用户昵称" prop="nick_name"></el-table-column>
        <el-table-column label="邮箱" prop="email" width="180"></el-table-column>
        <el-table-column label="性别" prop="sex" width="50"></el-table-column>
        <el-table-column label="注册时间" prop="create_time" width="150"> </el-table-column>
        <el-table-column label="角色" prop="user_role" width="110">
          <template slot-scope="scope">
            <el-select :disabled="canChange(scope.row)" v-model="scope.row.user_role" @change="userRoleChanged(scope.row)">
              <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="user_state" width="100">
          <template slot-scope="scope">
            <el-select :disabled="canChange(scope.row)" v-model="scope.row.user_state" @change="userStateChanged(scope.row)">
              <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="封号时间" prop="lock_time" width="150"> </el-table-column>
        <el-table-column label="解封时间" prop="unlock_time" width="150"> </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userlist: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      options1: [
        {
          value: 'admin',
          label: '管理员',
        },
        {
          value: 'user',
          label: '用户',
        },
      ],
      options2: [
        {
          value: '0',
          label: '正常',
        },
        {
          value: '1',
          label: '封禁',
        },
      ],
      total: '',
    }
  },
  created() {
    this.getuserlist()
  },
  methods: {
    async getuserlist() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.userlist = res.data
      this.total = res.param
    },
    async userRoleChanged(row) {
      const confirmResult = await this.$confirm('此操作将改变用户权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消赋权')
      }
      const { data: res } = await this.$http.put(`users/${row.user_id}/role/${row.user_role}`)
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.$message.success('该用户权限已改变')
    },

    canChange(row) {
      if (row.user_id == window.sessionStorage.getItem("user_id")) return true
    },

    async userStateChanged(row) {
      const confirmResult = await this.$confirm('此操作将会使用户封禁7天或解封账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消封禁')
      }
      const { data: res } = await this.$http.put(`users/${row.user_id}/state/${row.user_state}`)
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      if (res.data == '1') {
        this.getuserlist()
        return this.$message.success('该用户账号已被封禁7天')
      }
      this.getuserlist()
      this.$message.success('该用户账号已解封')
    },

    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
    },
  },
}
</script>

<style scoped>
</style>