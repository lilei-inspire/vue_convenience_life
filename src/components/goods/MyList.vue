<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品交易</el-breadcrumb-item>
      <el-breadcrumb-item>我的商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入名称" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">发布商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="70"></el-table-column>
        <el-table-column label="商品描述" prop="goods_introduce">
          <template slot-scope="scope">
            <div v-html='scope.row.goods_introduce'></div>
          </template>
        </el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="100"></el-table-column>
        <el-table-column label="商品数量(件)" prop="goods_number" width="100"></el-table-column>
        <el-table-column label="商品状态" prop="goods_cat" width="70"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140"></el-table-column>
        <el-table-column label="操作" width="130">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="updata(scope.row.goods_id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
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

    <el-dialog title="修改参数" :visible.sync="updataVisible" :close-on-click-modal="false" width="23%" @close="reset('updataFormRef')">
      <el-form :model="updataForm" :rules="updataFormRules" ref="updataFormRef" label-width="100px">
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="updataForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="updataForm.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品状态" prop="goods_cat">
          <el-select v-model="updataForm.goods_cat" placeholder="请选择">
            <el-option v-for="item in options" :key="item.label" :label="item.value" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updataVisible = false">取 消</el-button>
        <el-button type="primary" @click="updataGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      updataVisible: false,
      updataForm: {
        updata_id: '',
        goods_price: 0,
        goods_number: 0,
        goods_cat: '',
      },
      updataFormRules: {
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
      },
      options: [
        {
          value: '待出售',
          label: '选项1',
        },
        {
          value: '已预定',
          label: '选项2',
        },
        {
          value: '已出售',
          label: '选项3',
        },
        {
          value: '备货中',
          label: '选项4',
        },
        {
          value: '无法购买',
          label: '选项5',
        },
      ],
      // 查询参数对象
      queryInfo: {
        userid: '',
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 商品列表
      goodslist: [],
      // 总数据条数
      total: 0,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    updata(id) {
      this.updataForm.updata_id = id
      this.updataVisible = true
    },
    updataGoods() {
      this.$refs['updataFormRef'].validate(async (valid) => {
        if (!valid)  return this.$message.error('请填写必要参数')
        const { data: res } = await this.$http.post('updatagoods', this.updataForm)
        if (res.status !== 200) return this.$message.error(res.msg)
        this.$message.success('商品信息修改成功')
        this.getGoodsList()
        this.updataVisible = false
      })
    },
    async removeGoods(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除！')
      }
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.$message.success('删除成功！')
      this.getGoodsList()
    },

    async getGoodsList() {
      this.queryInfo.userid = window.sessionStorage.getItem('user_id')
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.goodslist = res.data
      this.total = res.param
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
    },
    goAddpage() {
      this.$router.push('/goods/add')
    },
    reset(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style lang="less" scoped>
</style>
