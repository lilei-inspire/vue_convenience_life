<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>生活服务</el-breadcrumb-item>
      <el-breadcrumb-item>新闻眼</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card style="height: 600px">
      <div style="float: left; width: 50%">
        <div style="width: 50%">热点新闻</div>
        <el-scrollbar style="height: 580px">
          <div class="as">
            <!-- 用 v-for 渲染文章列表 -->
            <Article v-for="article in articleList" :key="article.title" :article="article"></Article>
          </div>
        </el-scrollbar>
      </div>
      <div style="float: right; width: 45%">
        <div style="width: 45%">微博热搜</div>
        <el-scrollbar style="height: 600px">
          <el-table :data="Hotsearchlist" :show-header="status">
            <el-table-column label="微博热搜">
              <template slot-scope="scope">
                <el-link :href="scope.row.link" target="_blank">{{ scope.row.title }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="heat"> </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
    </el-card>
  </div>
</template>

<script>
import Article from '@/components/life/article.vue'
import axios from 'axios'
export default {
  components: {
    Article,
  },
  data() {
    return {
      status: false,
      articleList: [],
      Hotsearchlist: [],
    }
  },

  created() {
    this.getArticleList()
    this.getHotsearchList()
  },

  methods: {
    async getHotsearchList() {
      var instance = axios.create({
        baseURL: 'https://api.tx7.co/api/',
      })
      const { data: res } = await instance.get('Hotsearch/')
      if (res.code == 200) this.Hotsearchlist = res.data
    },

    async getArticleList() {
      var instance = axios.create({
        baseURL: 'https://v1.alapi.cn/api/new',
      })
      const { data: res } = await instance.post('/toutiao', { start: 1, num: 15 })
      if (res.code == 200) this.articleList = res.data
    },
  },
}
</script>



<style lang="less" scoped>

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.as {
  width: 100%;
  height: 100%;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
/*最外层透明*/
/deep/ .el-table, /deep/ .el-table__expanded-cell{
  background-color: transparent;
}
/* 表格内背景颜色 */
/deep/ .el-table th,
/deep/ .el-table tr,
/deep/ .el-table td {
  background-color: transparent;
}
</style>