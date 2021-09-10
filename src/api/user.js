import request from '@/utils/request'

//用户登录api
export function login(data) {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/Account/RequestToken',
    method: 'post',
    data
  })
}

//获取用户信息
export function getInfo() {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/Account/GetUserInfo',
    method: 'get',
  })
}

//获取所有用户
export function getUsers(pageIndex, pageSize) {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/Account/GetUserList',
    method: 'get',
    params: { pageIndex, pageSize }
  })
}

//添加或修改用户
export function addUser(data) {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/Account/AddUser',
    method: 'post',
    data
  })
}

//删除指定用户
export function deleteUser(userId) {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/Account/DeleteUser',
    method: 'get',
    params: { userId }
  })
}

//登出
export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

//获取所有用户角色信息
export function getUserRoles() {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/Account/GetUserRoleList',
    method: 'get',
  })
}

//根据用户编号获取用户角色信息
export function getUserRolesByUserId(userId) {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/Account/GetUserRoleListById',
    method: 'get',
    params: { userId }
  })
}