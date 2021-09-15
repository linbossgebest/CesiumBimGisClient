import request from '@/utils/request'

//获取所有菜单信息
export function getMenuList() {
  return request({
    url: '/api/Account/GetMenuInfo',
    method: 'get',
  })
}

//获取菜单路由信息(tree)
export function getRoutes() {
  return request({
    url: '/api/Account/GetMenuTree',
    method: 'get',
  })
}

//根据角色id获取菜单路由信息(tree)
export function getRoutesByRole(roleId) {
  return request({
    url: '/api/Account/GetMenuTreeByRole',
    method: 'get',
    params: { roleId }
  })
}

//添加或修改菜单信息
export function addMenu(data) {
  return request({
    url: '/api/Account/AddMenu',
    method: 'post',
    data
  })
}

//根据角色id删除菜单信息
export function deleteMenu(menuId) {
  return request({
    url: '/api/Account/DeleteMenu',
    method: 'get',
    params: { menuId }
  })
}


//获取所有角色信息
export function getRoles() {
  return request({
    url: '/api/Account/GetRoleList',
    method: 'get',
  })
}

//添加或修改角色信息
export function addRole(data) {
  return request({
    url: '/api/Account/AddRole',
    method: 'post',
    data
  })
}

//根据角色id删除角色
export function deleteRole(roleId) {
  return request({
    url: '/api/Account/DeleteRole',
    method: 'get',
    params: { roleId }
  })
}


//获取所有app动态配置菜单
export function getAppMenus(pageIndex, pageSize) {
  return request({
    url: '/api/Account/GetAllAppMenu',
    method: 'get',
    params: { pageIndex, pageSize }
  })
}

//根据菜单类型获取app动态配置菜单
export function getAppMenusByType(type) {
  return request({
    url: '/api/Account/GetAppMenu',
    method: 'get',
    params: { type }
  })
}
