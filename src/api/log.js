import request from '@/utils/request'

//查询操作日志信息
export function getOptionLogs(logName, requestMethod, pageIndex, pageSize) {
    return request({
        url: '/api/Account/GetOptionLogs',
        method: 'get',
        params: { logName, requestMethod, pageIndex, pageSize }
    })
}

//查询操作日志信息
export function getExceptionLogs(className, methodName, pageIndex, pageSize) {
    return request({
        url: '/api/Account/GetExceptionLogs',
        method: 'get',
        params: { className, methodName, pageIndex, pageSize }
    })
}

//访问日志查询
export function getVisitLogs(logName, visType, pageIndex, pageSize) {
    return request({
        url: '/api/Account/GetVisitLogs',
        method: 'get',
        params: { logName, visType, pageIndex, pageSize }
    })
}