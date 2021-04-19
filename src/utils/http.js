import auth from '@/utils/auth'

let {baseUrl} = require(`../config/index-${process.env.NODE_ENV}`)
import {isUrl} from './util'
import storage from '@/utils/storage'
function httpRequest(dialog = true, router, data = {}, method) {
    // token验证
    let access_token =  storage.get('access_token')
    // 判断是否开启正在加载提示
    dialog && uni.showLoading({
        title: '加载中',
        mask: true
    })
    // 返回一个promise
    return new Promise((resolve, reject) => {
        uni.request({
            url: isUrl(router) ? router : `${baseUrl}${router}`,
            data: {
                ...data
            },
            method,
            header: {
                "Accept": 'application/json; charset=utf-8', // json格式
                "Authorization": 'Basic c2lubzpzaW5vX3NlY3JldA==',
                "Sino-Auth": access_token
            },
            success: async (res)=>{
                // console.log(res)
                if (res.statusCode === 200) {
                    if (Number(res.data.code) === 200) {
                        resolve(res.data.data || res.data)
                        dialog && uni.hideLoading()
                    } else if (Number(res.data.code) === 1011) {
                        uni.navigateTo({
                            url: "/pages-person/address/index?isChooseAddress=" + true
                        })
                    } else {
                        uni.showToast({
                            title: res.data.msg,
                            icon: 'none',
                            duration: 2000
                        })
                        setTimeout(()=>{
                            dialog && uni.hideLoading()
                        }, 2000)
                        resolve('')
                    }
                }else {
                    uni.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000
                    })
                    resolve('')
                }
            },
            fail(error) {
                dialog && uni.hideLoading()
                // 请求错误提示
                uni.showToast({
                    title: '网络异常，请检查网络设置',
                    duration: 2000,
                    icon: 'none'
                })
                resolve('')
            }
        })
    })
}
export async function errorCaptured(awaitFn) {
    try {
        let res = await awaitFn
        return [null, res]
    } catch (e) {
        return [e, null]
    }
}

export function get(router, data = {}, dialog) {
    return httpRequest(dialog, router, data, 'GET')
}

export function post(router, data = {}, dialog) {
    return httpRequest(dialog, router, data, 'POST')
}

export function deleteRequest(router, data = {}, dialog) {
    return httpRequest(dialog, router, data, 'DELETE')
}
