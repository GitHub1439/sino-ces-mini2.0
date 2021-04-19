<template>
    <view class="container">
        <sn-sticky :offset-top="0" enable="true" z-index="999">
            <view class="list-contaier">
                <view class="sn-row top-view">
                    <view @click="clickTab(index)" :style="{'width': 750/tabs.length +'rpx'}"
                        class="tab-item sn-column-between" v-for="(item,index) in tabs">
                        <text class="text"
                            :class="{'un-select':currentTab !== index}">{{item.text+(item.num!==0?'('+ item.num +')':'')}}</text>
                        <view v-if="currentTab === index" class="bottom-line"></view>
                    </view>
                </view>
            </view>
        </sn-sticky>
        <view class="sn-column" v-if="currentTab === i" v-for="(tab,i) in tabs" :key="i">
            <sn-custom-refresh @refresherrefresh="onRefresh" :is-need-load="isShowLoad(tab)"
                :load-status="tab.loadStatus">
                <view v-if="tab.list.length !== 0" @click="tabClick(item,index)" class="order-item sn-column"
                    v-for="(item,index) in tab.list" :key="index">
                    <view class="sn-row">
                        <image v-if="currentTab === 0" class="check-image" :src="item.isSelect? selectStr: unSelectStr">
                        </image>
                        <text class="order-no ellipsis">订单号：{{item.customerOrderSn}}</text>
                    </view>
                    <view class="sn-column">
                        <view class="sn-row-between info">
                            <image class="image" :src="item.giftPic"></image>
                            <view class="sn-column-between info-text-view">
                                <text class="title ellipsis2">{{item.giftName}}</text>
                                <text class="title-name">{{item.factoryName}}</text>
                                <view class="sn-row-between">
                                    <text class="subtitle">厂家赠品</text>
                                    <text class="num">x {{item.quantity}}</text>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="order-time">
                        <text class="order-no ellipsis">兑换时间：{{item.startExchangeTime+'至'+item.endExchangeTime}}</text>
                    </view>
                </view>
                <sn-nodata v-if="tab.list.length===0" title="暂无赠品数据"></sn-nodata>
                <view style="width: 750rpx;height: 240rpx"></view>
            </sn-custom-refresh>
        </view>
        <view v-if="currentTab === 0" class='submit-address'>
            <cart-item-cell sub-title='请选择收货地址' :show-address="JSON.stringify(addressObj) !== '{}'"
                :address-obj='addressObj' @cellClicked='chooseAddress'>
            </cart-item-cell>
            <view class='submit-view'>
                <view class='total-price-view'>
                    <text class='total-text'>{{selectTotalNum}}件</text>
                </view>
                <view class='submit-text' @click='confirmReciver'>
                    提交
                </view>
            </view>
        </view>

    </view>
</template>
<script>
    import UniNavBar from '@/components/uni-nav-bar/uni-nav-bar'
    import cartItemCell from "./components/cart-item-cell";
    import SnCustomRefresh from '@/components/sn-custom-refresh/sn-custom-refresh'
    export default {
        name: 'index',
        components: {
            SnCustomRefresh,
            UniNavBar,
            cartItemCell
        },
        data() {
            return {
                tabs: [{
                        text: '未领取明细',
                        num: 0,
                        status: 0,
                        current: 1,
                        size: 100000000,
                        queryType: 0,
                        loadStatus: 'loadmore',
                        list: []
                    },
                    {
                        text: '已领取明细',
                        num: 0,
                        status: 2,
                        current: 1,
                        size: 100000000,
                        queryType: 2,
                        loadStatus: 'loadmore',
                        list: []
                    }
                ],
                addressObj: {},
                checkAll: '',
                checkOrder: [],
                checkOrderStr: '',

                currentTab: 0,
                isPayPage: false,
                orderData: {

                },
                triggered: true,
                // 未选中图片
                unSelectStr: "/static/images/home/un-select.png",
                // 选中图片
                selectStr: "/static/images/home/select.png",
                selectTotalNum: 0

            }
        },
        computed: {
            getStatus() {
                return (status) => {
                    let statusText = {
                        0: {
                            text: '待付款',
                            color: '#EE4148',
                            isShowCancle: true,
                            btnText: '付款'
                        },
                        1: {
                            text: '待确认',
                            color: '#EE4148',
                            isShowCancle: false,
                            btnText: ''
                        },
                        2: {
                            text: '待发货',
                            color: '#EE4148',
                            isShowCancle: false,
                            btnText: ''
                        },
                        3: {
                            text: '待收货',
                            color: '#EE4148',
                            isShowCancle: false,
                            btnText: '确认收货'
                        },
                        4: {
                            text: '待核销',
                            color: '#EE4148',
                            isShowCancle: false,
                            btnText: ''
                        },
                        5: {
                            text: '已取消',
                            color: '#EE4148',
                            isShowCancle: false,
                            btnText: ''
                        },
                        6: {
                            text: '已拒绝',
                            color: '#EE4148',
                            isShowCancle: false,
                            btnText: ''
                        }
                    }
                    return statusText[status]
                }
            },
            getGoodsNum() {
                let {
                    tabs
                } = this
                let arr = tabs[0].list
                let num = 0
                arr.forEach(e => {
                    if (e.isSelect) {
                        num = num + e.quantity
                    }
                })
                return num
            },
            isShowLoad() {
                return (tab) => {
                    return tab.list.length >= tab.size
                }
            }
        },
        onLoad(parms) {
            if (JSON.stringify(parms) !== '{}') {
                this.isPayPage = parms.isPayPage
                this.currentTab = Number(parms.cur)
            }
            let that = this;
            uni.$on('updateAddress', (res) => {
                console.log(res)
                that.addressObj = res;
                that.getFreight();
            })
            this.getOrderList()
        },
        methods: {
            /**
             * 单击界面选择
             * */
            tabClick(item, index) {
                if (this.currentTab === 0) {
                    item.isSelect = !item.isSelect
                    let arr = this.tabs[0].list
                    let num = 0
                    arr.forEach(e => {
                        if (this.checkOrder.indexOf(e.orderGiftItemId) === -1) {
                            if (e.isSelect) {
                                this.checkOrder.push(e.orderGiftItemId)
                            }
                        } else {
                            if (!e.isSelect) {
                                this.checkOrder.splice(this.checkOrder.indexOf(e.orderGiftItemId), 1)
                            }
                        }
                        if (e.isSelect) {
                            num = num + e.quantity
                        }
                    })
                    this.selectTotalNum = num
                    this.$forceUpdate()
                }
            },
            // 选择地址
            chooseAddress() {
                uni.navigateTo({
                    url: "/pages-person/address/index?isChooseAddress=" + true
                })
            },
            onRefresh() {
                let that = this
                let item = this.tabs[that.currentTab]
                item.current = 1
                item.loadStatus = 'loadmore'
                that.getOrderList()
            },
            scrollBottem() {
                console.log('bottom---->')
                let that = this
                let item = this.tabs[that.currentTab]
                item.current++
                that.getOrderList()
            },
            /**
             * 确认收货
             * */
            confirmReciver(id) {
                let that = this
                if (this.checkOrder.length === 0) {
                    this.$util.showToast('请选择厂商赠品')
                    return
                }
                if (JSON.stringify(this.addressObj) === '{}') {
                    this.$util.showToast('请选择地址')
                    return
                }
                uni.showModal({
                    title: '温馨提示',
                    content: '是否兑换吗?',
                    confirmText: '确认',
                    cancelText: '取消',
                    complete: async (e) => {
                        if (e.confirm) {
                            let par = {
                                addrId: that.addressObj.id,
                                orderGiftItemIds: that.checkOrder
                            }
                            let data = await this.$post(that.$api.person.giftExchange, par)
                            if (data) {

                                that.$util.showToast('兑换成功');
                                let count = 2
                                let interval = setInterval(() => {
                                    count--
                                    if (count < 0) {
                                        clearInterval(interval)
                                        uni.navigateTo({
                                            url: "/pages-person/order/index?isPayPage=" + true + "&cur=4"
                                        })

                                    }
                                }, 1000);


                                // that.tabs[that.currentTab].current = 1
                                // that.addressObj = {}
                                // that.selectTotalNum = 0
                                // await that.getOrderList(false)
                            }
                        }
                    }
                })
            },
            /**
             * tab页点击事件
             * */
            clickTab(i) {
                this.currentTab = i
                if (this.tabs[this.currentTab].list.length === 0) {
                    this.getOrderList()
                }
                this.$forceUpdate()
            },
            /**
             * 获取订单列表
             * */
            async getOrderList(isDialog = true) {
                let item = this.tabs[this.currentTab]
                let param = {
                    current: item.current,
                    size: item.size,
                    isExchange: this.currentTab
                }
                let data = await this.$get(this.$api.person.giftList, param, isDialog)
                if (data) {
                    if (item.current === 1) {
                        item.list = data.records
                    } else {
                        if (data.records.length === 0) {
                            item.loadStatus = "nomore"
                        } else {
                            item.list = item.list.concat(data.records)
                        }
                    }

                }
            }
        }
    }
</script>

<style lang="scss">
    .list-contaier {
        background-color: #F5F5F7;
    }

    .order-time {
        text-align: right;
        padding: 15rpx 0;
    }

    .sn-row-between {
        color: #333;

        .order-id {
            radio: {
                margin: 0 10rpx;
                width: 28rpx;
            }

            height: 62rpx;
            line-height: 62rpx;
            width: 100%;
        }

        .pro-detail {
            display: flex;
            width: 100%;

            view {
                margin: 10rpx 0;
                color: #777;
            }

            .pro-img {
                flex: 0.2;

                image {
                    width: 100rpx;
                    height: 100rpx;
                    padding: 10rpx;
                }
            }

            .pro-item {
                .pro-item-fname {
                    padding: 4rpx 18rpx;
                    background: #f1f1f1;
                    border-radius: 5rpx;
                }
            }
        }

    }

    .submit-view {
        position: relative;
        bottom: constant(safe-area-inset-bottom);
        bottom: env(safe-area-inset-bottom);
        width: 750rpx;
        height: 109rpx;
        background: #FFFFFF;
        //box-shadow: 0rpx -3rpx 6rpx rgba(226, 231, 242, 0.4);
        flex-direction: row;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .total-price-view {
            flex-direction: row;
            display: flex;
            justify-content: center;
            align-items: center;

            .total-text {
                font-size: 48rpx;
                font-weight: 500;
                color: #C0191F;
                opacity: 1;
                margin-left: 30rpx;
            }

            .price-text {
                color: #C0191F;
                font-size: 48rpx;
                font-weight: 500;
            }

        }

        .submit-text {
            background: linear-gradient(132deg, #C11920 0%, #EE2626 100%);
            align-items: center;
            line-height: 109rpx;
            text-align: center;
            font-size: 32rpx;
            font-weight: bold;
            color: #FFFFFF;
            width: 200rpx;
            height: 109rpx;
        }
    }

    .top-view {
        width: 750rpx;
        height: 98rpx;
        border-radius: 0rpx 0rpx 40rpx 40rpx;
        box-shadow: 0 0 3px #e2e2e2;
        //position: absolute;
        //top: 0;
        background-color: #ffffff;

        .tab-item {
            width: 150rpx;
            height: 100%;
            align-items: center;

            .text {
                font-size: 28rpx;
                font-weight: bold;
                color: #222222;
                margin-top: 34rpx;

                &.un-select {
                    color: #888888;
                }
            }

            .bottom-line {
                width: 40rpx;
                height: 4rpx;
                background: linear-gradient(90deg, #C11920 0%, #EC3A40 100%);
                opacity: 1;
                border-radius: 4rpx 4rpx 0rpx 0rpx;
            }
        }
    }

    .swiper {
        width: 750rpx;
        height: 1334rpx;

        .content {
            width: 750rpx;
            height: 100%;
        }
    }

    .mgb {
        margin-bottom: 32rpx;
    }

    .order-item {
        width: 690rpx;
        background: #FFFFFF;
        box-shadow: 0rpx 8rpx 16rpx rgba(226, 231, 242, 0.4);
        opacity: 1;
        border-radius: 12rpx;
        margin-left: 30rpx;
        margin-top: 24rpx;
        padding-left: 30rpx;
        padding-right: 30rpx;
        padding-top: 28rpx;

        .check-image {
            width: 40rpx;
            height: 40rpx;
            margin-right: 12rpx;
        }

        .order-no {
            // width: 400rpx;
            font-size: 26rpx;
            color: #888888;
        }

        .status-text {
            font-size: 26rpx;
            font-weight: 400;
            color: #EE4148;
            opacity: 1;
        }

        .info {
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
            .info-text-view {
                width: 518rpx;
                height: 132rpx;
                margin-left: 20rpx;
            }

            .image {
                width: 132rpx;
                height: 132rpx;
            }

            .title {
                font-size: 28rpx;
                font-weight: bold;
                color: #222222;
                opacity: 1;
            }

            .subtitle {
                font-size: 24rpx;
                font-weight: bold;
                color: #C0191F;
                opacity: 1;
                margin-top: 5rpx;
            }

            .title-name {
                width: 98rpx;
                height: 36rpx;
                background: #F5F5F5;
                opacity: 1;
                border-radius: 6rpx;
                font-size: 22rpx;
                font-weight: 400;
                line-height: 36rpx;
                color: #333333;
                opacity: 1;
                text-align: center;

            }

            .price {
                color: #FF4D07;
                font-size: 32rpx;
                font-weight: bold;
                color: #222222;
                opacity: 1;
            }

            .num {
                font-size: 28rpx;
                font-family: PingFang SC;
                font-weight: bold;
                color: #222222;
                opacity: 1;

            }
        }

        .total {
            align-items: center;
            justify-content: flex-end;
            margin-top: 20rpx;

            .total-price {
                font-size: 28rpx;
                font-weight: bold;
                color: #222222;
                opacity: 1;
                margin-left: 4rpx;
            }

            .num-text {
                font-size: 24rpx;
                color: #888888;
                opacity: 1;
            }
        }

        .btn-content {
            align-items: center;
            justify-content: flex-end;
            margin-top: 22rpx;

            .empty {
                width: 152rpx;
                height: 68rpx;
                border: 1rpx solid #C11920;
                opacity: 1;
                border-radius: 34rpx;
                font-size: 30rpx;
                line-height: 68rpx;
                text-align: center;
                color: #C11920;

                &.right {
                    margin-right: 36rpx;
                }
            }

            .solid {
                width: 152rpx;
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

    .submit-address {
        position: fixed;
        z-index: 9999;
        bottom: 0;
    }
</style>
