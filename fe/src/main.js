import '@babel/polyfill'
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

import 'tui-editor/dist/tui-editor.css'
import 'tui-editor/dist/tui-editor-contents.css'
import 'codemirror/lib/codemirror.css'
import { Editor, Viewer } from '@toast-ui/vue-editor'
//tui-editor 위지윅 에디터 사용하기 추가

Vue.config.productionTip = false

Vue.component('editor', Editor)
Vue.component('viewer', Viewer)

Vue.use(VeeValidate)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
