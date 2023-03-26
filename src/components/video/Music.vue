<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>娱乐服务</el-breadcrumb-item>
      <el-breadcrumb-item>音乐</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="height: 550px">
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入歌曲名称" v-model="queryInfo.keyword" clearable>
            <userDetail v-if="userdetailShow"></userDetail>
            <el-button slot="append" icon="el-icon-search" @click="getsonglist"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-scrollbar style="height: 560px">
        <el-table :data="songlist" @row-dblclick="playmusic">
          <el-table-column label="歌曲名" prop="name"></el-table-column>
          <el-table-column label="歌手" prop="artists[0].name" width="200px"></el-table-column>
          <el-table-column label="专辑" prop="album.name" width="200px"></el-table-column>
        </el-table>
      </el-scrollbar>
    </el-card>

    <el-row>
      <el-col :span="3">
        <el-button icon="iconfont iconshangyiqu" circle type="success"></el-button>
        <el-button @click="play" :icon="music.isPlay ? 'el-icon-video-pause' : 'el-icon-video-play'" circle type="success"></el-button>
        <el-button icon="iconfont iconxiayiqu" circle type="success"></el-button>
      </el-col>
      <el-col :span="2" style="padding: 10px 0px 0px 20px; color: #909399; font-size: 13px"> {{ formatTime(music.currentTime) }}/{{ formatTime(music.maxTime) }} </el-col>
      <el-col :span="14">
        <el-slider @change="changeTime" :format-tooltip="formatTime" :max="music.maxTime" v-model="music.currentTime" style="width: 100%"></el-slider>
      </el-col>
      <el-col :span="1" style="text-align: center; margin-left: 10px">
        <el-popover placement="top-start" trigger="hover">
          <el-slider @change="changeVolume" v-model="music.volume"></el-slider>
          <el-button icon="iconfont iconyinliang" circle slot="reference" type="info"></el-button>
        </el-popover>
      </el-col>
    </el-row>
    <audio ref="music" id="myAudio" loop autoplay></audio>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      userdetailShow: false,
      songurl: '',
      songlist: [],
      queryInfo: {
        keyword: '',
      },
      music: {
        isPlay: false,
        currentTime: 0,
        maxTime: 0,
        volume: 50,
      },
    }
  },
  created() {
    this.keyupSubmit()
  },
  mounted() {
    this.$nextTick(() => {
      setInterval(this.listenMusic, 1000)
    })
  },
  methods: {
    keyupSubmit() {
      document.onkeydown = (e) => {
        let _key = window.event.keyCode
        if (_key === 13) {
          this.getsonglist()
        }
      }
    },
    async playmusic(row) {
      this.songurl = 'https://music.163.com/song/media/outer/url?id=' + row.id + '.mp3'
      this.$refs.music.src = this.songurl
    },

    async getsonglist() {
      var instance = axios.create({
        baseURL: 'https://v1.alapi.cn/api/music',
      })
      const { data: res } = await instance.get('/search', { params: this.queryInfo })
      if (res.code == 200) this.songlist = res.data.songs
      this.userdetailShow = true
    },

    listenMusic() {
      if (!this.$refs.music) {
        return
      }
      if (this.$refs.music.readyState) {
        this.music.maxTime = this.$refs.music.duration
      }
      this.music.isPlay = !this.$refs.music.paused
      this.music.currentTime = this.$refs.music.currentTime
    },
    play() {
      if (this.$refs.music.paused) {
        this.$refs.music.play()
      } else {
        this.$refs.music.pause()
      }
      this.music.isPlay = !this.$refs.music.paused
      this.$nextTick(() => {
        document.getElementById('play').blur()
      })
    },
    changeTime(time) {
      this.$refs.music.currentTime = time
    },
    changeVolume() {
      this.$refs.music.volume = this.music.volume / 100
    },
    formatTime(time) {
      let it = parseInt(time)
      let m = parseInt(it / 60)
      let s = parseInt(it % 60)
      return (m < 10 ? '0' : '') + parseInt(it / 60) + ':' + (s < 10 ? '0' : '') + parseInt(it % 60)
    },
  },
}
</script>
<style lang="less" scoped>
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

</style>>
