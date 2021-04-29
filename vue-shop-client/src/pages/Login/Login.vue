<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">千帆外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on: loginWay}" @click="loginWay = true">短信登录</a>
          <a href="javascript:;" :class="{on: !loginWay}" @click="loginWay = false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form @submit.prevent="login">
          <div :class="{on: loginWay}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <button :disabled="!rightPhone" class="get_verification"
                      :class="{right_phone: rightPhone}" @click.prevent="getCode">{{computedTime? `已发送(${computedTime}s)`:'获取验证码'}}</button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册千帆外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on: !loginWay}">
            <section>
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input type="text" maxlength="8" placeholder="密码" v-if="showPwd" v-model="pwd">
                <input type="password" maxlength="8" placeholder="密码" v-else v-model="pwd">
                <div class="switch_button" :class="showPwd ? 'on':'off'" @click="showPwd=!showPwd">
                  <div class="switch_circle" :class="{'right': showPwd}"></div>
                  <span class="switch_text">{{showPwd? 'abc':'...'}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img class="get_verification" src="http://localhost:4000/captcha" alt="captcha" ref="captcha" @click="getCaptcha">
              </section>
            </section>
          </div>
          <button class="login_submit">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>

    <AlertTip :alertText="alertText" v-show="isShowAlert" @closeTip="closeTip"/>
  </section>
</template>

<script>
  import AlertTip from "../../components/AlertTip/AlertTip";
  import {reqSendCode, reqSmsLogin, reqPwdLogin} from "../../api/index"

  export default {
    data () {
      return {
        loginWay: true, // 登录方式：true为短信登录，false为密码登录
        computedTime: 0, // 计时的时间
        showPwd: true, // 显示密码
        phone: '', // 手机号
        code: '', // 手机验证码

        name: '', // 用户名
        pwd: '', // 密码
        captcha: '', // 图片验证码
        alertText: '', // 提示具体文字
        isShowAlert: false, // 是否提示
      }
    },

    computed: {
      rightPhone() {
        return /^1\d{10}$/.test(this.phone)
      }
    },

    methods: {
      // 弹出警告框
      showAlert(alertText) {
        this.isShowAlert = true
        this.alertText = alertText
      },
      // 关闭警告框
      closeTip () {
        this.isShowAlert = false
        this.alertText = ''
      },
      // 异步获取短信验证码
      async getCode() {
        if (this.computedTime === 0) {
          // 实现倒计时
          this.computedTime = 30
          this.intervalId = setInterval(() => {
            this.computedTime--
            if (this.computedTime <= 0) {
              // 将computedTime重置为0，并清除定时器
              this.computedTime = 0
              clearInterval(this.intervalId)
            }
          }, 1000)

          // 获取验证码
          const result = await reqSendCode(this.phone)
          if (result.code === 1) { // 短信验证码发送失败
            // 显示提示
            this.showAlert('短信验证码发送失败')

            // 关闭倒计时
            this.computedTime = 0
            clearInterval(this.intervalId)
            return
          }
        }
      },

      // 异步登录
      async login() {
        // 前台表单验证
        if(this.loginWay) { // 短信登录
          const {rightPhone, code} = this
          if(!rightPhone) {
            // 提示手机号错误
            this.showAlert('手机号输入错误')
            return
          } else if(!/^\d{6}$/.test(code)) {
            // 提示短信验证码错误
            this.showAlert('验证码必须是6位数字')
            return
          }
        } else { // 密码登录
          const {name, pwd, captcha} = this
          if(!name) {
            // 提示用户名不能为空
            this.showAlert('用户名不能为空')
            return
          } else if(!pwd) {
            // 提示密码不能为空
            this.showAlert('密码不能为空')
            return
          } else if(!captcha) {
            // 提示图片验证码不能为空
            this.showAlert('图片验证码不能为空')
            return
          }
        }

        // 异步登录
        let result
        if (this.loginWay) { // 短信登录
          const {phone, code} = this
          result = await reqSmsLogin(phone, code)

        } else { // 密码登录
          const {name, pwd, captcha} = this
          result = await reqPwdLogin({name, pwd, captcha})
        }

        // 停止倒计时
        if(this.computeTime) {
          this.computeTime = 0
          clearInterval(this.intervalId)
          this.intervalId = undefined
        }

        // 根据结果数据处理
        if (result.code === 0) { // 登录成功
          const userInfo = result.data
          // 将user保存到vuex的state
          this.$store.dispatch('recordUser', userInfo)
          // 跳转到个人页面
          this.$router.replace('/profile')
        } else { // 登录失败
          // 显示新的图片验证码
          this.getCaptcha()
          // 显示提示
          const { msg } = result
          this.showAlert(msg)
        }
      },


      // 获取图片验证码
      getCaptcha() {
        this.$refs.captcha.src = 'http://localhost:4000/captcha?time='+Date.now()
      }
    },

    components: {
      AlertTip // 将组件映射成标签
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                  //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(30px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>
