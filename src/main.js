import Vue from 'vue'
import App from './App.vue'
import { createProvider } from './vue-apollo'
// hello world
//
Vue.config.productionTip = false

new Vue({
  provide: createProvider().provide(),
  render: h => h(App)
}).$mount('#app')
