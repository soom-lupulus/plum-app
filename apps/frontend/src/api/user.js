import request from './index'

export const userLogin = function (user) {
    return request.post('/user/login', user)
}   