<template>
    <view class="sn-column">
        <view class="sn-row-between item-view mgt20">
            <view class="sn-row">
                <text class="order-title">订单号:</text>
                <text class="order-no mgl10">{{detail.orderSn}}</text>
            </view>
            <text :style="{'color': getStatus(detail.status).color}">{{getStatus(detail.status).text}}</text>
        </view>
        <!--物流信息-->
   <view class="sn-column mgt20" v-if="detail.status == 3 && logisticeDetail[0]">
            <view class="sn-row-between info" style="overflow: hidden;">
                <view style="display: flex;align-items: center;">
                    <image class="image" src="/static/images/person/icon-logistics.png"
                        style="width: 38px;height: 38px;"></image>
                </view>
                <view class="sn-column-between info-text-view">
                    <text class="title ellipsis2">{{logisticeDetail[0].deliveryStatus}}</text>
                    <view class="sn-row-between">
                        <text class="newlogistice"
                            style="color: #888888;font-size: 14px;width: 69%;height: 37px;">{{logisticeDetail[0].context}}</text>
                        <text @click="goLogisticeDetail"
                            style="height: 20px;border: 1px solid #f8f8f8;padding: 8rpx;border-radius: 6px;">查看物流</text>
                    </view>
                </view>
            </view>
        </view>
        <view v-if="detail.receiverName" class="sn-column item-view-addr mgt20">
            <view class="sn-row-between">
                <view class="sn-row-center">
                    <text class="name">{{detail.receiverName? detail.receiverName: '未知'}}</text>
                    <text class="phone">{{detail.receiverPhone}}</text>
                </view>
            </view>
            <view class="sn-row-between addr-content">
                <view class="addr"><text>{{detail.receiverDetailAddress}}</text></view>
            </view>
        </view>


        <!--<view class="head-title">商品信息</view>-->
        <view class="sn-column" :class="[i===0?'mgt20':'']" v-for="(orderItems,i) in detail.orderItems" :key="i">
            <view class="sn-row-between info">
                <image class="image" :src="orderItems.productPic"></image>
                <view class="sn-column-between info-text-view">
                    <text class="title ellipsis2">{{orderItems.productName}}</text>
                    <view class="sn-row-between">
                        <text class="price">¥ {{orderItems.realPrice}}</text>
                        <text class="num">x {{orderItems.quantity}}</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="sn-column" v-for="(giftItems,i) in detail.factoryGifts" :key="i">
            <view class="sn-row-between info">
                <image class="image" :src="giftItems.giftPic"></image>
                <view class="sn-column-between info-text-view">
                    <view class="sn-column">
                        <text class="title ellipsis2">{{giftItems.giftName}}</text>
                        <view class="sn-row-center">
                            <image style="width: 58rpx;height: 32rpx" src="/static/images/home/activity.png"></image>
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
        <view class="sn-row-between item-view mgt20">
            <text class="order-title">商品总金额:</text>
            <text class="order-no">¥{{detail.totalAmount}}</text>
        </view>
        <view class="sn-row-between item-view">
            <text class="order-title">优惠金额:</text>
            <text class="order-no">¥{{detail.promotionAmount}}</text>
        </view>
        <view class="sn-row-between item-view">
            <text class="order-title">订单金额:</text>
            <text class="order-no">¥{{detail.orderAmount}}</text>
        </view>
        <view class="sn-row-between item-view">
            <text class="order-title">运费:</text>
            <text class="order-no">¥{{detail.transportAmount}}</text>
        </view>
        <view class="sn-row-between item-view">
            <text class="order-title">支付总金额:</text>
            <text class="order-no">¥{{detail.payAmount}}</text>
        </view>
        <view class="sn-row-between item-view mgt20">
            <text class="order-title">配送方式:</text>
            <text class="order-no">{{getPeisong(detail.deliveryWay)}}</text>
        </view>
        <view class="sn-row-between item-view">
            <text class="order-title">快递公司:</text>
            <text class="order-no">{{getCompany(detail.deliveryCompany)}}</text>
        </view>
        <view class="sn-row-between item-view">
            <text class="order-title">快递单号:</text>
            <text class="order-no">{{detail.deliverySn}}</text>
        </view>
        <view v-if="detail.status >3" class="sn-row-between item-view mgt20">
            <text class="order-title">发票抬头:</text>
            <text class="order-no"></text>
        </view>
        <view class="sn-row-between item-view mgt20">
            <text class="order-title">买家备注:</text>
            <text class="order-no">{{detail.buyerNote}}</text>
        </view>
        <view class="sn-row-between item-view">
            <text class="order-title">商家备注:</text>
            <text class="order-no">{{detail.sellerNote}}</text>
        </view>
        <view class="sn-row-between item-view mgt20">
            <text class="order-title">订单时间:</text>
            <text class="order-no">{{detail.orderTime}}</text>
        </view>
        <view class="sn-row-between item-view mgt20" style="height: 100rpx">
            <text class="order-title">上传凭证:</text>
            <view @click="getCamera" class="uploading-btn">上传</view>
        </view>
        <view class="sn-column-center mgt20 mgb20">
            <view v-if="getStatus(detail.status).btnText" @click.stop="operate(detail)" class="btn small-btn">
                {{getStatus(detail.status).btnText || ''}}
            </view>
            <view @click.stop="cancleOrder(detail.id)" class="btn mgt20 mgb20"
                v-if="getStatus(detail.status).isShowCancle">{{'取消'}}</view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "order-detail",
        data() {
            return {
                logisticeDetail: [],
                detail: {
                    status:'',
                    orderSn: '',
                    receiverName: '',
                    receiverPhone: '',
                    receiverDetailAddress: '',
                    totalAmount: '0.00',
                    promotionAmount: '0.00',
                    orderAmount: '0.00',
                    transportAmount: '0.00',
                    payAmount: '0.00'
                }
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
                            text: '已收货',
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
            getCompany() {
                return (delivery_company) => {
                    let deliverys = {
                        1: '中通快递',
                        2: '申通快递',
                        3: '邮政快递包裹',
                        4: '顺丰速运',
                        5: 'EMS'
                    }
                    return deliverys[Number(delivery_company)] || ''
                }
            },
            getPeisong() {
                return (peisong) => {
                    let peisongs = {
                        0: '商家配送',
                        1: '物流快递'
                    }
                    return peisongs[peisong] || ''
                }
            }
        },
        onLoad(e) {
            this.detail.orderID = e.id
            this.getOrderDetail(e.id)
            this.getLogisticeDetail(e.id)
        },
        methods: {
            // 跳转物流详情页面
            goLogisticeDetail() {
                // uni.navigateTo({
                //     url: `/pages-person/order/logistice-detail?logisticeList=`+encodeURIComponent(JSON.stringify(this.logisticeDetail))+"&addr="+encodeURIComponent(this.detail.receiverDetailAddress)
                // })
                console.log('this.detail',this.detail);

                uni.navigateTo({
                    url: `/pages-person/order/logistice-detail?orderID=`+encodeURIComponent(this.detail.id)
                })
            },

            /**
             * 获取物流详情
             * */
            async getLogisticeDetail(id) {
                let data = await this.$get(this.$api.person.logisticeDetail, {
                    orderId: id
                })
                if (data) {
                    console.log('data', data);
                    this.logisticeDetail = data.customerOrderDelivery;
                }
            },
            /**
             * 获取订单详情
             * */
            async getOrderDetail(id) {
                let data = await this.$get(this.$api.person.orderDetail, {
                    id
                })
                if (data) {
                    this.detail = data
                }
            },
            /**
             * 订单操作
             * */
            operate(detail) {
                if (Number(detail.status) === 0) {
                    uni.navigateTo({
                        url: `/pages-home/pay/index?price=${detail.payAmount}&orderId=${detail.id}&back=${true}`
                    })
                } else if (Number(detail.status) === 3) {
                    this.confirmReciver(detail.id)
                }
            },
            /**
             * 确认收货
             * */
            confirmReciver(id) {
                let that = this
                uni.showModal({
                    title: '温馨提示',
                    content: '是否确认收货?',
                    confirmText: '确认',
                    cancelText: '取消',
                    complete: async (e) => {
                        if (e.confirm) {
                            let data = await this.$post(that.$api.person.confirmRecive, {
                                id
                            })
                            if (data) {
                                that.$util.showToast('确认成功')
                                that.getOrderDetail(id)
                            }
                        }
                    }
                })
            },
            /**
             * 取消订单
             * */
            async cancleOrder(id) {
                let that = this
                uni.showModal({
                    title: '温馨提示',
                    content: '是否确认取消订单?',
                    confirmText: '确认',
                    cancelText: '取消',
                    success: async (e) => {
                        if (e.confirm) {
                            let data = await this.$post(that.$api.person.cancelOrder, {
                                id
                            })
                            if (data) {
                                that.$util.showToast('取消成功')
                                that.getOrderDetail(id)
                            }
                        }
                    }
                })
            },
            //上传凭证
            getCamera() {
                let that = this
                uni.chooseImage({
                    count: 1, //默认9
                    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                    success: async (res) => {
                        let tempFilePaths = await that.$util.uploadPic(res.tempFilePaths)
                        console.log(tempFilePaths);
                        let data = await this.$post(that.$api.person.uploadPaymentVoucher, {
                            id: this.detail.id,
                            paymentVoucher: tempFilePaths
                        })
                        if (data) {
                            that.$util.showToast('上传成功')
                        }
                    }
                })
            }
        }

    }
</script>

<style scoped lang="scss" scoped>
    @import '@/static/css/mixin/text-overflow.scss';
    .newlogistice {
        @include text-overflow("", 2);
    }

    .mgt20 {
        margin-top: 20rpx;
    }

    .mgl10 {
        margin-left: 10rpx;
    }

    .head-title {
        margin-left: 40rpx;
        margin-top: 10rpx;
        margin-bottom: 10rpx;
        font-size: 24rpx;
    }

    .item-view {
        background-color: #fff;
        padding-left: 40rpx;
        padding-right: 40rpx;
        padding-top: 30rpx;
        padding-bottom: 30rpx;

        .order-title {
            font-size: 28rpx;
            color: #666;
            font-weight: bold;
        }

        .order-no {
            font-size: 28rpx;
            color: #333;
            font-weight: bold;
        }

        .order-amount {
            font-size: 28rpx;
            color: #EE4148;
            font-weight: bold;
        }
    }

    .info {
        width: 750rpx;
        padding-left: 40rpx;
        padding-right: 40rpx;
        padding-top: 20rpx;
        padding-bottom: 20rpx;
        background-color: #FFFFFF;

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
            color: #444444;
            opacity: 1;
        }

        .price {
            font-size: 32rpx;
            font-weight: bold;
            color: #222222;
            opacity: 1;
        }

        .subtitle {
            font-size: 24rpx;
            font-weight: bold;
            color: #444444;
            opacity: 1;
            margin-top: 5rpx;
        }

        .num {
            font-size: 26rpx;
            font-weight: 400;
            color: #888888;
            opacity: 1;
        }
    }

    .btn {
        width: 670rpx;
        height: 96rpx;
        margin-left: 40rpx;
        background: linear-gradient(178deg, #EE2626 0%, #C11920 100%);
        opacity: 1;
        border-radius: 48rpx;
        font-size: 32rpx;
        font-weight: bold;
        line-height: 96rpx;
        text-align: center;
        color: #FFFFFF;
    }

    .item-view-addr {
        width: 750rpx;
        background-color: #fff;
        padding-left: 40rpx;
        padding-right: 40rpx;
        padding-top: 28rpx;

        .name {
            font-size: 32rpx;
            font-weight: bold;
            color: #222222;
        }

        .phone {
            font-size: 28rpx;
            font-weight: bold;
            color: #222222;
            margin-left: 12rpx;
        }

        .default {
            width: 56rpx;
            height: 32rpx;
            background: linear-gradient(42deg, #FF5734 0%, #FF3636 100%);
            opacity: 1;
            border-radius: 4rpx;
            font-size: 22rpx;
            font-weight: 400;
            line-height: 32rpx;
            color: #FFFFFF;
            text-align: center;
        }

        .addr {
            width: 592rpx;
            height: 80rpx;
            margin-top: 12rpx;
            font-size: 28rpx;
            font-weight: 400;
            color: #888888;
            opacity: 1;
            justify-content: center;

            text {
                width: 592rpx;
                height: 80rpx;
                font-size: 28rpx;
                font-weight: 400;
                color: #888888;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
            }
        }

        .addr-content {
            margin-top: 11rpx;
            align-items: center;
        }

        .edit-image {
            width: 48rpx;
            height: 48rpx;
        }
    }

    .btn-group {
        width: 100%;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .small-btn {
            width: 50%;
        }
    }

    .uploading-btn {
        width: 100rpx;
        height: 50rpx;
        background: linear-gradient(42deg, #FF5734 0%, #FF3636 100%);
        line-height: 50rpx;
        border-radius: 30rpx;
        text-align: center;
        color: #fff;
        font-size: 28rpx;
    }
</style>
