<template>
  <view class="sn-column">
      <view class="navbars-head sn-column" :style="{'height': statusHeight + navHeight + 'px'}" style="position: fixed;z-index: 9999;top: 0">
          <view class="status-view" :style="{'height': statusHeight + 'px'}"></view>
          <view class="sn-row-center navbar" :style="{'height': navHeight + 'px'}">
              <uni-icons @click="goBack" color="#fff" type="back" class="backicon" size="24" />
              <view class="nav-title-left" >
                  我的
              </view>
          </view>
      </view>
      <view class="head-view sn-column">
          <view class="sn-row-between head" :style="{'top': topHeight}">
              <view class="sn-row">
                  <image class="head-image" :src="wxUserInfo.avatarUrl?wxUserInfo.avatarUrl:'/static/images/ic_logo2.png'"></image>
                  <view class="sn-column-between info">
                      <text class="nickname">{{wxUserInfo.nickName}}</text>
                      <text class="phone">{{phoneNumber}}</text>
                  </view>
              </view>
              <view @click.stop="goPersonInfo" class="sn-row">
<!--                 <image @click="goewm" class="set-image isleft" src="/static/images/person/icon_ewm.png" ></image>-->
                  <image class="set-image" src="/static/images/person/icon_sz.png" ></image>
              </view>
          </view>
          <view class="sn-row-between foot">
              <view class="sn-row-center">
                 <image class="vip-image" src="/static/images/person/icon_tjr.png"></image>
                 <text class="tip-text">经销商</text>
                 <text class="tip-line">|</text>
                 <text class="nickname">{{store.name}}</text>
              </view>
              <view @click="goewm" class="tip-btn">查看名片</view>
          </view>
      </view>
      <view class="sn-column">
         <view class="order-content sn-column" :style="{'height':logistics.context?'355rpx':'auto'}">
              <view class="sn-row-center">
                  <view @click="goOrder(item.toPath)" class="sn-column-center menu-item" v-for="(item,index) in menuList" :key="index">
                      <image class="btn-image" :src="item.icon"></image>
                      <text class="text">{{item.text}}</text>
                      <view v-if="item.unread>0" class="unread">{{item.unread}}</view>
                  </view>
              </view>
               <image  v-if="logistics.context" class="order-bg" src="/static/images/person/ic_person_order_bg.png"></image>

              <image class="munu-line" src="/static/images/person/image_ff.png"></image>

              <view v-if="logistics.context" class="sn-row-center msg-view">
                  <view style="width: 20%;">
                      <image class="good-image" src="/static/images/person/icon-logistics.png"></image>
                  </view>
                  <view class="sn-column-between">
                      <text class="good-title">{{logistics.deliveryStatus}}</text>
                      <text class="good-tip ellipsis2">{{logistics.context}}</text>
                  </view>
              </view>
          </view>
          <view class="setting-content">
              <text class="title">服务支持</text>
              <view class="service-list">
                  <view class="sn-row-center">
                      <view @click="goService(item.toPath)" class="sn-column-center service-item" v-for="(item,index) in serviceList.oneList" :key="index">
                          <image class="btn-image" :src="item.icon"></image>
                          <text class="text mgt16">{{item.text}}</text>
                      </view>
                  </view>
                  <view class="sn-row mgt48">
<!--                      <button class="sn-column-center service-item"  :open-type="item.isContact?'contact':''" :plain="true" v-for="(item,index) in serviceList.twoList">-->
<!--                          <image v-if="item.isContact" class="btn-image" :src="'/static/images/person/icon_cjwt.png'"></image>-->
<!--                          <text v-if="item.isContact" class="text">{{'常见问题'}}</text>-->
<!--                      </button>-->
                      <view @click="goService(item.toPath)" class="sn-column-center service-item" v-for="(item,index) in serviceList.twoList" :key="index">
                          <image class="btn-image" :src="item.icon"></image>
                          <text class="text">{{item.text}}</text>
                      </view>
                  </view>
              </view>
          </view>
          <view class="space"></view>
      </view>
      <view v-if="false" @click="loginOut" class="login-out-view">退出登录</view>
      <view class="bottom-line-view" v-if='$util.isIphonex()'></view>
  </view>

</template>

<script>
import {mapState} from 'vuex'
import UniNavBar from '@/components/uni-nav-bar/uni-nav-bar'
export default {
    components: {UniNavBar},
    data(){
       return {
           // 最新物流信息
           logistics:{

           },
           navHeight:'',
           statusHeight:'',
           isiOS:false,
           phoneNumber: this.$storage.get('phoneNumber') || '',
           store: {},
           menuList: [
               {
                   icon: '/static/images/person/icon_dfk.png',
                   text: '待付款',
                   unread: 0,
                   toPath: '/pages-person/order/index?cur=0'
               },
               {
                   icon: '/static/images/person/icon_thh.png',
                   text: '待发货',
                   unread: 0,
                   toPath: '/pages-person/order/index?cur=1'
               },
               {
                   icon: '/static/images/person/icon_dfh.png',
                   text: '待收货',
                   unread: 0,
                   toPath: '/pages-person/order/index?cur=2'
               },
               {
                   icon: '/static/images/person/icon_dhx.png',
                   text: '待核销',
                   unread: 0,
                   toPath: '/pages-person/order/index?cur=3'
               },
               {
                   icon: '/static/images/person/icon_wddd.png',
                   text: '我的订单',
                   unread: 0,
                   toPath: '/pages-person/order/index?cur=4'
               }
           ],
           serviceList:{
               oneList:[
                   {
                       icon: '/static/images/person/icon_shdz.png',
                       text: '收货地址',
                       toPath: '/pages-person/address/index'
                   },
                   {
                       icon: '/static/images/person/icon_kpxx.png',
                       text: '开票信息',
                       toPath: '/pages-person/invoice/index'
                   },
                   {
                       icon: '/static/images/person/icon_cjzp.png',
                       text: '赠品管理',
                       toPath: '/pages-person/gift/gift-manager-index'
                   },
                   {
                       icon: '/static/images/person/icon_wdsx.png',
                       text: '授信管理',
                       toPath: '/pages-person/credit/index'
                   }
               ],
               twoList:[
                   {
                       icon: '/static/images/person/icon_cjwt.png',
                       text: '常见问题',
                       toPath: '/pages-person/faq/index',
                       isContact: true
                   },

               ]
           }
       }
    },
    computed:{
        ...mapState({
            wxUserInfo: state => state.common.wxUserInfo,
        }),
        topHeight(){
            let { navHeight, statusHeight} = this
            let marginTop = navHeight + statusHeight + uni.upx2px(70) + 'px'
            return marginTop
        }
    },
    onShow() {
        this.getDeliveryNew();
    },
    onLoad(){
        this.setNavSize()
        this.getOrderTypeNum()
        this.getStoreInfo()
    },
    methods:{
        onRefresh(){
            this.setNavSize()
            this.getOrderTypeNum()
            this.getStoreInfo()
        },
        /**
         * 获取店铺信息
         * */
        async getStoreInfo(){
            let mchId = this.$storage.get('mchId')
            let data = await this.$get(this.$api.home.storeDetail,{mchId},false)
            if(data){
                this.store = data
            }
        },
        /**
         * 获取最新物流信息
         * */
         async getDeliveryNew(){
            let data =  await this.$get(this.$api.person.deliveryNnew,false)
            if(data){
                this.logistics = data
            }
        },
        /**
         * 查看分享店铺二维码
         * */
        goewm(){
            uni.navigateTo({
                url: '/pages/auth-page/register'
            })
        },
        /**
         * 设置导航栏高度
         * **/
        setNavSize: function() { //设置头部高度
            let sysinfo = wx.getSystemInfoSync()
            this.statusHeight = sysinfo.statusBarHeight
            this.isiOS = sysinfo.system.indexOf('iOS') > -1
            this.navHeight =0
            !this.isiOS ? (this.navHeight = 48) : (this.navHeight = 44)
        },
        /**
         * 跳转订单界面
         * **/
        goOrder(url){
            uni.navigateTo({
                url
            })
        },
        /**
         * 跳转服务支持
         * **/
        goService(url){
            let that = this
            if(url === '/pages-person/invoice/index'){
                this.$util.showToast('开票功能暂未开放')
                return
            }
            if(url === '/pages-person/faq/index'){
                uni.showModal({
                    title: '咨询电话',
                    content: this.store.phone,
                    confirmText:'拨打',
                    complete(e){
                        if(e.confirm){
                            uni.makePhoneCall({
                                phoneNumber: that.store.phone
                            })
                        }
                    }
                })
                return
            }
            uni.navigateTo({
                url
            })
        },
        /**
         * 获取各类型订单数量
         * */
        async getOrderTypeNum(isDialog = false){
            let data = await this.$get(this.$api.person.orderAccount,{},isDialog)
            if(data){
                this.menuList[2].unread = data.unReceivedCount || 0
                this.menuList[0].unread = data.unPaidCount || 0
                this.menuList[1].unread = data.unShippedCount || 0
                this.menuList[3].unread = data.unSettledCount || 0
            }
        },
        /**
         * 退出登录
         * */
        loginOut(){
            let that = this
            uni.showModal({
                title: '温馨提示',
                content: '是否确认退出账号',
                cancelText: '取消',
                confirmText: '确认',
                complete:async (e)=>{
                    if(e.confirm){
                        that.$storage.remove('phoneNumber')
                        uni.reLaunch({
                            url: '/pages/auth-page/register'
                        })
                    }
                }
            })
        },
        /**
         * 返回界面
         * */
        goBack(){
            uni.navigateBack({
                    delta: 1
            })
        },
        goPersonInfo(){
            uni.navigateTo({
                url: '/pages-person/info/person-info'
            })
        }
   }
}
</script>

<style lang="scss">
    page{
        background-color: #F5F5F7;
    }
    .status-view{
        width: 750rpx;
    }
    /* -------- 头部 --------- */
    .head-view {
        width: 750rpx;
        height: 466rpx;
        position: relative;
        background-image: url($ic_person_bg);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        .head-image{
            width: 108rpx;
            height: 108rpx;
            border-radius: 50%;
            border: 4rpx solid #fff;
        }
        .head{
            position: absolute;
            width: 750rpx;
            left: 0;
            top: 0;
            padding-left: 30rpx;
            padding-right: 30rpx;
            .info{
                margin-left: 30rpx;
            }
            .nickname{
                font-size: 40rpx;
                font-weight: bold;
                color: #FFFFFF;
                -webkit-text-stroke: 1 rgba(0, 0, 0, 0);
                text-stroke: 1 rgba(0, 0, 0, 0);
            }
            .phone{
                font-size: 26rpx;
                font-weight: 400;
                color: #FFFFFF;
                -webkit-text-stroke: 1 rgba(0, 0, 0, 0);
                text-stroke: 1 rgba(0, 0, 0, 0);
            }
            .set-image{
                width: 48rpx;
                height: 48rpx;
                &.isleft{
                    margin-right: 32rpx;
                }
            }
        }
        .foot{
            position: absolute;
            bottom: 31rpx;
            left: 42rpx;
            width: 646rpx;
            height: 56rpx;
            align-items: center;
            .vip-image{
                width: 56rpx;
                height: 56rpx;
            }
            .tip-text{
                font-size: 28rpx;
                font-weight: 500;
                color: #FFFFFF;
                margin-left: 4rpx;
            }
            .tip-line{
                margin-left: 20rpx;
                margin-right: 20rpx;
                color: #FFFFFF;
                opacity: 0.29;
            }
            .nickname{
                font-size: 28rpx;
                color: #FFFFFF;
                opacity: 0.61;
            }
            .tip-btn{
                width: 128rpx;
                height: 40rpx;
                background: linear-gradient(137deg, #FFD097 0%, #EFB373 100%);
                border-radius: 90rpx;
                font-size: 22rpx;
                line-height: 40rpx;
                text-align: center;
                color: #222222;
            }
        }

    }

    .navbars-head {
        width: 750rpx;
        background-image: url($ic_person_bg);
        background-repeat: repeat;
        background-size: 100%;
        position: fixed;
        z-index: 9999;
        top: 0
    }

    .backicon{
        width: 42rpx;
        height: 42rpx;
        margin-left: 20rpx;

    }
    .nav-title-left{
        font-size: 48rpx;
        font-weight: bolder;
        color: #fff;
        margin-left: 22rpx;
    }
    .order-content{
        position: relative;
        width: 690rpx;
        margin-left: 30rpx;
        margin-top: 39rpx;
        padding-top: 40rpx;
        padding-bottom: 32rpx;
        background: #FFFFFF;
        box-shadow: 0px 8px 16px rgba(226, 231, 242, 0.4);
        opacity: 1;
        border-radius: 12rpx;
        align-items: center;
        .msg-view{
            position: absolute;
            width: 586rpx;
            height: 100rpx;
            left: 52rpx;
            bottom: 53rpx;
            .good-image{
                // width: 100rpx;
                // height: 100rpx;
                width: 80rpx;
                height: 80rpx;
            }
            .good-title{
                font-size: 28rpx;
                font-weight: bold;
                color: #222222;
                margin-left: 24rpx;
            }
            .good-tip{
                font-size: 24rpx;
                font-weight: 400;
                color: #888888;
                margin-left: 24rpx;
            }
        }
        .btn-image{
            width: 52rpx;
            height: 52rpx;
        }
        .order-bg{
            width: 626rpx;
            height: 155.12rpx;
            position: absolute;
            bottom: 32rpx;
        }
        .munu-line{
            width: 40rpx;
            height: 112rpx;
            position: absolute;
            top: 35rpx;
            right: 135rpx;
        }
        .menu-item{
            width: 138rpx;
            position: relative;
            .unread{
                position: absolute;
                min-width: 34rpx;
                top: -10rpx;
                right: 20rpx;
                height: 28rpx;
                padding-left: 5rpx;
                padding-right: 5rpx;
                border: 2rpx solid #FFFFFF;
                background: linear-gradient(42deg, #FF5734 0%, #FF3636 100%);
                box-shadow: 0px 4px 8px rgba(255, 88, 88, 0.2);
                border-radius: 16rpx;
                font-size: 22rpx;
                font-weight: bold;
                line-height: 26rpx;
                text-align: center;
                color: #FFFFFF;
            }
        }
        .text{
            font-size: 26rpx;
            font-weight: bold;
            color: #666666;
            margin-top: 20rpx;
        }
    }
    .setting-content{
        position: relative;
        width: 690rpx;
        height: 407rpx;
        background: #FFFFFF;
        box-shadow: 0px 8px 16px rgba(226, 231, 242, 0.4);
        opacity: 1;
        border-radius: 12rpx;
        margin-top: 40rpx;
        margin-left: 30rpx;
        .service-list{
            position: absolute;
            top: 118rpx;
        }
        .mgt48{
            margin-top: 48rpx;
        }
        .title{
            position: absolute;
            font-size: 32rpx;
            font-weight: bold;
            color: #000000;
            left: 34rpx;
            top: 31rpx;
        }
        .service-item{
            width: 172.5rpx;
            background-color: white;
            border: none;
            box-sizing: border-box;
        }
        .btn-image{
            width: 52rpx;
            height: 52rpx;
        }
        .text{
            font-size: 26rpx;
            font-weight: bold;
            color: #666666;
        }
    }
    .mgt16{
        margin-top: 16rpx;
    }
    .space{
        width: 750rpx;
        height: 109rpx;
        margin-top: 40rpx;
    }
    .login-out-view{
        position: fixed;
        z-index: 99;
        bottom: constant(safe-area-inset-bottom);
        bottom: env(safe-area-inset-bottom);
        width: 750rpx;
        height: 109rpx;
        background: #FFFFFF;
        font-size: 32rpx;
        font-weight: bold;
        line-height: 109rpx;
        color: #C11920;
        text-align: center;
        box-shadow: 0px 8px 16px rgba(226, 231, 242, 0.4);
    }
    .bottom-line-view {
        height: 68rpx;
        background-color: #FFFFFF;
        width: 100%;
        position: fixed;
        bottom: 0;
        z-index: 99;
    }
    ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
    }
</style>
