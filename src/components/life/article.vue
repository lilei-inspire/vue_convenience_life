<template>
  <div class="article">
    <div class="article-cover">
      <img :src="article.imgsrc" alt="" />
    </div>
    <div class="info">
      <el-link class="article-title" :href="articleurl" :disabled="status" target="_blank">{{ article && article.title }}</el-link>
      <div class="article-time">{{ formatTime }}</div>
      <div class="article-content">{{ brief }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status: false,
    }
  },
  props: {
    article: Object,
  },
  computed: {
    articleurl() {
      if (this.article.m_url) return this.article.m_url
      this.status = true
      return ''
    },
    // 对时间进行格式化
    formatTime: function () {
      if (this.article) {
        const dt = new Date()
        const month = dt.getMonth()
        const date = dt.getDate()
        return `${month + 1}月${date}日`
      }
      return ''
    },
    //截取文章内容的前 35 个字，并加上省略号
    brief: function () {
      return this.article.digest.substr(0, 35) + '...'
    },
  },
}
</script>

<style lang="scss" scoped>
.article {
  width: 1250px;
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #dbdbdb;
  &:last-child {
    border: none;
  }
  .article-title {
    font-size: 18px;
    font-weight: 550;
    color: #404040;
    text-align: justify;
  }
  .article-title:hover {
    color: #f34540;
  }
  .article-cover {
    flex: none;
    width: 120px;
    margin-right: 10px;
    > img {
      width: 100%;
    }
  }
  .article-content,
  .article-time {
    font-size: 14px;
  }
  .article-time {
    margin: 10px 0;
    color: #bbb;
  }
}
</style>

