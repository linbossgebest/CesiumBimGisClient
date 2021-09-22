import request from '@/utils/request'


//获取所有模型构件
export function getModelComponents(componentId, componentName, pageIndex, pageSize) {
  return request({
    url: '/api/ModelComponent/GetComponents',
    method: 'get',
    params: { componentId, componentName, pageIndex, pageSize }
  })
}


//获取所有模型构件菜单
export function getComponentMenus(pageIndex, pageSize) {
  return request({
    url: '/api/ModelComponent/GetAllComponentMenu',
    method: 'get',
    params: { pageIndex, pageSize }
  })
}

//新增或修改模型构件菜单信息
export function addComponentMenu(data) {
  return request({
    url: '/api/ModelComponent/AddComponentMenu',
    method: 'post',
    data
  })
}

//删除指定模型构件菜单信息
export function deleteComponentMenu(id) {
  return request({
    url: '/api/ModelComponent/DeleteComponentMenu',
    method: 'get',
    params: { id }
  })
}

//查询所有构件类型
export function getComponentTypes(pageIndex, pageSize) {
  return request({
    url: '/api/ModelComponent/GetComponentTypes',
    method: 'get',
    params: { pageIndex, pageSize }
  })
}

//添加或修改构件类型信息
export function addComponentType(data) {
  return request({
    url: '/api/ModelComponent/AddComponentType',
    method: 'post',
    data
  })
}

//删除指定构件类型信息
export function deleteComponentType(typeId) {
  return request({
    url: '/api/ModelComponent/DeleteComponentType',
    method: 'get',
    params: { typeId }
  })
}

//添加构件信息
export function addComponentInfo(data) {
  return request({
    url: '/api/ModelComponent/AddComponent',
    method: 'post',
    data
  })
}

//修改构件信息
export function updateComponentInfo(data) {
  return request({
    url: '/api/ModelComponent/UpdateComponent',
    method: 'post',
    data
  })
}

//删除指定构件信息
export function deleteComponentInfo(componentId) {
  return request({
    url: '/api/ModelComponent/DeleteComponent',
    method: 'get',
    params: { componentId }
  })
}


//上传构件信息Excel
export function uploadComponents() {
  return request({
    url: '/api/ModelComponent/UploadComponentsExcel',
    method: 'post',
  })
}

//获取构件对应文件信息
export function getComponentFiles(pageIndex, pageSize, componentId) {
  return request({
    url: '/api/ModelComponent/GetComponentFiles',
    method: 'get',
    params: { pageIndex, pageSize, componentId }
  })
}

//删除构件对应文件信息
export function deleteComponentFile(fileId) {
  return request({
    url: '/api/ModelComponent/DeleteComponentFile',
    method: 'get',
    params: { fileId }
  })
}

//上传构件对应文件信息
export function uploadComponentFile(data, modelId, componentId) {
  return request({
    url: '/api/ModelComponent/UploadComponentFile/?' + 'modelId=' + modelId + '&componentId=' + componentId,
    //  url: '/api/ModelComponent/UploadComponentFile',
    method: 'post',
    data
  })
}

//修改构件对应文件信息
export function updateComponentFile(data) {
  return request({
    url: '/api/ModelComponent/UpdateComponentFile',
    method: 'post',
    data
  })
}

//(模型构件文件信息)根据构件编号获取菜单list
export function getComponentFileMenus(componentId) {
  return request({
    url: '/api/ModelComponent/GetComponentDataSourceByComponentId',
    method: 'get',
    params: { componentId }
  })
}

//获取所有模型构件评论信息
export function getModelComponentComments(componentId, componentName, pageIndex, pageSize) {
  return request({
    url: '/api/ModelComponent/GetComments',
    method: 'get',
    params: { componentId, componentName, pageIndex, pageSize }
  })
}

//删除模型构件评论信息
export function deleteComponentComment(commentId) {
  return request({
    url: '/api/ModelComponent/DeleteComment',
    method: 'get',
    params: { commentId }
  })
}


