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