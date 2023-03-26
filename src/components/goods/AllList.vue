<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品交易</el-breadcrumb-item>
      <el-breadcrumb-item>全部商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入名称" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 全部商品数据 -->
      <el-table :data="allgoodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="70px"></el-table-column>
        <el-table-column label="商品描述" prop="goods_introduce">
          <template slot-scope="scope">
            <div v-html='scope.row.goods_introduce'></div>
          </template>
        </el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品数量(件)" prop="goods_number" width="95px"></el-table-column>
        <el-table-column label="商品状态" prop="goods_cat" width="70px"></el-table-column>
        <el-table-column label="商品卖家" prop="goods_seller" width="150px"></el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看商品图片" placement="top-start">
              <el-button size="mini" type="success" icon="el-icon-picture" @click="viewImg(scope.row.pictures)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="联系卖家" placement="bottom-end">
              <el-button size="mini" type="primary" icon="el-icon-phone-outline" @click="contact(scope.row.contact)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog :visible.sync="ImgVisible" width="50%" top="10px">
      <el-image prop="pictures" fit="contain" v-if="picture" v-for="picture in picturelist" :key="picture" :src="'data:image/jpeg;base64,' + picture"> </el-image>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data() {
    return {
      picturelist: [],
      ImgVisible: false,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      allgoodslist: [],
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    contact(qq) {
      var url = 'https://api.tx7.co/api/temporary?qq='+qq
      window.location.href = url
    },
    viewImg(pictures) {
      this.picturelist = pictures
      this.ImgVisible = true
    },
    async getGoodsList() {
      const { data: res } = await this.$http.get('allgoods', { params: this.queryInfo })
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.allgoodslist = res.data
      this.total = res.param
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

<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';

.el-cascader {
  width: 100%;
}
</style>
