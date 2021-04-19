import Vue from 'vue'
import Vuex from 'vuex'
import storage from '@/utils/storage'
Vue.use(Vuex)

const wxUserInfo = storage.get('wxUserInfo')
const loginUser = storage.get('loginUser')
const token = storage.get('token')
const applyStatus = storage.get('applyStatus')
const applyName = storage.get('applyName')
const applyTime = storage.get('applyTime')

const states = {
    activeItem: 'This is vuex value',
    wxUserInfo,
    loginUser,
    token, // 授权后返回的token
    applyStatus,
    applyName,
    applyTime
}
const mutations = {
    WXUSERINFO(state, val) {
        storage.set('wxUserInfo', val)
        state.wxUserInfo = val
    },
    LOGINUSER(state, val) {
        storage.set('loginUser', val)
        state.loginUser = val
    },
    SETTOKEN(state, val) {
        storage.set('access_token', val)
        state.token = val
    },
    APPLYSTATUS(state, val){
        storage.set('applyStatus', val)
        state.applyStatus = val
    },
    APPLYNAME(state, val){
        storage.set('applyName', val)
        state.applyName = val
    },
    APPLYTIME(state, val){
        storage.set('applyTime', val)
        state.applyTime = val
    }
}
const actions = {
    SETWXUSERINFO({commit}, val) {
        commit('WXUSERINFO', val)
    },
    SETLOGINUSER({commit}, val) {
        commit('LOGINUSER', val)
    },
    SETTOKEN({commit}, val) {
        commit('SETTOKEN', val)
    },
    SETAPPLYSTATUS({commit},val){
        commit('APPLYSTATUS', val)
    },
    SETAPPLYNAME({commit},val){
        commit('APPLYNAME', val)
    },
    SETAPPLYTIME({commit},val){
        commit('APPLYTIME', val)
    }
}
const getters = {
    getwxUserInfo(state) {
        return state.wxUserInfo
    },
    getLoginUser(state) {
        return state.loginUser
    },
    getToken(state) {
        return state.token
    }
}
export default {
    namespaced: true,
    state: states,
    mutations,
    actions,
    getters
}
