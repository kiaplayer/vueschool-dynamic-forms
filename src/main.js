import Vue from 'vue'
import App from './App.vue'
import vuelidate from 'vuelidate'

Vue.use(vuelidate)
Vue.config.productionTip = false
console.log(Vue.config)

new Vue({
  render: h => h(App)
}).$mount('#app')
