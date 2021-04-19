<template>

    <view class="container sn-column">
        <uni-nav-bar :left-icon="applyStatus === 1&&phoneNumber?'back':''"
                     :gradual-change="true"
                     title="器械邦"></uni-nav-bar>
        <sn-custom-refresh
            @refresherrefresh="onRefresh"
            :is-need-load="false"
            refresher-background="linear-gradient(to right, #EF3E3D,#C4282F)"
        >
        <!-- 代理商信息 -->
        <view class="header">
            <view class="header-info">
                <view class="top-info">
                    <text class="company-title">{{store.name}}</text>
                    <!--  特点-->
                    <view class="advantages">
                        <view class="advantages-list" v-for='(item,index) in advantageList' :key='index' >
                            <image :style="[{marginLeft: item.marginLeft + 'px'}]" :src="item.imageStr"></image>
                            <text>{{item.title}}</text>
                        </view>
                    </view>
                    <!-- 代理商logo -->
                    <view class="company-logo">
                        <image :src="store.logo?store.logo:'/static/images/ic_logo2.png'"></image>
                        <view class="text">已认证</view>
                    </view>
                    <view class="sn-column">
                        <!-- 地址 -->
                        <view class="sn-row-center company-address address">
                            <image src="/static/images/home/address.png"></image>
                            <text>{{store.address}}</text>
                        </view>
                        <!-- 手机号 -->
                        <view class="sn-row-center company-address">
                            <image src="/static/images/home/phone.png"></image>
                            <text>{{store.phone?'联系电话: '+store.phone: ''}}</text>
                        </view>
                    </view>

                    <view class='line-view'></view>
                </view>
            </view>
        </view>
        <view v-if="applyStatus === 0" class="content-view sn-column">
            <text class="title">{{applyName}}</text>
            <view class="progress-view sn-row">
                <view class="sn-column-center left">
                    <image class="checked" src="/static/images/regist/ic_register_check.png"></image>
                    <view class="solid-line"></view>
                    <image class="checked" src="/static/images/regist/ic_register_uncheck.png"></image>
                    <view class="dash-line"></view>
                    <image class="checked" src="/static/images/regist/ic_register_grey.png"></image>
                </view>
                <view class="sn-column-center">
                    <view class="sn-column-center one-view">
                        <text class="text1">注册资料已提交申请</text>
                        <text class="text2">{{applyTime}}</text>
                    </view>
                    <view class="two-view">
                        <text class="text3">等待审核中</text>
                    </view>
                </view>
            </view>
        </view>
        <view v-if="applyStatus === 1 && wxUserInfo&&phoneNumber" class="sn-column">
            <image  class="share-image" :src="store.proCode?store.proCode:''"></image>
            <button class="regist-btn" data-index="1" @click='gohome'>立即进入</button>
        </view>
        <view v-if="(applyStatus === 3 || applyStatus === 2 || !phoneNumber) ||  (applyStatus === 1&&(!wxUserInfo||!phoneNumber))">
            <view class='content-view sn-column'>
                <view class='sub-title'>
                    <text >热卖产品</text>
                </view>
                <view class='hot-product-view'>
                    <view class='hot-product-item' v-for='(item,index) in hotPros'
                          :style="[{marginLeft: (index != 0 ? 10 : 0) + 'px'}]"
                          :key="index">
                        <image :src="item.productPic?item.productPic:'/static/images/ic_no_image.png'"></image>
                        <text class="text ellipsis2">{{item.productName}}</text>
                    </view>
                </view>
                <view style="width: 750rpx;height: 28rpx"></view>
                <view class='sub-title'>
                    <text >经营品类</text>
                </view>
                <scroll-view :scroll-x="true" class="scroll-view">
                    <view class="sn-row">
                        <view class="sn-column scroll-item" :class="[i!==0?'mgl68':'']" v-for="(p,i) in classifyList">
                            <image :src="p.icon?p.icon:'/static/images/ic_no_image.png'"></image>
                            <text>{{p.name}}</text>
                        </view>
                    </view>
                </scroll-view>
            </view>
            <button v-if="wxUserInfo" class="regist-btn sn-row" hover-class="btn-hover" open-type='getPhoneNumber' @getphonenumber="getPhoneNumber">
                <view class="regist-btn">{{loginUser?'立即登录':'立即注册'}}</view>
            </button>
            <button v-else class="regist-btn sn-row"  open-type='getUserInfo' @getuserinfo="getUserinfo" withCredentials="true">
                <view class="regist-btn">用户信息授权</view>
            </button>
        </view>
        </sn-custom-refresh>
    </view>


</template>

<script>

import UniNavBar from '@/components/uni-nav-bar/uni-nav-bar'
import gridsView from './product-swiper/product-grids';
import {mapState} from 'vuex'
import SnSkeleton from '@/components/sn-skeleton/sn-skeleton'
import auth from '@/utils/auth'


export default  {

    components: {
        SnSkeleton,
        UniNavBar,
        gridsView
    },

    data () {
        return {
            store:{
                address: '',
                logo: '',
                name: '',
                phone: ''
            },//商铺信息
            // 代理商优势
            advantageList: [
                {"imageStr": "/static/images/home/advantages2.png","title": "经营资质", "marginLeft": 0},
                {"imageStr": "/static/images/home/advantages1.png","title": "品牌代理", "marginLeft": 15}
                ],
            hotPros: [],
            classifyList:[],
            // 是否已经注册
            isRegist: false,
            swiperList: [],
            phoneNumber: '',
            initParam: this.$storage.get('initParam')
        }
    },
    computed:{
        ...mapState({
            wxUserInfo: state => state.common.wxUserInfo,
            loginUser: state => state.common.loginUser,
            applyStatus: state => state.common.applyStatus,
            applyName: state => state.common.applyName,
            applyTime: state => state.common.applyTime,
            token: state => state.common.token
        }),
    },
    onShareAppMessage(e){
        let secne= `0%26${this.$storage.get('mchId')}%26${this.$storage.get('customerId')}`
        console.log(decodeURIComponent(secne))
        return {
            title: '器械邦邀请码',
            imageUrl: this.store.proCode,
            desc: '器械邦,让全球最优秀的品牌商资源为终端服务',
            path: `/pages/auth-page/splash-page?scene=${secne}`
        }
    },

    onShow(){
        this.phoneNumber = this.$storage.get('phoneNumber')
        if(JSON.stringify(this.$storage.get('loginUser'))==='{}'){
            auth.getLaunchUrl(this.$storage.get('initParam'))
        }
    },
    async onLoad() {
        await this.getStoreInfo()
        await this.getHotProduct()
        await this.getProductCategory()
    },
    methods: {
        /**
         * 刷新界面
         * */
        async onRefresh(){
            await auth.getLaunchUrl(this.$storage.get('initParam'))
            await this.getStoreInfo()
            await this.getHotProduct()
            await this.getProductCategory()
        },
        gohome(){
            uni.redirectTo({
                url: '/pages/home/index'
            })
        },
        /**
         * 获取品类
         * */
        async getProductCategory(){
            let data = await this.$get(this.$api.home.categoryList, {"storeId": this.store.storeId}, false)
            if (data) {
                this.classifyList = data
            }
        },
        /**
         * 获取热卖产品
         * */
        async getHotProduct(){
            let params = {
                current: 1,
                size: 3,
                storeId: this.store.storeId
            }
            let data = await this.$get(this.$api.common.proUnLogin, params, false)
            if(data){
                this.hotPros = data.records
            }
        },
        /**
         * 获取店铺信息
         * */
        async getStoreInfo(){
            let mchId = this.$storage.get('mchId')
            let customerId = this.$storage.get('customerId')
            let data = await this.$get(this.$api.home.storeDetail,{mchId,customerId})
            if(data){
                this.store = data
            }
        },
        /**
         * 获取用户信息授权
         * **/
        async getUserinfo(res) {
            let {detail} = res
            if (detail.errMsg === 'getUserInfo:ok') {
                this.$store.dispatch("common/SETWXUSERINFO",detail.userInfo)
                // console.log('wxUserInfo', this.wxUserInfo)
            } else { // 取消授权
                uni.showToast({
                    icon: 'none',
                    title: '您已拒绝授权',
                    duration: 2000
                })
            }
        },
        /**
         * 通过手机号授权
         * **/
        async getPhoneNumber(e){
            if (e.detail.errMsg === 'getPhoneNumber:ok') {
                let param = {
                    "sign": this.$storage.get('sign'),
                    "iv": e.detail.iv,
                    "nickname": this.wxUserInfo.nickName,
                    "encryptedData": e.detail.encryptedData,
                    "mchId": this.$storage.get('mchId')
                }
                let customerId = this.$storage.get('customerId') || ''
                if(customerId){
                    param = {...param,customerId}
                }
                 let data = await this.$post(this.$api.common.decodeKey,param,false)
                 if(data){
                     this.$storage.set('phoneNumber',data.phoneNumber)
                     if(JSON.stringify(data.tokenInfo) !== '{}'&&customerId){
                         await this.$store.dispatch('common/SETLOGINUSER', data.tokenInfo)
                         this.$storage.set('access_token', data.tokenInfo.access_token)
                         this.$storage.set('mchId', data.tokenInfo.mch_id)
                         uni.reLaunch({
                             url: '/pages/home/index'
                         })
                         return

                     }
                     if(this.applyStatus === 1){
                         uni.reLaunch({
                             url: '/pages/home/index'
                         })
                         return
                     }
                     setTimeout(()=>{
                         uni.navigateTo({
                             url: '/pages/auth-page/auth-info'
                         })
                     },2000)
                 }
            }else {
                this.$util.showToast('您已拒绝授权')
            }
        },

    }
}

</script>

<style lang='scss' scoped>

    .container {
        width: 750rpx;
        height: 100%;
        background-color: #FFFFFF;
        .header {
            background: linear-gradient(to right, #EF3E3D,#C4282F);
            .header-info {
                display: flex;
                flex-direction: column;
                border-top-left-radius: 50rpx;
                border-top-right-radius: 50rpx;
                background-color: #fff;
                position: relative;

                .company-logo {
                    position: absolute;
                    right: 32rpx;
                    top: 40rpx;
                    width: 136rpx;
                    height: 151rpx;
                    image {
                        width: 136rpx;
                        height: 136rpx;
                        border-radius: 50%;
                    }

                    .text {
                        text-align: center;
                        background: linear-gradient(343deg, #C4282F 0%, #EF3E3D 100%);                        color: #fff;
                        width: 94rpx;
                        height: 38rpx;
                        line-height: 38rpx;
                        border-radius: 19rpx;
                        font-size: 22rpx;
                        display: inline-block;
                        position: absolute;
                        bottom: 0rpx;
                        left: 21rpx;
                        color: #fff;
                    }
                }

                .top-info {
                    margin-top: 53rpx;

                    .company-title{
                        margin-left: 32rpx;
                        color: #333333;
                        font-size: 45rpx;
                        font-weight: bold;
                    }

                    .advantages {
                        height: 40rpx;
                        margin-left: 32rpx;
                        margin-top: 17rpx;
                        flex-direction: row;
                        display: flex;

                        .advantages-list {
                            flex-direction: row;
                            display: flex;
                            align-items: center;
                            image {
                                width: 32rpx;
                                height: 32rpx;
                            }
                            text {
                                font-size: 28rpx;
                                font-weight: 400;
                                line-height: 40px;
                                color: #222222;
                                margin-left: 4rpx;
                            }
                        }
                    }

                    .company-address {
                        flex-direction: row;
                        display: inline-block;
                        align-items: center;
                        margin-left: 32rpx;
                        margin-right: 32rpx;
                        //height: 33rpx;
                        image {
                            width: 24rpx;
                            height: 24rpx;
                        }

                        text {
                            font-size: 24rpx;
                            font-weight: 400;
                            color: #888888;
                            margin-left: 10rpx;
                        }
                    }
                    .address {
                        margin-top: 23rpx;
                        align-items: center;
                    }
                    .line-view {
                        width: 686rpx;
                        height: 1rpx;
                        margin-left: 32rpx;
                        background: #E2E2E2;
                        margin-top: 24rpx;
                        opacity: 1;
                    }
                }
            }
        }
        .mgt60{
            margin-top: 60rpx;
        }
        .regist-btn {
            position: fixed;
            left: 40rpx;
            bottom: 40rpx;
            height: 96rpx;
            background: linear-gradient(132deg, #C11920 0%, #EE2626 100%);
            opacity: 1;
            width: 670rpx;
            border-radius: 48rpx;
            text-align: center;
            color: #FFFFFF;
            font-size: 32rpx;
            font-weight: bold;
            line-height: 96rpx;
        }

            .sub-title {
                margin-top: 35rpx;
                text {
                    margin-left: 32rpx;
                    font-size: 38rpx;
                    font-weight: bold;
                    color: #222222;
                    margin-top: 16rpx;
                }
            }

            .hot-product-view {
                flex-direction: row;
                display: flex;
                margin-left: 32rpx;
                margin-top: 24rpx;
                .hot-product-item {
                    flex-direction: column;
                    display: flex;
                    image {
                        width: 216rpx;
                        height: 216rpx;
                        border-radius: 12rpx;
                    }
                    .text{
                        max-width: 216rpx;
                        color: #222222;
                        font-size: 26rpx;
                        font-weight: 500;
                        margin-top: 27rpx;
                    }
                }
            }
            .swiper {
                height: 200rpx;
            }
            .share-image {
                margin-left: 173rpx;
                margin-top: 140rpx;
                width: 404rpx;
                height: 404rpx;
            }
        }
    .content-view{
        .title{
            font-size: 32rpx;
            font-weight: bold;
            color: #222222;
            opacity: 1;
            margin-left: 32rpx;
            margin-top: 40rpx;
        }
        .progress-view{
            width: 750rpx;
            height: 416rpx;
            margin-top: 40rpx;
            margin-left: 32rpx;
            .left{
                margin-top: 40rpx;
                margin-right: 28rpx;
            }
            .one-view{
                width: 476rpx;
                height: 130rpx;
                background: #F7F8FA;
                opacity: 1;
                border-radius: 10rpx;
                position: relative;
                .text1{
                    position: absolute;
                    left: 36rpx;
                    top: 24rpx;
                    font-size: 30rpx;
                    font-weight: 400;
                    color: #222222;
                    opacity: 1;
                }
                .text2{
                    position: absolute;
                    left: 36rpx;
                    top: 74rpx;
                    font-size: 24rpx;
                    font-weight: 400;
                    color: #888888;
                    opacity: 1;
                }
            }
            .two-view{
                width: 476rpx;
                height: 100rpx;
                position: relative;
                background: #F7F8FA;
                margin-top: 50rpx;
                border-radius: 10rpx;
                .text3{
                    position: absolute;
                    left: 36rpx;
                    top: 29rpx;
                    font-size: 30rpx;
                    font-weight: 400;
                    color: #222222;
                    opacity: 1;
                }
            }
            .solid-line{
                width: 0px;
                height: 89rpx;
                border: 3rpx solid #30CDA4;
                opacity: 1;
                margin-top: 17rpx;
                margin-bottom: 17rpx;
            }
            .dash-line{
                width: 0px;
                height: 89rpx;
                border: 3rpx dashed #30CDA4;
                opacity: 1;
                margin-top: 17rpx;
                margin-bottom: 17rpx;
            }
            .checked{
                width: 44rpx;
                height: 44rpx;
            }
        }
    }
    .mgl68{
        margin-left: 63.3rpx;
    }
    .scroll-view{
        width: 670rpx;
        margin-left: 40rpx;
        margin-top: 24rpx;
        align-items: center;
        .scroll-item{
            image{
                width: 120rpx;
                height: 120rpx;
                border-radius: 12rpx;
            }
            text{
                font-size: 26rpx;
                font-weight: 500;
                color: #222222;
                opacity: 1;
                margin-top: 27rpx;
                text-align: center;
            }
        }
    }

</style>
