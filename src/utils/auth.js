import {post} from '@/utils/http'
import store from '@/store'
import storage from '@/utils/storage'
import {get} from '@/utils/http'
import api from '@/utils/api'

// 检测sessionkey是否过期
const checkSessionKey = () => {
    return new Promise((resolve) => {
        const user = storage.get('userInfo') // 用户缓存信息
        if (user) {
            uni.checkSession({
                success() {
                    resolve(user) // 状态未过期
                },
                fail() {
                    resolve(false) // 状态已过期
                }
            })
        } else {
            resolve(false)
        }
    })
}

// 登录授权
const login = (params) => {
    return new Promise((resolve, reject) => {
        authDo(params).then(res => {
            if (!res) {
                reject('授权失败')
                return
            }
            store.dispatch('setUserInfo', params.userInfo)
            store.dispatch('setLoginUser', res)
            store.dispatch('setToken', res.backId)

            resolve(res)
        }).catch(e => {
            reject(e)
        })
    })
}

// 保存用户信息
const authDo = (params) => {
    return new Promise((resolve, reject) => {
        post('/wmdLogin/getJianHengToken', params, false).then((res) => {
            if (!res) {
                reject('保存信息失败')
            } else {
                resolve(res)
            }
        }).catch(e => {
            reject(e)
        })
    })
}

// 保存手机信息信息
const authIphoneDo = (params) => {
    return new Promise((resolve, reject) => {
        post('/wmdLogin/getWmdSinoToken', params, false).then((res) => {
            if (!res) {
                reject('保存信息失败')
            } else {
                // 这里返回一个状态， 然后存在本地缓存中， 用来标识是否已经授权
                storage.set('xxxx', res.phone)
                resolve(res)
            }
        }).catch(e => {
            reject(e)
        })
    })
}

// 获取服务商信息 uni-app是聚合开发 所以先获得是什么小程序 原生的不用这个
const getProvider = () => {
    return new Promise((resolve, reject) => {
        uni.getProvider({
            service: 'oauth', // 服务类型  登录授权
            success(res) {resolve(res.provider[0])},
            fail() { reject('获取服务商失败') }
        })
    })
}

// 获取code
const getCode = provider => {
    return new Promise((resolve, reject) => {
        if (!provider) {
            reject('获取缺少provider参数')
        }
        uni.login({
            provider,
            success(loginRes) {
                if (loginRes && loginRes.code) {
                    resolve(loginRes.code)
                } else {
                    reject('获取code失败')
                }
            },
            fail() {
                reject('获取code失败')
            }
        })
    })
}

// 是否开启了获取用户名授权 当用户一开始拒绝了 需再次提醒授权
const getSetting = function() {
    return new Promise((resolve, reject) => {
        uni.getSetting({
            success(res) {
                let authSetting = res.authSetting
                if (authSetting['scope.userInfo']) {
                    resolve(true)
                    return
                } // 授权成功
                if (authSetting['scope.userInfo'] === false) {
                    resolve(false)
                    return
                } // 拒绝授权
                // resolve(2) //2未操作
            },
            fail() {
                reject('获取用户授权失败')
            }
        })
    })
}

// 获取用户信息
const getUserInfo = (provider) => {
    return new Promise((resolve, reject) => {
        if (!provider) {
            reject('获取缺少provider参数')
            return
        }
        uni.getUserInfo({
            provider,
            success: (detail) => {
                if (detail.iv !== '') {
                    resolve(detail)
                } else {
                    reject(0) // 用户点击拒绝授权
                }
            },
            fail() {
                reject(0) // 如果用户拒绝过授权 直接走fail
            }
        })
    })
}
const getAuthInfoByCode = (mchId = '', customerId= '')=>{
    return new Promise((resolve,reject) =>{
        uni.login({
            provider: 'weixin',
            success(loginRes) {
                if (loginRes && loginRes.code) {
                    let param = {
                        code: loginRes.code
                    }
                    if(mchId){
                        param = {...param,mchId:mchId}
                    }
                    if(customerId){
                        param = {...param,customerId:customerId}
                    }
                    post(api.common.decode,param,false).then(res=>{
                        if(res){
                            console.log(res.sign)
                            store.dispatch('common/SETLOGINUSER',res.tokenInfo)
                            if(res.tokenInfo&&JSON.stringify(res.tokenInfo) !== '{}'){
                                storage.set('access_token', res.tokenInfo.access_token)
                                if(storage.get('mchId')&&storage.get('mchId')!==res.tokenInfo.mch_id){
                                    uni.showToast({
                                        icon: 'none',
                                        title: '已绑定店铺，不能进入其他店铺'
                                    })
                                }
                                storage.set('mchId', res.tokenInfo.mch_id)
                            }
                            store.dispatch('common/SETAPPLYSTATUS',res.applyStatus)
                            store.dispatch('common/SETAPPLYNAME', res.applyName)
                            store.dispatch('common/SETAPPLYTIME', res.applyTime)
                            storage.set('openId', res.openid)
                            storage.set('sign', res.sign)
                            resolve(res)
                        }else {
                            resolve({applyStatus:-1,errMsg: '登录失败'})
                        }
                    })

                } else {
                    resolve({applyStatus:-1,errMsg: '获取code失败'})
                    resolve('获取code失败')
                    console.log('获取code失败')
                }
            },
            fail() {
                resolve({applyStatus:-1,errMsg: '获取code失败'})
                console.log('获取code失败')
            }
        })
    })
}
const getLaunchUrl = async (e)=>{
    let url = ''
    let scanarr = ['','','']
    console.log(e.scene)
    if(e.scene){
        e.scene = decodeURIComponent(e.scene)
        console.log(e.scene)
        scanarr = e.scene.split('&')
        //let token=storage.get('access_token')

        // 红包码
        // if(Number(scanarr[0])===2&&token){
        //     url="/pages-person/order/red-bag?orderSn="+ scanarr[1]
        //     return url
        // }
        //0测试，1正式(是否内部测试用户 0否 1是)
        storage.set('isInner',Number(scanarr[0])===0?1:0)
        storage.set('mchId',scanarr[1])
        storage.set('customerId',scanarr[2])
        storage.set('initParam',e)
        if(scanarr[2] !== '') {
            let data = await get(api.home.storeDetail,{customerId: scanarr[2]})
            if(data){
                storage.set('mchId', data.mchId)
                scanarr[1] = data.mchId
            }
        }
        // console.log('customerId', scanarr[2])
    }
    let res = await getAuthInfoByCode(scanarr[1],scanarr[2])
    //0 申请中， 1已申请， 2，已拒绝， 3未申请
    if(res.applyStatus === 3){
        url = scanarr[1]?'/pages/auth-page/register':'/pages/auth-page/join-consult'
    }else if(res.applyStatus === 0 || res.applyStatus === 2){
        url = '/pages/auth-page/register'
    }else if(res.applyStatus === 1){
        url = storage.get('wxUserInfo')&&storage.get('phoneNumber')? '/pages/home/index' : '/pages/auth-page/register'
    }else {
        uni.showToast({
            title: res.errMsg,
            icon: 'none'
        })
        url = '/pages/auth-page/join-consult'
    }
    return url
}
export default {
    getSetting,
    checkSessionKey,
    getProvider,
    getCode,
    login,
    getUserInfo,
    authIphoneDo,
    getAuthInfoByCode,
    getLaunchUrl
}
