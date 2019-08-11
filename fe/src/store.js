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
    },
    delToken (state) {
      localStorage.removeItem('token')
      state.token = null
    },
    pop (state, d) {
      state.sb.msg = d.msg
      state.sb.color = d.color
      state.sb.act = false
      if(d.act === undefined) state.sb.act = true
    },
    getName(state){
      state.name = localStorage.getItem('name')
      localStorage.removeItem('name')
    },
    delName(state){
      state.name = '손'
    }
  },
  actions: {

  }
})
