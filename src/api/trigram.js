import request from './index'

export const getTrigramInfo = function (params) {
    return request.get('/trigram/detail', {
        params
    })
}   