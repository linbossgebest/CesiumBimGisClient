import request from '@/utils/request'

export function getRoutes() {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/Account/GetMenuTree',
    method: 'get',
  })
}