<template>
    <view class="container">

        <uni-nav-bar @clickLeft="leftClicked"
                     left-icon="back"
                     color="#222222"
                     :is-need-back="false"
                     title="我的订单"></uni-nav-bar>

        <sn-sticky :offset-top="0" enable="true" z-index="999">
            <view class="list-contaier">
                <view class="sn-row top-view">
                    <view @click="clickTab(index)" :style="{'width': 750/tabs.length +'rpx'}" class="tab-item sn-column-between" v-for="(item,index) in tabs">
                        <text class="text" :class="{'un-select':currentTab !== index}">{{item.text+(item.num!==0?'('+ item.num +')':'')}}</text>
                        <view v-if="currentTab === index" class="bottom-line"></view>
                    </view>
                </view>
            </view>
        </sn-sticky>
            <view class="sn-column" v-if="currentTab === i" v-for="(tab,i) in tabs" :key="i">
                <sn-custom-refresh
                    :distance-type="1"
                    @refresherrefresh="onRefresh"
                    @scrolltolower="scrollBottem"
                    :is-need-load="isShowLoad(tab)"
                    :load-status="tab.loadStatus">
                <view v-if="tab.list.length !== 0" @click.stop="goDetail(item)" class="order-item sn-column"  v-for="(item,index) in tab.list" :key="index">
                    <view class="sn-row-between">
                        <view class="sn-row-center" @click.stop="copyClicked(item)">
                            <text class="order-no ellipsis">订单号:{{item.orderSn}}</text>
                            <image class="copy-image" src="/static/images/cart/copy.png"></image>
                        </view>
                        <text class="status-text" :style="{'color': getStatus(item.status).color}">{{getStatus(item.status).text}}</text>
                    </view>
                    <view class="sn-column" v-for="(orderItems,i) in item.orderItems" :key="i">
                        <view class="sn-row-between info">
                            <image class="image" :src="orderItems.productPic?orderItems.productPic:'/static/images/ic_no_image.png'"></image>
                            <view class="sn-column-between">
                                <text class="title ellipsis2">{{orderItems.productName}}</text>
                                <view class="sn-row-between">
                                    <text class="price">¥ {{orderItems.realPrice}}</text>
                                    <text class="num">x {{orderItems.quantity}}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view v-if="item.factoryGifts&&item.factoryGifts.length>0" class="sn-column" v-for="(giftItems,i) in item.factoryGifts" :key="i">
                        <view class="sn-row-between info">
                            <image class="image" :src="giftItems.giftPic?giftItems.giftPic:'/static/images/ic_no_image.png'"></image>
                            <view class="sn-column-between info-text-view">
                                <view class="sn-column">
                                    <text class="title ellipsis2">{{giftItems.giftName}}</text>
                                    <view class="sn-row-center">
                                        <image style="width: 58rpx;height: 32rpx;" src="/static/images/home/activity.png"></image>
                                        <text class="subtitle mgl10">{{giftItems.activityName}}</text>
                                    </view>
                                </view>
                                <view class="sn-row-between">
                                    <text class="subtitle">厂家赠品</text>
                                    <text class="num">x {{giftItems.quantity}}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="sn-row total">
                        <text class="num-text">优惠:¥{{item.promotionAmount+',运费:¥'+item.transportAmount}}</text>
                    </view>
                    <view class="sn-row total">
                        <text class="num-text">共{{getGoodsNum(item.orderItems,item.factoryGifts)+'件商品 需支付'}}</text>
                        <text class="total-price">￥{{item.payAmount}}</text>
                    </view>
                    <view class="sn-row btn-content">
                        <view @click.stop="cancleOrder(item)" v-if="getStatus(item.status).isShowCancle" class="empty" :class="{'right':true}">取消</view>
                        <view @click.stop="operate(item)" v-if="getStatus(item.status).btnText" class="solid">{{getStatus(item.status).btnText}}</view>
                        <view @click.stop="againBuy(item)" v-if="i === 4&&Number(item.orderType) !==1" class="solid againBuy">再次购买</view>
                         <view @click.stop="goLogisticeDetail(item)" v-if="i === 2" class="solid againBuy">查看物流</view>
                    </view>
                </view>
                    <view class="bottom-line-view"></view>

                    <sn-nodata  v-if="tab.list.length===0" title="暂无订单"></sn-nodata>
                </sn-custom-refresh>
            </view>
    </view>
</template>
<script>
import UniNavBar from '@/components/uni-nav-bar/uni-nav-bar'
import SnCustomRefresh from '@/components/sn-custom-refresh/sn-custom-refresh'
export default {
    name: 'index',
    components: {SnCustomRefresh, UniNavBar},
    data(){
        return {
                // queryType 0, // 待支付
                // 1, // 待确认
                // 2, //待发货
                // 3, //已发货
                // 4, //已完成（已收货）
                // 5, //已取消
                // 6, //已拒绝
            tabs:[
                {
                    text: '待付款',
                    num: 0,
                    status: 0,
                    current: 1,
                    size: 10,
                    queryType: 0,
                    loadStatus: 'loadmore',
                    list:[]
                },
                {
                    text: '待发货',
                    num: 0,
                    status: 2,
                    current: 1,
                    size: 10,
                    queryType: 2,
                    loadStatus: 'loadmore',
                    list:[]
                },
                {
                    text: '待收货',
                    num: 0,
                    status: 3,
                    current: 1,
                    size: 10,
                    queryType: 3,
                    loadStatus: 'loadmore',
                    list: []
                },
                {
                    text: '待核销',
                    num: 0,
                    status: 4,
                    current: 1,
                    size: 10,
                    queryType: 10,
                    loadStatus: 'loadmore',
                    list: []
                },
                {
                    text: '全部',
                    num: 0,
                    status: -1,
                    current: 1,
                    size: 10,
                    queryType: -1,
                    loadStatus: 'loadmore',
                    list:[]
                }
            ],
            currentTab: 0,
            isPayPage: false,
            triggered: true,
            statusHeight: 0,
            navHeight: 0,
            isiOS: false

        }
    },
    computed:{
        getStatus(){
            return (status)=>{
                let statusText = {
                    0: {text: '待付款',color: '#EE4148',isShowCancle: true,btnText:'付款'},
                    1: {text: '待确认',color: '#EE4148',isShowCancle: false,btnText:''},
                    2: {text: '待发货',color: '#EE4148',isShowCancle: false,btnText:''},
                    3: {text: '待收货',color: '#EE4148',isShowCancle: false,btnText:'确认收货'},
                    4: {text: '已收货',color: '#EE4148',isShowCancle: false,btnText:''},
                    5: {text: '已取消',color: '#EE4148',isShowCancle: false,btnText:''},
                    6: {text: '已拒绝',color: '#EE4148',isShowCancle: false,btnText:''}
                }
                return statusText[status]
            }
        },
        getGoodsNum(){
            return (arr,giftArr)=>{
                let num = 0
                arr.forEach(e=>{
                    num = num + e.quantity
                })
                giftArr.forEach(e=>{
                    num = num + e.quantity
                })
                return num
            }
        },
        getHeight(){
            let {statusHeight,navHeight} = this
            let height = uni.upx2px(98)
            return statusHeight + navHeight + height
        },
        isShowLoad(){
            return (tab)=>{
                return tab.list.length >= tab.size
            }
        }
    },
    onLoad(parms){
        if (JSON.stringify(parms) !== '{}') {
            this.isPayPage = parms.isPayPage
            this.currentTab = Number(parms.cur)
        }
        this.getOrderList()
        this.getOrderTypeNum()
        let sysinfo = wx.getSystemInfoSync()
        this.statusHeight = sysinfo.statusBarHeight
        this.isiOS = sysinfo.system.indexOf('iOS') > -1
        this.navHeight = 0
        !this.isiOS ? (this.navHeight = 48) : (this.navHeight = 44)
    },
    methods:{
        // 跳转物流详情页面
        goLogisticeDetail(item) {
            // uni.navigateTo({
            //     url: `/pages-person/order/logistice-detail?logisticeList=`+encodeURIComponent(JSON.stringify(this.logisticeDetail))+"&addr="+encodeURIComponent(this.detail.receiverDetailAddress)
            // })
            console.log('item',item);
            uni.navigateTo({
                url: `/pages-person/order/logistice-detail?orderID=`+encodeURIComponent(item.id)
            })
        },
        /**
         *  点击复制订单号
         */
        copyClicked (item) {
            uni.setClipboardData({
                data: item.orderSn,
                success: function(res) {
                    uni.hideToast();
                    uni.getClipboardData({
                        success: function(res) {
                            uni.showToast({
                                title: "已复制到剪贴板",
                                icon: "none"
                            })
                        }
                    })
                }
            })
        },
        /// 返回事件
        leftClicked () {

            if (this.isPayPage) {
                uni.reLaunch({
                    url: "/pages/home/index"
                })
            }else {
                uni.navigateBack({
                    delta: 1
                })
            }
        },
        onRefresh(){
            let that = this
            let item = this.tabs[that.currentTab]
            item.current = 1
            item.loadStatus = 'loadmore'
            this.triggered = false
            that.getOrderList()
            that.getOrderTypeNum()
        },
        scrollBottem(){
            console.log('bottom---->')
            let that = this
            this.triggered = false;
            let item = this.tabs[that.currentTab]
            item.current ++
            that.getOrderList()
        },
        goDetail(item){
            uni.navigateTo({
                url: `/pages-person/order/order-detail?id=${item.id}`
            })
        },
        /**
         * 订单操作
         * */
        operate(item){
            console.log(item)

            if(item.status === 0){
                uni.navigateTo({
                    url: `/pages-home/pay/index?price=${item.payAmount}&orderSn=${item.orderSn}&orderId=${item.id}&back=${true}`
                })
            }else if(item.status  === 3){
                this.confirmReciver(item.id)
            }else if(item.status  === 4){

            }
        },
        /**
         * 再次购买
         * */
        againBuy (item) {

            this.fetchData(item)
        },
        /// 购物车数量加减
        async fetchData (value) {
            let parms = {
                "id": value.id,
            }
            let data = await this.$post(this.$api.person.againBuyOrder, parms, true);
            if (data) {
                uni.navigateTo({
                    url: "/pages/cart/index"
                })
            }
        },
        /**
         * 确认收货
         * */
        confirmReciver(id){
            let that = this
            uni.showModal({
                title: '温馨提示',
                content: '是否确认收货?',
                confirmText:'确认',
                cancelText: '取消',
                complete:async (e)=>{
                    if(e.confirm){
                        let data = await this.$post(that.$api.person.confirmRecive,{id})
                        if(data){
                            that.$util.showToast('确认成功')
                            that.tabs[that.currentTab].current = 1
                            await that.getOrderTypeNum(false)
                            await that.getOrderList(false)
                        }
                    }
                }
            })
        },
        /**
         * 取消订单
         * */
        async cancleOrder(item){
            let that = this
            uni.showModal({
                title: '温馨提示',
                content: '是否确认取消订单?',
                confirmText:'确认',
                cancelText: '取消',
                success: async (e)=>{
                    if(e.confirm){
                        let data = await this.$post(that.$api.person.cancelOrder,{id:item.id})
                        if(data){
                            that.$util.showToast('取消成功')
                            that.tabs[that.currentTab].current = 1
                            await that.getOrderTypeNum(false)
                            await that.getOrderList(false)
                        }
                    }
                }
            })
        },
        /**
         * tab页点击事件
         * */
        clickTab(i){
            this.currentTab = i
            if (this.tabs[this.currentTab].list.length === 0) {
                this.getOrderList()
            }
            this.$forceUpdate()
        },
        /**
         * 获取各类型订单数量
         * */
        async getOrderTypeNum(isDialog = true){
            let data = await this.$get(this.$api.person.orderAccount,{},isDialog)
            if(data){
                this.tabs[4].num = data.allCount || 0
                this.tabs[0].num = data.unPaidCount || 0
                this.tabs[1].num = data.unShippedCount || 0
                this.tabs[2].num = data.unReceivedCount || 0
                this.tabs[3].num = data.unSettledCount || 0
            }
        },
        /**
         * 获取订单列表
         * */
        async getOrderList(isDialog = true){
            let item = this.tabs[this.currentTab]
            let param = {
                current: item.current,
                size: item.size
            }
            param = item.queryType !== -1? {...param,queryType: item.queryType}:param
            let data = await this.$get(this.$api.person.orderList, param,isDialog)
            if(data){
                if(item.current === 1){
                    item.list = data.records
                }else {
                    if(data.records.length ===0){
                        item.loadStatus = "nomore"
                    }else {
                        item.list = item.list.concat(data.records)
                    }
                }

            }
        }
    }
}
</script>

<style lang="scss">
    .list-contaier{
        background-color: #F5F5F7;
    }
    .top-view{
        width: 750rpx;
        height: 98rpx;
        border-radius: 0rpx 0rpx 40rpx 40rpx;
        box-shadow: 0 0 3px #e2e2e2;
        //position: absolute;
        //top: 0;
        background-color: #ffffff;
        .tab-item{
            width: 150rpx;
            height: 100%;
            align-items: center;
            .text{
                font-size: 28rpx;
                font-weight: bold;
                color: #222222;
                margin-top: 34rpx;
                &.un-select{
                    color: #888888;
                }
            }
            .bottom-line{
                width: 40rpx;
                height: 4rpx;
                background: linear-gradient(90deg, #C11920 0%, #EC3A40 100%);
                opacity: 1;
                border-radius: 4rpx 4rpx 0rpx 0rpx;
            }
        }
    }
    .swiper{
        width: 750rpx;
        height: 1334rpx;
        .content{
            width: 750rpx;
            height: 100%;
        }
    }
    .bottom-line-view{
        width: 750rpx;
        height: 34rpx;
    }
    .mgb{
        margin-bottom: 32rpx;
    }
    .mgl10{
        margin-left: 10rpx;
    }
    .order-item{
        width: 690rpx;
        background: #FFFFFF;
        box-shadow: 0rpx 8rpx 16rpx rgba(226, 231, 242, 0.4);
        opacity: 1;
        border-radius: 12rpx;
        margin-left: 30rpx;
        margin-top: 32rpx;
        padding-left: 30rpx;
        padding-right: 30rpx;
        padding-top: 28rpx;
        padding-bottom: 28rpx;
        .order-no{
            width: 400rpx;
            font-size: 26rpx;
            color: #888888;
        }
        .status-text{
            font-size: 26rpx;
            font-weight: 400;
            color: #EE4148;
            opacity: 1;
        }
        .info{
            width: 630rpx;
            height: 132rpx;
            margin-top: 24rpx;
            //border-bottom: 1rpx solid #F6F7FA;
            //background-color: #F6F7FA;
            //padding-left: 10rpx;
            //padding-right: 10rpx;
            //padding-top: 4rpx;
            //padding-bottom: 4rpx;
            //border-radius: 10rpx;
            .subtitle{
                font-size: 24rpx;
                font-weight: bold;
                color: #444444;
                opacity: 1;
                margin-top: 5rpx;
            }
            .image{
                width: 132rpx;
                height: 132rpx;
            }
            .title{
                width: 477rpx;
                font-size: 28rpx;
                font-weight: bold;
                color: #444444;
                opacity: 1;
            }
            .price{
                font-size: 32rpx;
                font-weight: bold;
                color: #222222;
                opacity: 1;
            }
            .num{
                font-size: 26rpx;
                font-weight: 400;
                color: #888888;
                opacity: 1;
            }
        }
        .total{
            align-items: center;
            justify-content: flex-end;
            margin-top: 20rpx;
            .total-price{
                font-size: 28rpx;
                font-weight: bold;
                color: #222222;
                opacity: 1;
                margin-left: 4rpx;
            }
            .num-text{
                font-size: 24rpx;
                color: #888888;
                opacity: 1;
            }
        }
        .btn-content{
            align-items: center;
            justify-content: flex-end;
            .empty{
                min-width: 152rpx;
                padding-left: 15rpx;
                padding-right: 15rpx;
                margin-top: 22rpx;
                height: 68rpx;
                border: 1rpx solid #C11920;
                opacity: 1;
                border-radius: 34rpx;
                font-size: 30rpx;
                line-height: 68rpx;
                text-align: center;
                color: #C11920;
                &.right{
                    margin-right: 36rpx;
                }
            }
            .againBuy {
                margin-left: 36rpx;
            }
            .solid{
                margin-top: 22rpx;
                min-width: 152rpx;
                padding-left: 30rpx;
                padding-right: 30rpx;
                height: 68rpx;
                background: linear-gradient(141deg, #C11920 0%, #EC3A40 100%);
                opacity: 1;
                border-radius: 34rpx;
                font-size: 30rpx;
                line-height: 68rpx;
                text-align: center;
                color: #FFFFFF;
            }
        }
    }
    .copy-image {
        width: 32rpx;
        height: 32rpx;
    }
</style>
