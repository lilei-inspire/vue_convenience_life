<template>
  <div class="post">
    <!-- 左侧头像 -->
    <div class="left">
      <div class="avatar">
        <img :src="'data:image/jpeg;base64,' + data.head" />
      </div>
    </div>
    <!-- 右侧 -->
    <div class="right">
      <div class="post-name">
        {{ data.nick_name }}
      </div>
      <div class="post-text">
        {{ data.text }}
      </div>
      <!-- 图片 -->
      <div class="post-pic">
        <el-image 
        style="width: 100px; height: 100px; margin-right: 5px;" 
        fit="fill" 
        v-if="picture" 
        v-for="picture in data.pictures" 
        :key="picture" 
        :src="'data:image/jpeg;base64,' + picture"> 
        </el-image>
      </div>
      <!-- 链接 -->
      <!-- <div class="post-digest" v-if="data.content.link.time">
        <img :src="data.content.link.imgUrl" />
        <div>{{ data.content.link.text }}</div>
      </div> -->
      <!-- 发表时间和评论按钮 -->
      <div class="post-time-ico">
        <div class="post-time">{{ data.time }}</div>
        <i class="iconfont iconshanchu1" v-if="candelete()" @click="open2()"></i>
        <el-popover placement="bottom" :width="155" v-model="visible">
          <i class="post-icon iconfont icondian" slot="reference"></i>
          <div>
            <el-button size="mini" type="info" icon="iconfont iconzan" @click="setlike()">点赞</el-button>
            <el-button type="info" size="mini " icon="iconfont iconpinglun1" @click="open()">评论</el-button>
          </div>
        </el-popover>
      </div>
      <div class="post-bottom" v-if="data.likes.length != 0 || data.comments.length != 0">
        <div class="post-like">
          <span v-for="like in data.likes">❤{{ like.liker_name }}</span>
        </div>
        <div class="post-comment" v-for="comment in data.comments">
          <span class="username">
            {{ comment.review }}
            <!-- <span class="reply-entry">
              <span class="reply black" v-if="comment.to">回复</span>
              <span class="reply-username"> {{ comment.to }} </span>
            </span> --> </span
          >:
          <span class="black"> {{ comment.content }} </span>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    data: Object,
    method: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      visible: false,
      likeform: {
        dynamicid: '',
        userid: '',
      },
      commentform: {
        dynamicid: '',
        userid: '',
        comment: '',
      },
    }
  },
  methods: {
    //是否可以删除
    candelete() {
      var id = window.sessionStorage.getItem('user_id')
      var id1 = this.data.user_id
      if (id != id1) return false
      return true
    },
    //删除动态
    async deletedynamic() {
      const { data: res } = await this.$http.delete('deldynamic', { data: { dynamicid: this.data.dynamic_id } })
      if (res.status !== 200) return this.$message.error(res.msg)
      this.$message.success('删除成功')
      this.method()
    },
    open2() {
      this.$confirm('此操作将永久删除该动态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.deletedynamic()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },

    //点赞事件
    async setlike() {
      this.likeform.dynamicid = this.data.dynamic_id
      this.likeform.userid = window.sessionStorage.getItem('user_id')
      const { data: res } = await this.$http.post('like', this.likeform)
      if (res.status !== 200) return this.$message.info('您已为他点过赞了！')
      this.$message.success('点赞成功！')
      this.data.likes.push(res.data)
      this.visible = false
    },
    //评论事件
    async setcomment(value) {
      this.commentform.dynamicid = this.data.dynamic_id
      this.commentform.userid = window.sessionStorage.getItem('user_id')
      this.commentform.comment = value
      const { data: res } = await this.$http.post('comment', this.commentform)
      if (res.status !== 200) return this.$message.error(res.msg)
      this.$message.success('评论成功！')
      this.data.comments.push(res.data)
    },
    open() {
      this.$prompt('', '评论', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '请输入评论',
      })
        .then(({ value }) => {
          this.setcomment(value)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消评论',
          })
        })
    },
  },
}
</script>


<style lang="scss" scoped>
.post:after {
  clear: both;
  content: '.';
  height: 0;
  display: block;
  visibility: hidden;
}
.post {
  margin-top: 15px;
  border-bottom: 1px solid #dbdbdbfa;
}
/*左侧头像*/
.left {
  float: left;
  padding: 0 10px;
}
.avatar img {
  width: 55px;
  height: 55px;
}
/*右侧内容*/
.right {
  /*float: left;*/
  /*width: 100%;*/
  margin-left: 75px;
}

/*姓名*/
.post-name {
  color: #1e4c97;
  font-size: 13px;
}
.post-text {
  margin-top: 3px;
  font-size: 13px;
}
/*图片*/
.post-pic {
  margin-top: 5px;
}
/*链接*/
.post-digest {
  background: #f3f3f5;
  height: 55px;
}
.post-digest img {
  padding: 5px;
  float: left;
  width: 45px;
  height: 45px;
}
.post-digest div {
  font-size: 13px;
}
/*时间*/
.post-time-ico {
  height: 25px;
}
.post-time {
  float: left;
  margin-top: 5px;
  font-size: 12px;
  color: #757575;
}
/*图标*/
.inotlike {
  color: rgb(243, 243, 243);
  text-shadow: #1e4c97 1px 0 0, #1e4c97 0 1px 0, #1e4c97 -1px 0 0, #1e4c97 0 -1px 0;
}
.post-icon {
  color: #92abd4;
  float: right;
}
.post-icon:after {
  visibility: hidden;
  content: '.';
  clear: both;
  height: 0;
}
/*弹出block*/
.comment-wrapper {
  height: 25px;
  display: none;
  position: absolute;
  width: 120px;
  background: rgba(27, 27, 27, 0.8);
  color: #fff;
  right: 65px;
}
.like,
.comment {
  line-height: 25px;
  text-align: center;
  width: 50px;
  display: inline-block;
  font-size: 12px;
}
.comment-show {
  display: block;
}

/*评论区*/
.post-comment {
  margin-top: 2px;
}
.post-bottom {
  background: #f3f3f3;
  font-size: 12px;
  color: #1e4c97;
  padding: 5px;
}
.black {
  color: #000;
}
</style>