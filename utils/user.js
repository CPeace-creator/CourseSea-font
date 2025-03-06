import request from "./request.js";

export const register = (data) => {
    return request('/register', 'POST', data, true)
}
export const login = (data) => {
    return request('/login', 'POST', data, true)
}