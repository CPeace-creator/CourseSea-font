// const BASEURL = 'http://xxx.xxx' 
const BASEURL = 'http://192.168.1.29:4000';

/*
 * 全局请求封装
 * @param path 请求路径
 * @param method 请求类型(GET/POST/DELETE等)
 * @param data 请求体数据
 * @param loading 请求未完成是是否显示加载中，默认为true
 * @param needToken 是否需要token，默认为false
 */
export default (path, method, data = {}, loading = true, needToken = false) => {
    // 获取存储token
    const token = uni.getStorageSync("token");

    // 判断token是否存在且接口是否需要token
    if (!token && needToken) {
        // const showToastMessage = (message) => {
        //     uni.showToast({
        //         icon: "none",
        //         title: message
        //     });
        // };
        // showToastMessage('请登录后操作');
        return;
    }

    if (loading) {
        uni.showLoading({
            title: "加载中",
            mask: true
        });
    };

    // 根据接口是否需要token以及token是否存在来决定调用的请求函数
    if (needToken && token!= '') {
        return tokenRequest(path, method, data, loading, token)
    } else {
        return noTokenRequest(path, method, data, loading)
    }
};

// 无token时发送请求函数
function noTokenRequest(path, method, data, loading) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: BASEURL + path,
            method: method,
            data,
            success(response) {
                // console.log('响应拦截');
                if (response.statusCode === 401) {
                    // 若本地存在token，清除token
                    const token = uni.getStorageSync("token");
                    if (token) {
                        // uni.removeStorageSync('token');
                    }
                    // 提示用户请先登录
                    uni.showToast({
                        icon: "none",
                        title: '请登录后操作',
                        duration: 1000
                    });
                    return
                    // 去登录
                }
                resolve(response.data);
            },
            fail(err) {
                uni.showToast({
                    icon: "none",
                    title: '服务响应失败'
                });
                console.error(err);
                reject(err);
            },
            complete() {
                uni.hideLoading();
            }
        });
    });
}

// 有token时发送请求函数
function tokenRequest(path, method, data, loading, token) {
    return new Promise((resolve, reject) => {
        uni.request({
            url: BASEURL + path,
            method: method,
            data,
            header: {
                "token": token
            },
            success(response) {
                if (response.statusCode === 401) {
                    // 清除本地存储的token
                    // uni.removeStorageSync('token');
                    // 提示用户请先登录
                    // uni.showToast({
                    //     icon: "none",
                    //     title: '请登录后操作',
                    //     duration: 1000
                    // });
                    return
                    // 去登录
                }
                // console.log(response.data);
                resolve(response.data);
            },
            fail(err) {
                uni.showToast({
                    icon: "none",
                    title: '服务响应失败'
                });
                console.error(err);
                reject(err);
            },
            complete() {
                uni.hideLoading();
            }
        });
    });
}

export {
    BASEURL
}