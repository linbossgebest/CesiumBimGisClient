import { asyncRoutes, constantRoutes, componentMap } from '@/router'
import { getRoutes } from '@/api/auth'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

//替换route对象中的component
function replaceComponent(comp) {
  if (comp.component && typeof (comp.component) == 'string') {
    comp.component = componentMap[comp.component]
  }

  if (comp.children == null || comp.children.length == 0){
    delete comp.children
  }

  if (comp.children && comp.children.length > 0) {
    for (let i = 0; i < comp.children.length; i++) {
      comp.children[i] = replaceComponent(comp.children[i])
    }
  }

  return comp
}

const actions = {
  async generateRoutes({ commit }, roles) {
    //从后台接口请求所有路由信息
    let res = await getRoutes()
    // console.log(res)
    let myAsyncRoutes =JSON.parse(res.data).menuTree

    //整理数据(替换组件名称，删除空的children)
    myAsyncRoutes = myAsyncRoutes.filter(curr => {
      if (curr.children == null || curr.children.length == 0) {
        delete curr.children
      }
      return replaceComponent(curr)
    })

    let accessedRoutes
    if (roles.includes('admin')) {
      accessedRoutes = myAsyncRoutes || []
    } else {
      accessedRoutes = filterAsyncRoutes(myAsyncRoutes, roles)
    }
    commit('SET_ROUTES', accessedRoutes)
    return accessedRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
