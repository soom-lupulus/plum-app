import request from './index'

export const getCaseList = function (params) {
    return request.get('/case/list', {
        params
    })
}   

export const insertCase = function (example) {
    return request.post('/case/add', example)
}

export const removeCase = function (id) {
    return request.post(`/case/del?id=${id}`)
}

export const editCase = function (example) {
    return request.post(`/case/edit`, example)
}
