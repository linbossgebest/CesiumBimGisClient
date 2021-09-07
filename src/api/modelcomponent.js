import request from '@/utils/request'


//获取所有模型构件
export function getModelComponents(componentId,componentName,pageIndex, pageSize) {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/ModelComponent/GetComponents',
    method: 'get',
    params: { componentId,componentName,pageIndex, pageSize }
  })
}