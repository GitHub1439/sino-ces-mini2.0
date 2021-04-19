<template>
    <view class="wrapper" :class="[mClass]">
        <view @click="handleTap">
            <slot></slot>
        </view>
        <block v-if="(!userInfo && openType === 'user')">
            <button class="auth" @click="redirectTap">
            </button>
        </block>
        <block v-if="(!checkPhone && openType === 'phone')">
            <button class="auth" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"></button>
        </block>
    </view>
</template>

<script>
/* 授权包裹按钮处理 */
/* 当多个地方需要验证是否已经授权时使用， 对某个按钮和元素操作时授权处理 */
import {mapState} from 'vuex'
import auth from '@/utils/auth'
export default {
    props: {
        mClass: {
            type: String,
            default: ''
        },
        openType: {
            /* user, phone */
            type: String,
            default: ''
        }
    },
    data() {
        return {}
    },
    computed: {
        // ...mapState('common', ['userInfo', 'checkPhone', 'loginUser', 'token'])
        ...mapState({
            userInfo: state => state.common.userInfo,   // 是否已经授权过了用户信息
            checkPhone: state => state.common.checkPhone, // 是否已经授权过了手机号
            loginUser: state => state.common.loginUser, // 是否已经授权过了用户信息
            token: state => state.common.token // （后端返回过来的token，保持登录状态）
        })
    },
    methods: {
        async getPhoneNumber(e) {
            if (e.detail.errMsg === 'getPhoneNumber:ok') {
                let {encryptedData, iv} = e.detail
                let param = {encryptedData, iv}
                let [error, data] = await this.$cap(auth.authIphoneDo(param))
                /* start 注意这里调试方便用， 因为涉及接口问题 */
                this.$store.dispatch('common/setCheckPhone', encryptedData)
                /* end 注意这里调试方便用， 因为涉及接口问题 */
                if (error) {
                    console.log(error, data)
                } else {
                    /* 这里请求接口把参数传递给后端 */
                }
            } else {
                uni.showToast({
                    icon: 'none',
                    title: '您已拒绝授权，请重新授权',
                    duration: 2000
                })
            }
        },
        getUserInfo(e) {
            if (e.detail.errMsg === 'getUserInfo:ok') {
                // 发送请求
                // this.$store.dispatch('common/setUserInfo', e.detail.userInfo)
            }
        },
        redirectTap() {
            uni.navigateTo({
                url: '../../pages/auth-page/auth-page'
            })
        },
        handleTap(e) {
            this.$emit('on-click', e)
        }
    }
}
</script>

<style lang="scss" scoped>
.wrapper {
    position: relative;
    width: 100%;
    height: 100%;

    .auth {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0.65;
        background: linear-gradient(16deg, #C01920 0%,rgba(31,141,239,1) 85%,rgba(73,173,252,1) 100%);
        top: 0;
        left: 0;
        z-index: 10;
    }
}
</style>
