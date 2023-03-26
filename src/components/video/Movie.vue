<template>
  <div class="my-video">
    <video width="900" height="600" controls>
      <source :src="src" type="video/mp4" />
    </video>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 'video/mp4', //视频格式
      src: 'https://mvwebfs.yun.kugou.com/202106042249/47d585ed4077cf084728ec56c1a9446c/G242/M06/1E/09/kocBAF-4qyWAfK0EAn4ABhgjbHc599.mp4', //视频地址
    }
  },
  methods: {},
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    },
  },
}
</script>

<style scoped lang="less">
</style>
