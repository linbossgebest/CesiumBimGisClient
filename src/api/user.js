import request from '@/utils/request'

//用户登录api
export function login(data) {
  return request({
    url: '/api/Account/Login',
    method: 'post',
    data
  })
}

//获取用户信息
export function getInfo() {
  return request({
    url: '/api/Account/GetUserInfo',
    method: 'get',
  })
}

//获取所有用户
export function getUsers(pageIndex, pageSize) {
  return request({
    url: '/api/Account/GetUserList',
    method: 'get',
    params: { pageIndex, pageSize }
  })
}

//添加或修改用户
export function addUser(data) {
  return request({
    url: '/api/Account/AddUser',
    method: 'post',
    data
  })
}

//删除指定用户
export function deleteUser(userId) {
  return request({
    url: '/api/Account/DeleteUser',
    method: 'get',
    params: { userId }
  })
}

//登出
export function logout() {
  // return request({
  //   baseURL: process.env.VUE_APP_BASE_API,
  //   url: '/vue-element-admin/user/logout',
  //   method: 'post'
  // })
  return request({
    url: '/api/Account/Logout',
    method: 'get',
  })
  // return new Promise(function (resolve, reject) {
  //   resolve();
  //   // //做一些异步操作
  //   // setTimeout(function () {
  //   //   console.log('执行完成Promise');
  //   //   resolve('要返回的数据可以任何数据例如接口返回数据');
  //   // }, 2000)
  // });
}

//获取所有用户角色信息
export function getUserRoles() {
  return request({
    url: '/api/Account/GetUserRoleList',
    method: 'get',
  })
}

//根据用户编号获取用户角色信息
export function getUserRolesByUserId(userId) {
  return request({
    url: '/api/Account/GetUserRoleListById',
    method: 'get',
    params: { userId }
  })
}