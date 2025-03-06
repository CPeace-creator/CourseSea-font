import request from "./request.js";
const BASE_URL = '/category'
export const list = (data) => {
    return request(BASE_URL+'/list', 'POST', data, false)
}