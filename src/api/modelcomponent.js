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


//获取所有模型构件菜单
export function getComponentMenus(pageIndex, pageSize) {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/ModelComponent/GetAllComponentMenu',
    method: 'get',
    params: { pageIndex, pageSize }
  })
}

//新增或修改模型构件菜单信息
export function addComponentMenu(data) {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/ModelComponent/AddComponentMenu',
    method: 'post',
    data
  })
}

//删除指定模型构件菜单信息
export function deleteComponentMenu(id) {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/ModelComponent/DeleteComponentMenu',
    method: 'get',
    params: { id }
  })
}




//查询所有构件类型
export function getComponentTypes(pageIndex, pageSize) {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/ModelComponent/GetComponentTypes',
    method: 'get',
    params: { pageIndex, pageSize }
  })
}


//添加或修改构件类型信息
export function addComponentType(data) {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/ModelComponent/AddComponentType',
    method: 'post',
    data
  })
}

//删除指定构件类型信息
export function deleteComponentType(typeId) {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/ModelComponent/DeleteComponentType',
    method: 'get',
    params: { typeId }
  })
}

//添加构件信息
export function addComponentInfo(data) {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/ModelComponent/AddComponent',
    method: 'post',
    data
  })
}

//修改构件信息
export function updateComponentInfo(data) {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/ModelComponent/UpdateComponent',
    method: 'post',
    data
  })
}

//删除指定构件信息
export function deleteComponentInfo(componentId) {
  return request({
    baseURL: 'http://localhost:5000',
    url: '/api/ModelComponent/DeleteComponent',
    method: 'get',
    params: { componentId }
  })
}

