import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import store from './store'

var cfg = require('../config')

Vue.use(Router)

Vue.prototype.$axios = axios
var apiRootPath = ''
if(process.env.NODE_ENV === "production ")
  apiRootPath = '/api/'
else if(process.env.NODE_ENV === 'development2 ')
  apiRootPath = 'http://localhost:3000/api/'
else{
  apiRootPath = `${cfg.host_URL}:3000/api/`
}



Vue.prototype.$apiRootPath = apiRootPath
axios.defaults.baseURL = apiRootPath

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  const token = response.data.token
  const name = response.data.name
  // console.log(token)
  if (token) localStorage.setItem('token', token)
  if (name) localStorage.setItem('name', name)
  return response
}, function (error) {
  // Do something with response error

  switch (error.response.status) {
    case 400:
      store.commit('pop', { msg: `잘못된 요청입니다(${error.response.status}:${error.message})`, color: 'error' })
      break
    case 401:
      store.commit('delToken')
      store.commit('pop', { msg: `인증 오류입니다(${error.response.status}:${error.message})`, color: 'error' })
      break
    case 403:
      store.commit('pop', { msg: `이용 권한이 없습니다(${error.response.status}:${error.message})`, color: 'warning' })
      break
    default:
      store.commit('pop', { msg: `알수 없는 오류입니다(${error.response.status}:${error.message})`, color: 'error' })
      break
  }
  return Promise.reject(error)
})

const pageCheck = (to, from, next) => {
  // return next()
  axios.post('page', { name: to.path })
    .then((r) => {      
      if (!r.data.success) throw new Error(r.data.msg)
      next()
    })
    .catch((e) => {
      // console.error(e.message)
      if (!e.response) store.commit('pop', { msg: e.message, color: 'warning' })
      next(false)
    })
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/home'),
      beforeEnter: pageCheck
    },
    {
      path : '/board/:name',
      name : 'board',
      component : () => import('./views/board'),
      beforeEnter : pageCheck
    },
    {
      path : '/issue/:article_id',
      name : "issue",
      component : () => import('./views/issue'),
      beforeEnter : pageCheck
    }
    ,
    {
      path: '/test/lv3',
      name: 'testLv3',
      component: () => import('./views/test/lv3'),
      beforeEnter: pageCheck
    },
    {
      path: '/test/lv2',
      name: 'testLv2',
      component: () => import('./views/test/lv2'),
      beforeEnter: pageCheck
    },
    {
      path: '/test/lv1',
      name: 'testLv1',
      component: () => import('./views/test/lv1'),
      beforeEnter: pageCheck
    },
    {
      path: '/test/lv0',
      name: 'testLv0',
      component: () => import('./views/test/lv0'),
      beforeEnter: pageCheck
    },
    {
      path: '/manage/users',
      name: 'manageUsers',
      component: () => import('./views/manage/user'),
      beforeEnter: pageCheck
    },
    {
      path: '/manage/pages',
      name: 'managePages',
      component: () => import('./views/manage/pages'),
      beforeEnter: pageCheck
    },
    {
      path: '/manage/sites',
      name: 'manageSites',
      component: () => import('./views/manage/sites'),
      beforeEnter: pageCheck
    },
    {
      path: '/manage/boards',
      name: 'manageBoards',
      component: () => import('./views/manage/boards'),
      beforeEnter: pageCheck
    },
    {
      path: '/manage/dashboard',
      name: 'dashboard',
      component: () => import('./views/manage/dashboard'),
      beforeEnter: pageCheck
    },
    
    // {
    //   // path: '/block/:msg',
    //   // name: '차단',
    //   // component: () => import('./views/block')
    // },
    // {
    //   path: '/test',
    //   name: 'test',
    //   component: () => import('./views/test')
    // },
    {
      path: '/sign',
      name: '로그인',
      component: () => import('./views/sign')
    },
    {
      path: '/register',
      name: '회원가입',
      component: () => import('./views/register')
    },
    {
      path: '*',
      name: 'e404',
      component: () => import('./views/e404')
    }
  ]
})