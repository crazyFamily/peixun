<template>
  <div>
    <VueAPlayer :music="musicOptions" theme="#fd6720" class="rms-player">
    </VueAPlayer>
  </div>
</template>

<script>
import VueAPlayer from 'vue-aplayer'
VueAPlayer.disableVersionBadge = true
export default {
  name: 'player',

  props: {
    url: String,
    title: String,
    artist: String,
    pic: String
  },

  data() {
    return {}
  },

  components: { VueAPlayer },

  computed: {
    musicOptions() {
      return {
        src: this.url,
        title: this.title || ' ',
        artist: this.artist || ' ',
        pic: this.pic || ''
      }
    }
  },

  mounted() {},

  methods: {}
}
</script>
<style lang='scss' scoped>
.rms-player {
  box-shadow: unset;
  :deep(.aplayer-icon-mode) {
    display: none;
  }
}
</style>
