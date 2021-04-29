<template>
  <section class="msite">
    <!--首页头部-->
    <HeaderTop title="海珠区阅江西路222号广州塔">
      <span class="header_search" slot="left">
        <i class="iconfont icon-sousuo"></i>
      </span>
      <span class="header_login" slot="right">
        <span class="header_login_text" v-if="!userInfo._id">登录|注册</span>
        <span class="header_login_text" v-else><i class="iconfont icon-person"></i></span>

      </span>
    </HeaderTop>
    <!--首页导航-->
    <nav class="msite_nav" v-if="categorysArr.length">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(categorys, index) in categorysArr" :key="index">
            <a href="javascript:" class="link_to_food" v-for="(category, index) in categorys" :key="index">
              <div class="food_container">
                <img :src="baseImageUrl+category.image_url">
              </div>
              <span>{{category.title}}</span>
            </a>
          </div>
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
      </div>
    </nav>
    <img src="./images/msite_back.svg" v-else>



    <!--首页附近商家-->
    <div class="msite_shop_list">
      <div class="header">
        <i class="iconfont icon-xuanxiang"></i>
        <span class="shop_header_title">附近商家</span>
      </div>
      <ShopList />
    </div>
  </section>
</template>

<script>
  import Swiper from 'swiper'
  import {mapState} from 'vuex'
  // import BScroll from 'better-scroll'

  import 'swiper/dist/css/swiper.min.css'
  import ShopList from "../../components/ShopList/ShopList";
  import HeaderTop from "../../components/HeaderTop/HeaderTop";

  export default {
    data () {
      return {
        baseImageUrl: 'https://fuss10.elemecdn.com'
      }
    },
    mounted() {
      // 获取食品分类数组数据
      // const arr = this.getCategorys()
      this.$store.dispatch('getCategorys')
      this.$store.dispatch('getShops')

      // new Swiper ('.swiper-container', {
      //   // direction: 'vertical', // 垂直切换选项
      //   loop: true, // 循环模式选项
      //
      //   // 如果需要分页器
      //   pagination: {
      //     el: '.swiper-pagination',
      //   }
      // })
    },
    computed: {
      ...mapState(['address', 'categorys', 'userInfo']),

      categorysArr() {
        // 计算属性中有 categorys，vm 对象自动添加此属性
        const {categorys} = this
        // 创建一个空的二维数组
        let arr = []
        // 创建一个小数组
        let minArr = []
        /*
        把 categorys 这个一维数组转换成 arr 这个二维数组
        且二维数组中的每个数组中元素不能超过8个
         */
        categorys.forEach((item) => {
          // 每个 minArr 长度不能超过8
          if (minArr.length === 8) {
            minArr = []
          }
          // 当 minArr 为空时，将 minArr 添加到二维数组中
          if (minArr.length === 0) {
            arr.push(minArr)
          }
          minArr.push(item)
        })

        return arr
      }
    },
    // methods: {
    //   ...mapActions(['getCategorys'])
    // },
    watch: {
      categorysArr(newValue) {
        // 此语句在 categorysArr 发生改变时执行
        this.$nextTick(function () { // 回调函数在更新界面后被调用
          new Swiper ('.swiper-container', { // 此语句是在获取数据之后，异步更新界面之前执行的
            // direction: 'vertical', // 垂直切换选项
            loop: true, // 循环模式选项

            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
            }
          })


          // new BScroll('.miste-content-wrapper', {
          //   click: true
          // })
        })

      }
    },
    components: { // 映射成标签
      ShopList,
      HeaderTop
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .msite  //首页
    width 100%
  .msite_header
    background-color #02a774
    position fixed
    z-index 100
    left 0
    top 0
    width 100%
    height 45px
    .header_search
      position absolute
      left 15px
      top 50%
      transform translateY(-50%)
      width 10%
      height 50%
      .icon-sousuo
        font-size 25px
        color #fff
    .header_title
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
      width 50%
      color #fff
      text-align center
      .header_title_text
        font-size 20px
        color #fff
        display block
    .header_login
      font-size 14px
      color #fff
      position absolute
      right 15px
      top 50%
      transform translateY(-50%)
      .header_login_text
        color #fff
  .msite_nav
    bottom-border-1px(#e4e4e4)
    margin-top 45px
    height 200px
    background #fff
    .swiper-container
      width 100%
      height 100%
      .swiper-wrapper
        width 100%
        height 100%
        .swiper-slide
          display flex
          justify-content center
          align-items flex-start
          flex-wrap wrap
          .link_to_food
            width 25%
            .food_container
              display block
              width 100%
              text-align center
              padding-bottom 10px
              font-size 0
              img
                display inline-block
                width 50px
                height 50px
            span
              display block
              width 100%
              text-align center
              font-size 13px
              color #666
      .swiper-pagination
        >span.swiper-pagination-bullet-active
          background #02a774
  .msite_shop_list
    top-border-1px(#e4e4e4)
    margin-top 10px
    background #fff
    .shop_header
      padding 10px 10px 0
      .shop_icon
        margin-left 5px
        color #999
      .shop_header_title
        color #999
        font-size 14px
        line-height 20px
</style>
