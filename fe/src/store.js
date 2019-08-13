import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token'),
    name : '손',
    sb : {
      act : false,
      msg : '',
      color : 'error'
    }
  },
  mutations: {
    getToken (state) {
      state.token = localStorage.getItem('token')
      state.name = localStorage.getItem('name')
    },
    delToken (state) {
      localStorage.removeItem('token')
      localStorage.removeItem('name')
      state.token = null
      state.name = '손'
    },
    pop (state, d) {
      state.sb.msg = d.msg
      state.sb.color = d.color
      state.sb.act = false
      if(d.act === undefined) state.sb.act = true
    }
  },
  actions: {

  }
})
