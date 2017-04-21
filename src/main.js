import Vue from 'vue'
import Router from 'vue-router'
import App from './App'

const routes = [
  { path: '/', component: App, name: 'app' }
]
Vue.use(Router)

const router = new Router({
  routes
})

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
