/*
入口JS
 */
import Vue from 'vue';
import VueLazyload from 'vue-lazyload'

import App from "./App";
import router from "./router"
import store from "./store"

import './mock/mockServer' // 加载mockServer即可
import loading from './common/imgs/loading.gif'
import './filters' // 加载过滤器

Vue.use(VueLazyload, { // 声明使用，内部自定义一个指令lazy
  loading
})
// eslint-disable-next-line
new Vue({
  el: '#app',
  render: h => h(App),
  router, // 注册路由器
  store // 注册store
})
