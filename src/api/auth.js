import request from '@/utils/request'

//获取菜单路由信息
export function getRoutes() {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/Account/GetMenuTree',
    method: 'get',
  })
}

//获取所有角色信息
export function getRoles() {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/Account/GetRoleList',
    method: 'get',
  })
}

//获取所有app动态配置菜单
export function getAppMenus(pageIndex, pageSize) {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/Account/GetAllAppMenu',
    method: 'get',
    params: { pageIndex, pageSize }
  })
}

//根据菜单类型获取app动态配置菜单
export function getAppMenusByType(type) {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/Account/GetAppMenu',
    method: 'get',
    params: { type }
  })
}
