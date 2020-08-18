import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()/* 在vue的原型上初始化一个叫做bus的对象，这样才能通过this拿到这个bus，其次他是vue的实例化对象，因为不是vue的实例对象不能使用emit,on这种方法。*/
/* 为什么要写在main.js里面呢？因为index.html会首先加载main.js文件，main会去加载app.vue这个主组件，app又去加载子组件。。所以关于vue的全局代码写在mian.js里面应该比较好。毕竟是入口 */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
