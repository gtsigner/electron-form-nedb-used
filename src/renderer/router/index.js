import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/',
      name: 'home-page',
      component: require('@/views/home').default
    },
    {
      path: '/record',
      name: 'record-page',
      component: require('@/views/record').default
    },
    {
      path: '/settings',
      name: 'settings-page',
      component: require('@/views/settings').default
    },
    {
      path: '/export',
      name: 'export-page',
      component: require('@/views/export').default
    },
  ]
})
