<template>
  <div>
    <el-card style="height: 600px">
      <img src="../assets/images/5.jpg" width="100%" height="270px"/>
      <div style="float: right; width: 50%">
        <div>
          <span style="color: #009fe9">天气信息</span>
          <iframe
            allowtransparency="true"
            frameborder="0"
            width="575"
            height="96"
            scrolling="no"
            src="//tianqi.2345.com/plugin/widget/index.htm?s=1&z=1&t=0&v=0&d=5&bd=0&k=&f=&ltf=009944&htf=cc0000&q=1&e=1&a=1&c=54511&w=575&h=96&align=left"
          ></iframe>
        </div>
        <div>
          <span style="color: #009fe9">在线小调查</span>
          <br />
          <span><strong>新网站正式投入使用，您对新站的看法，请在下方选择：</strong></span>
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="item in controlDatas" :label="item.ParameterCode" :key="item.ParameterCode" style="display: block; width: 20px">
              {{ item.ParameterName }}
            </el-checkbox>
          </el-checkbox-group>
          <el-button style="margin: 10px 0 0 10px" size="mini" type="primary" @click="vote">投票</el-button>
        </div>
      </div>
      <div style="float: left; width: 45%">
        <span style="color: #009fe9">村委公告栏</span>
        <el-table :data="tableData" stripe :show-header="status" style="width: 100%">
          <el-table-column prop="notice" width="450">
            <template slot-scope="scope">
              <el-link :href="scope.row.link" target="_blank" type="success">{{ scope.row.notice }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="date" width="100"> </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status: false,
      checkList: [],
      controlDatas: [
        {
          ParameterCode: 'A',
          ParameterName: '色彩搭配更加和谐',
        },
        {
          ParameterCode: 'B',
          ParameterName: '页面布局更加美观般',
        },
        {
          ParameterCode: 'C',
          ParameterName: '信息内容更加丰富',
        },
        {
          ParameterCode: 'D',
          ParameterName: '功能设置更加合理',
        },
      ],
      tableData: [
        {
          notice: '我为群众办实事——茶河乡人大代表在行动',
          date: '2021-05-20',
          link: 'http://xuanhan.gov.cn/show/2021/05/20/66401.html',
        },
        {
          notice: '人大工作干“实”、创“新” ——茶河乡贯彻落实县委人大工作会议精神',
          date: '2021-05-11',
          link: 'http://xuanhan.gov.cn/show/2021/05/11/66284.html',
        },
        {
          notice: '茶河乡扎实抓好全县2021年整治“群众最不满意的10件事”活动党史学习教育·为民办实事院坝议事工作',
          date: '2021-05-06',
          link: 'http://xuanhan.gov.cn/show/2021/05/06/66178.html',
        },
        {
          notice: '茶河乡概况',
          date: '2021-04-23',
          link: 'http://xuanhan.gov.cn/show/2021/02/23/65019.html',
        },
      ],
    }
  },
  methods: {
    vote() {
      this.$message.success('感谢您的宝贵意见！')
    },
  },
}
</script>