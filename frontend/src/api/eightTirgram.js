import request from './index'

export const getEightTrigramInfo = function (params) {
    return request.get('/eight/detail', {
        params
    })
}   