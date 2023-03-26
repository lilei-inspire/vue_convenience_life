<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>生活服务</el-breadcrumb-item>
      <el-breadcrumb-item>村友圈</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dynamicdialog = true" round>发布动态</el-button>
    <el-button type="primary" @click="getdynamiclist()" round>刷新</el-button>
    <el-dialog title="发布动态" :visible.sync="dynamicdialog" :close-on-click-modal="false" @close="reset('ruleForm'), clearFiles()">
      <div class="upload-image">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item label="动态内容" prop="textarea">
            <el-input type="textarea" placeholder="这一刻的想法..." :rows="5" v-model="ruleForm.textarea"> </el-input>
          </el-form-item>
          <el-form-item label="上传图片" prop="imgname">
            <el-input v-model="ruleForm.imgname" v-if="false"></el-input>
            <el-upload
              action=""
              ref="upload"
              :auto-upload="false"
              list-type="picture-card"
              :limit="3"
              :on-exceed="exceed"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :http-request="uploadFile"
              :on-change="handleChange"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="50%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="submitImg('ruleForm')">立即发表</el-button>
            <el-button @click="dynamicdialog = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 卡片视图区域 -->
    <el-scrollbar style="height: 560px">
      <el-card class="circle">
        <dynamic :method="getdynamiclist" v-for="item in dynamiclist" :data="item" :key="item.dynamic_id"></dynamic>
      </el-card>
    </el-scrollbar>
  </div>
</template>

<script>
import dynamic from '@/components/life/dynamic.vue'
export default {
  components: {
    dynamic,
  },
  data() {
    return {
      dynamicdialog: false,
      dynamiclist: [],
      fileData: '',
      ruleForm: {
        textarea: '',
        user_id: '',
        imgname: '',
      },
      rules: {
        textarea: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        imgname: [{ required: true, message: '请上传图片', trigger: 'blur' }],
      },
      dialogImageUrl: '',
      dialogVisible: false,
    }
  },
  created() {
    this.getdynamiclist()
  },
  methods: {
    reset(formName) {
      this.$refs[formName].resetFields()
    },
    //获得动态列表
    async getdynamiclist() {
      const { data: res } = await this.$http.get('dynamics')
      if (res.status !== 200) return this.$message.error(res.msg)
      this.dynamiclist = res.data
    },
    //发布动态
    submitImg(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.fileData = new FormData()
          this.$refs.upload.submit()
          this.ruleForm.user_id = window.sessionStorage.getItem('user_id')
          this.fileData.append('textarea', this.ruleForm.textarea)
          this.fileData.append('user_id', this.ruleForm.user_id)
          const { data: res } = await this.$http.post('upload', this.fileData)
          if (res.status !== 200) return this.$message.error(res.msg)
          this.$message.success('发表成功')
          this.dynamicdialog = false
          this.getdynamiclist()
        }
      })
    },
    handleChange(file, fileList) {
      this.ruleForm.imgname = file.name
    },
    //上传图片
    uploadFile(file) {
      this.fileData.append('files', file.file)
    },
    //移除图片勾子
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    //图片预览勾子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    //图片超出
    exceed(file, fileList) {
      return this.$message.error('最多上传3张图片')
    },
    //清空图片列表
    clearFiles() {
      this.$refs.upload.clearFiles()
    },
  },
}
</script>
<style scoped>
.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>