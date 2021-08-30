import request from '@/utils/request'

export function login(data) {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/Account/RequestToken',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/Account/GetUserInfo',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
