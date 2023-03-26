<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>通讯服务</el-breadcrumb-item>
      <el-breadcrumb-item>手机充值</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <ul class="msg-box">
        <li>
          <h4 style="margin-bottom: 15px">手机号码</h4>
          <el-input clearable @clear="clearphone" v-model="phonenumber" placeholder="请输入手机号码" style="width: 150px" maxlength="11" @change="queryphone"></el-input>
          <span>{{ phonetype }}</span>
        </li>
        <li>
          <h4 style="margin-bottom: 15px">充值金额</h4>
          <el-radio v-model="amount" :label="1">充值10</el-radio>
          <el-radio v-model="amount" :label="2">充值20</el-radio>
          <el-radio v-model="amount" :label="3">充值50</el-radio>
          <el-radio v-model="amount" :label="4">充值100</el-radio>
          <el-radio v-model="amount" :label="5">充值200</el-radio>
        </li>

        <li>
          <h4 style="margin-bottom: 15px">充值方式</h4>
          <el-radio v-model="payway" :label="1">微信</el-radio>
          <el-radio v-model="payway" :label="2">支付宝</el-radio>
        </li>
      </ul>
      <div style="text-align: center; margin-top: 30px">
        <el-button type="primary" @click="surepay">确认支付</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      phonetype: '',
      phoneprovince: '',
      phonecity: '',
      phonenumber: '',
      amount: '',
      payway: '',
    }
  },
  methods: {
    clearphone() {
      this.phonetype = null
    },
    surepay() {
      this.$message.info('该功能接口暂未开放！！')
    },
    async queryphone() {
      this.$jsonp(
        'https://api.asilu.com/phone',
        { phone: this.phonenumber },
        {
          headers: {},
          emulateJSON: true,
        }
      ).then((res) => {
        if (res.areacode == undefined) return
        this.phonetype = res.province + ' ' + res.city
      })
    },
  },
}
</script>

<style scoped>
</style>

