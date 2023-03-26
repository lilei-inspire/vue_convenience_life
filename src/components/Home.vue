<template>
  <el-container class="home-container">
    <el-dialog title="个人资料" :visible.sync="userVisible" :close-on-click-modal="false" width="50%">
      <Users :key="timer" :method="gethead" />
    </el-dialog>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img :src="'data:image/jpeg;base64,' + head" alt="" />
        <span>{{ nickName }}</span>
      </div>
      <div class="btn">
        <el-button style="margin-right: 12px" type="info" @click="logout">退出</el-button>
        <el-dropdown @command="handleCommand">
          <el-button type="primary"> 更多<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="user">个人资料</el-dropdown-item>
            <el-dropdown-item command="userdelete">注销账号</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="hsla(0, 0%, 100%, 0)" text-color="#78BB7B" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.fid + ''" v-for="item in menulist" :key="item.fid">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.fid]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.sid" @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i :class="icons[subItem.sid]"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Users from '@/components/user/Users.vue'
export default {
  components: {
    Users,
  },
  data() {
    return {
      timer: '',
      userVisible: false,
      headform: {
        userid: '',
      },
      nickName: '',
      head: null,
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        100: 'iconfont iconqunfengshenghuofuwuchong',
        101: 'iconfont icon38tongxunfuwu',
        102: 'iconfont iconwanggou',
        103: 'iconfont iconyule',
        104: 'iconfont iconyonghu',
        105: 'iconfont iconguanliyuan',
      },
      icons: {
        1002: 'iconfont icon73',
        1001: 'iconfont iconpengyouquan',
        1011: 'iconfont iconshoujichongzhi',
        1021: 'iconfont ',
        1022: 'iconfont ',
        1032: 'iconfont iconshipin',
        1031: 'iconfont iconyinle',
        1041: 'iconfont ',
        1051: 'iconfont ',
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: '',
    }
  },
  created() {
    this.gethead()
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    async gethead() {
      this.headform.userid = window.sessionStorage.getItem('user_id')
      const { data: res } = await this.$http.post('head', this.headform)
      this.head = res.head
      this.nickName = res.nick_name
      this.userVisible = false
    },
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    handleCommand(command) {
      if (command == 'user') {
        this.userVisible = true
        this.LoadUser()
      } else if (command == 'userdelete') {
        this.deleteUser()
      }
    },
    // 获取所有的菜单
    async getMenuList() {
      var id = window.sessionStorage.getItem('user_id')
      const { data: res } = await this.$http.get('menus/'+id)
      if (res.status !== 200) return this.$message.error(res.msg)
      this.menulist = res.data
    },
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    LoadUser() {
      this.timer = new Date().getTime()
    },
    async deleteUser() {
      const confirmResult = await this.$confirm('此操作将永久注销该账号, 已发表的商品和动态等数据也将删除，是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消注销！')
      }
      var id = window.sessionStorage.getItem('user_id')
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.$message.success('注销成功！')
      this.logout()
    },
  },
}
</script>

<style lang="less" scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.home-container {
  height: 100%;
  background-size: 100% 100%;
  background-image: url('../assets/1.jpg');
}
.el-header {
  background: hsla(0, 0%, 100%, 0);
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  // padding: 15px 0;
  height: 80px !important;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  img {
    width: 60px;
    height: 60px;
    border-radius: 100%;
    margin: 15px 0px 15px 15px;
  }
}

.el-aside {
   background: hsla(0, 0%, 100%, 0);
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
   background: hsla(0, 0%, 100%, 0.2);
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
   background: hsla(0, 0%, 100%, 0);
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
