<template>
    <view class="sn-column">
         <view class="item-view sn-column" v-for="(item,index) in msgList" :class="{'mgb': index === msgList.length - 1}">
             <view class="time">2020-02-24 09:00</view>
             <view class="msg-view sn-column">
                 <view class="sn-row-center">
                     <image src="/static/images/person/icon_khzb.png"></image>
                     <text class="title">订单更新</text>
                 </view>
                 <view class="sn-row msg-item">
                     <text class="sb-title">订单号:</text>
                     <text class="content">20831291381</text>
                 </view>
                 <view class="sn-row msg-item">
                     <text class="sb-title">状态:</text>
                     <text class="content">已发货</text>
                 </view>
                 <view class="sn-row msg-item">
                     <text class="sb-title">快递公司:</text>
                     <text class="content">顺丰物流</text>
                 </view>
                 <view class="sn-row msg-item">
                     <text class="sb-title">物流单号:</text>
                     <text class="content">23928121232</text>
                 </view>
                 <view class="sn-row msg-item">
                     <text class="sb-title">收货地址:</text>
                     <text class="content">湖南省长沙市岳麓区</text>
                 </view>
                 <text class="bottom-text">近期敬请查收!</text>
             </view>
         </view>
    </view>
</template>

<script>
export default {
    data(){
        return {
            msgList: [1,2,3,4,5]
        }
    },
    onPullDownRefresh(){
        setTimeout(()=>{
            uni.stopPullDownRefresh()
        },500)
    },
    onReachBottom(){
        this.$util.showToast('触发底部事件')
    },
    onLoad(){

    },
    methods:{

    }
}
</script>

<style scoped lang="scss">
     .item-view{
         width: 690rpx;
         margin-left: 30rpx;
         align-items: center;
         &.mgb{
             margin-bottom: 32rpx;
         }
         .time{
             min-width: 112rpx;
             height: 56rpx;
             background: #EEEEEF;
             border-radius: 48rpx;
             font-size: 24rpx;
             line-height: 56rpx;
             text-align: center;
             color: #888888;
             margin-top: 24rpx;
             padding-left: 24rpx;
             padding-right: 24rpx;
         }
         .msg-view{
             width: 690rpx;
             background: #FFFFFF;
             box-shadow: 0rpx 8rpx 16rpx rgba(226, 231, 242, 0.4);
             opacity: 1;
             border-radius: 12rpx;
             margin-top: 24rpx;
             padding-left: 23rpx;
             padding-top: 28rpx;
             padding-right: 23rpx;
             padding-bottom: 28rpx;
             image{
                 width: 56rpx;
                 height: 56rpx;
             }
             .title{
                 font-size: 32rpx;
                 font-weight: bold;
                 color: #444444;
                 margin-left: 20rpx;
             }
             .msg-item{
                 margin-top: 24rpx;
                 margin-left: 76rpx;
                 .sb-title{
                     min-width: 130rpx;
                     font-size: 26rpx;
                     font-weight: 400;
                     color: #787D88;
                     opacity: 1;
                 }
                 .content{
                     font-size: 26rpx;
                     color: #222222;
                     opacity: 1;
                 }
             }
         }
     }
     .bottom-text{
         margin-left: 76rpx;
         margin-top: 24rpx;
         font-size: 26rpx;
         font-weight: 400;
         color: #787D88;
         opacity: 1;
     }
</style>
