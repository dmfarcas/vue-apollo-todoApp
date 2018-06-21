import Vue from 'vue'
import App from './App.vue'
import { createProvider } from './vue-apollo'
import VueDragResize from 'vue-drag-resize'

Vue.component('vue-drag-resize', VueDragResize)

Vue.config.productionTip = false

new Vue({
  provide: createProvider().provide(),
  render: h => h(App)
}).$mount('#app')
