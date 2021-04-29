<template>
  <div>
    <router-view/>
    <FooterGuide v-show="$route.meta.showFooter"/>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import FooterGuide from "./components/FooterGuide/FooterGuide";

  // import {reqFoodTypes} from './api/index'

  export default {
    mounted() {
      // const result = await reqFoodTypes('40.10038','116.36867')

      // console.log(result)
      this.$store.dispatch('getAddress')
      // this.$store.dispatch('getUserInfo')

      this.getUserInfo()
    },
    methods: {
      ...mapActions(['getAddress', 'getUserInfo'])
    },
    components: {
      FooterGuide
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .app
    width 100%
    height 100%
    background #f5f5f5
</style>
