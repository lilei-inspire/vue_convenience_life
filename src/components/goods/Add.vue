<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card style="height: 600px">
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"> </el-alert>
      <!-- 步骤条区域 -->
      <el-steps :space="500" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
    <el-scrollbar style="height: 450px">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="contact">
              <el-input v-model="addForm.contact" placeholder="仅支持QQ联系"></el-input>
            </el-form-item>
            <el-form-item label="商品状态" prop="goods_cat">
              <el-select v-model="addForm.goods_cat" placeholder="请选择">
                <el-option v-for="item in options" :key="item.label" :label="item.value" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="1">
            <el-form-item label="上传图片" prop="imgname">
              <el-input v-model="addForm.imgname" v-if="false"></el-input>
              <el-upload action="" ref="upload" :auto-upload="false" list-type="picture" :limit="3" :on-exceed="exceed" :http-request="uploadFile" :on-change="handleChange">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="2">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add('addFormRef')">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
          </el-scrollbar>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        user_id: '',
        goods_name: '',
        goods_price: 0,
        contact: '',
        goods_number: 0,
        goods_cat: '',
        imgname: '',
        goods_introduce: '',
      },
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
        imgname: [{ required: true, message: '请上传图片', trigger: 'blur' }],
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
    }
  },
  methods: {
    add(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid)  return this.$message.error("请填写商品必要参数！")
          this.fileData = new FormData()
          this.$refs.upload.submit()
          this.addForm.user_id = window.sessionStorage.getItem('user_id')
          this.fileData.append('user_id', this.addForm.user_id)
          this.fileData.append('goods_name', this.addForm.goods_name)
          this.fileData.append('goods_price', this.addForm.goods_price)
          this.fileData.append('contact', this.addForm.contact)
          this.fileData.append('goods_number', this.addForm.goods_number)
          this.fileData.append('goods_cat', this.addForm.goods_cat)
          this.fileData.append('goods_introduce', this.addForm.goods_introduce)
          const { data: res } = await this.$http.post('goods', this.fileData)
          if (res.status !== 200) return this.$message.error(res.msg)
          this.$message.success('发布商品成功')
          this.$router.push('/mygoods')
      })
    },

    handleChange(file, fileList) {
      this.addForm.imgname = file.name
    },
    //上传图片
    uploadFile(file) {
      this.fileData.append('files', file.file)
    },
    //图片超出
    exceed(file, fileList) {
      return this.$message.error('最多上传3张图片')
    },
  },
}
</script>

<style lang="less" scoped>
.btnAdd {
  margin-top: 15px;
}
</style>
