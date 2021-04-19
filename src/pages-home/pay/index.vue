<template>

    <view class='container'>
        <uni-nav-bar @clickLeft=" !isNeedBack&&leftClicked()" :gradual-change="true" :is-need-back="isNeedBack"
                     left-icon="back" title="支付确认"></uni-nav-bar>

        <view class='content-view'>
            <view class='pay-num-view'>
                <view class='num-view'>
                    <text class='currency-text'>￥</text>
                    <text class='num-text'>{{totalPrice}}</text>
                </view>
                <text>付款金额</text>
            </view>


            <scroll-view scroll-x="true" class="pay-scroll">

                <view class="pay-content-view" v-if="list.length < 4">
                    <view class="pay-view" v-for="(item,index) in list" :key="index"
                          @click="payTypeClicked(item,index)">
                        <view class="pay-item-view"
                              :style="{background: item.payCode === payIndex ? 'linear-gradient(343deg, #C4282F 0%, #EF3E3D 100%)': '#F5F5F5'}">
                            <image class="pay-type-iamge" :src="item.payCode === payIndex ? item.imageSel : item.image">
                            </image>
                            <text
                                :style="{color: item.payCode === payIndex ? '#FFFFFF' : '#CCCCCC'}">{{item.text}}</text>
                            <image v-if="item.payCode === payIndex" class="select-pay-image"
                                   src="/static/images/home/select-pay-type1.png"></image>
                        </view>
                    </view>
                </view>

                <view v-else class="pay-view" v-for="(item,index) in list" :key="index"
                      @click="payTypeClicked(item,index)">
                    <view class="pay-item-view"
                          :style="{background: item.payCode === payIndex ? 'linear-gradient(343deg, #C4282F 0%, #EF3E3D 100%)': '#F5F5F5'}">
                        <image class="pay-type-iamge" :src="item.payCode === payIndex ? item.imageSel : item.image">
                        </image>
                        <text :style="{color: item.payCode === payIndex ? '#FFFFFF' : '#CCCCCC'}">{{item.text}}</text>
                        <image v-if="item.payCode === payIndex" class="select-pay-image"
                               src="/static/images/home/select-pay-type1.png"></image>
                    </view>
                </view>

            </scroll-view>


            <view v-if="payIndex===1">
                <view class="pay-type-content">
                    <text>
                        请先截屏或者点击收款码保存到手机,使用微信扫一扫支付订单金额，商家将根据收款信息审核订单并安排发货
                    </text>
                    <!-- 请先截屏或者点击收款码保存到手机,使用微信扫一扫支付订单金额，商家将根据收款信息审核订单并安排发货-->
                    <image :src="payData.collectionCode" @click="previewImage(payData.collectionCode)" mode="widthFix">
                    </image>
                </view>

                <!--<view class='img-pay-btn' @click='savePic'>保存收款码</view>-->
                <view style="display: flex;justify-content: center;">

                    <view class='pay-btn' @click='payClicked'>完成支付</view>
                </view>
            </view>

            <view v-if="payIndex===4">
                <view style="display: flex;justify-content: center;">
                    <view class="pay-btn" :style="{marginTop: 300 + 'rpx'}" @click='wxPay'>{{btnText}}</view>
                </view>
            </view>

            <view class="bank-view" v-if="payIndex === 3">
                <view v-for="(item,index) in payData.bankInfoList" :key="index">
                    <sn-bank-item bankCode="ABC" :itemData="item" />
                </view>


                <!--     <view class="collection-info-view" v-for="(item,index) in payData.bankInfoList"
                    :style="{marginBottom: (index === 4 ? 136 : 0)+ 'rpx'}" :key="index">
                    <text class="content-text" :style="{marginTop: 60 + 'rpx'}">{{item.bank}}</text>

                    <view class="sn-row-center">
                        <text class="title-text">{{payData.billType < 1 ? "收款人名:" : "收款方:"}}</text>
                        <text class="content-text">{{item.bankName}}</text>
                    </view>
                    <view class="sn-row-center">
                        <text class="title-text">{{payData.billType < 1 ? "个人账号:" : "公司账号:" }}</text>
                        <text class="content-text">{{item.bankAccount}}</text>
                    </view>
                    <view class="copy-view" @click="copyClicked(item)">
                        <text>点击复制</text>
                        <image src="/static/images/cart/copy.png"></image>
                    </view>
                </view> -->
                <view>
                    <view style="display: flex;justify-content: center;">
                        <view class="pay-btn bank-btn" @click='payClicked'>已完成转账</view>
                    </view>
                    <view class="bottom-line-view" v-if='$util.isIphonex()'></view>
                </view>
            </view>

            <view class="sn-column credit-view" v-if="payIndex === 0">
                <view class="credit-text-view">
                    <text class="normal-text">￥</text>
                    <text class="credit-text">{{payData.creditRemain}}</text>
                    <text class="normal-text">元</text>
                </view>

                <text class="quota-text">当前可用信用</text>
                <view style="display: flex;justify-content: center;">
                    <view class='pay-btn' @click='payClicked'>{{btnText}}</view>
                </view>
            </view>

            <view v-if="payIndex===2">
                <view style="display: flex;justify-content: center;">
                    <view class="pay-btn" :style="{marginTop: 300 + 'rpx'}" @click='payClicked'>提交订单</view>
                </view>
            </view>


        </view>
    </view>

</template>

<script>
    import UniNavBar from '@/components/uni-nav-bar/uni-nav-bar';
    import snBankItem from "@/components/sn-bank-item/sn-bank-item.vue";

    export default {


        components: {
            UniNavBar,
            snBankItem
        },

        computed: {},


        onLoad(parms) {

            console.log(parms)
            this.totalPrice = parms.price
            this.orderId = parms.orderId
            this.isNeedBack = parms.back === 'true'
            this.orderSn = parms.orderSn
            this.fetchPayDetail()
        },



        data() {

            return {
                // 订单id
                orderId: "",
                // 支付金额
                totalPrice: "",
                // 0微信支付  1银行转账 2授信月结 3物流代收
                payIndex: -1,
                //订单号
                orderSn: '',
                code: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2488581882,381693902&fm=26&gp=0.jpg",
                list: [],
                selectSrc: '/static/images/home/select.png',
                unSelectSrc: '/static/images/home/un-select.png',
                // 支付方式
                payTypeList: [{
                    "image": "/static/images/home/pay-wx.png",
                    "text": "微信支付"
                },
                    {
                        "image": "/static/images/home/pay-bank.png",
                        "text": "银行转账"
                    },
                    {
                        "image": "/static/images/home/pay-credit-line.png",
                        "text": "授信额度"
                    },
                    {
                        "image": "/static/images/home/pay-logistics.png",
                        "text": "物流代收"
                    }
                ],
                // 是否需要返回
                isNeedBack: false,

                payData: {
                    // 授信额度
                    creditRemain: "",
                    // 支付二维码
                    collectionCode: ""
                },
                btnText: '立即支付'
            }
        },
        methods: {
            // 预览图片
            previewImage(url) {
                let photoList = [];
                photoList.push(url);
                uni.previewImage({
                    current: 0,
                    urls: photoList // 图片路径必须是一个数组
                });
            },
            /// 获取微信支付二维码， 银行卡信息
            async fetchPayDetail() {

                let data = await this.$get(this.$api.cart.paymentMethod, {
                    orderId: this.orderId
                }, true);
                if (data) {
                    let payMethods = data.payMethod.split(",");
                    if (payMethods.indexOf("1") !== -1) {
                        this.list.push({
                            "text": "扫码支付",
                            "payCode": 1,
                            "image": "/static/images/cart/pay/pay_qrcode.png",
                            "imageSel": "/static/images/cart/pay/pay_qrcode_selected.png"
                        })
                    }
                    if (payMethods.indexOf("4") !== -1) {
                        this.list.push({
                            "text": "微信支付",
                            "payCode": 4,
                            "image": "/static/images/cart/pay/pay_wechat.png",
                            "imageSel": "/static/images/cart/pay/pay_wechat_selected.png"
                        })
                    }
                    if (payMethods.indexOf("3") !== -1) {
                        this.list.push({
                            "text": "银行转账",
                            "payCode": 3,
                            "image": "/static/images/cart/pay/pay_transfer.png",
                            "imageSel": "/static/images/cart/pay/pay_transfer_selected.png"
                        })
                    }
                    if (payMethods.indexOf("0") !== -1) {
                        this.list.push({
                            "text": "授信额度",
                            "payCode": 0,
                            "image": "/static/images/cart/pay/pay_credit.png",
                            "imageSel": "/static/images/cart/pay/pay_credit_selected.png"
                        })
                    }
                    if (payMethods.indexOf("2") !== -1) {
                        this.list.push({
                            "text": "物流代收",
                            "payCode": 2,
                            "image": "/static/images/cart/pay/pay_logistics.png",
                            "imageSel": "/static/images/cart/pay/pay_logistics_selected.png"
                        })
                    }

                    if (this.list.length > 0) {
                        this.payIndex = this.list[0].payCode;
                    }

                    this.payData = data;
                    if (this.payData.billType >= 1) {
                        this.payIndex = 3
                    }
                    let banklist = data.bankInfoList
                    let arr = []
                    for (let i = 0; i < banklist.length; i++) {
                        if (banklist[i].bankType == 1 && this.payData.billType >= 1) {
                            arr.push(banklist[i])
                        } else if (banklist[i].bankType == 2 && this.payData.billType < 1) {
                            arr.push(banklist[i])
                        }
                    }
                    this.payData.bankInfoList = arr
                }
            },

            leftClicked() {
                let that = this;
                console.log('left Clicked');
                uni.redirectTo({
                    url: "/pages-person/order/index?isPayPage=" + true + "&cur=4"
                })
                // 跳转领红包页面
                // uni.redirectTo({
                //     url: "/pages-person/order/red-bag?orderSn="+ that.orderSn
                // })
            },

            payTypeClicked(item, index) {
                if (this.payData.billType >= 1) {
                    uni.showToast({
                        title: "申请开票只能银行转账",
                        icon: "none"
                    });
                    return false
                } else {
                    this.payIndex = item.payCode;
                }
            },
            /// 点击复制
            copyClicked(item) {
                uni.setClipboardData({
                    data: item.bank + " " + item.bankAccount + " " + item.bankName,
                    success: function(res) {
                        uni.hideToast();
                        uni.getClipboardData({
                            success: function(res) {
                                uni.showToast({
                                    title: "已复制到剪贴板",
                                    icon: "none"
                                });
                            }
                        });
                    }
                });
            },
            savePic() {
                let tmepimg = this.payData.collectionCode
                wx.getSetting({

                    success(res) {

                        if (!res['scope.writePhotosAlbum']) {

                            wx.authorize({

                                scope: 'scope.writePhotosAlbum',

                                success() {

                                    wx.downloadFile({

                                        url: tmepimg,

                                        success: function(res) {

                                            wx.saveImageToPhotosAlbum({

                                                filePath: res.tempFilePath,

                                                success(res) {

                                                    console.log(res);

                                                    wx.showToast({

                                                        title: "保存成功",

                                                        duration: 2000

                                                    })

                                                }

                                            })

                                        }

                                    })

                                }

                            })

                        } else {

                            console.log('error');

                        }

                    }

                })

            },
            // 更新红包领取状态
            async editbtn(rcoreId) {
                let that = this;
                let par = {
                    id: rcoreId
                }
                let data = await that.$post(that.$api.common.sendRedBagNotice, par, true)
                if (data) {
                    uni.redirectTo({
                        url: "/pages-person/order/index?isPayPage=" + true + "&cur=4"
                    })
                }
            },
            async sendBizRedPacket() {
                let that = this
                let data = await that.$post(that.$api.common.sendRedBag + `?orderSn=${that.orderSn}`, {}, true)
                if (data) {
                    console.log("pay", JSON.stringify(data))
                    wx.sendBizRedPacket({
                        timeStamp: data.timeStamp,
                        nonceStr: data.nonceStr,
                        package: data.package,
                        signType: data.signType,
                        paySign: data.paySign,
                        success(res) {
                            // try{
                            //    that.editbtn(data.redRecordId)
                            // }catch(e){
                            //     //TODO handle the exception
                            // }
                            uni.redirectTo({
                                url: "/pages-person/order/index?isPayPage=" + true + "&cur=4"
                            })
                        },
                        fail(res) {
                            wx.showModal({
                                title: 'fail提示',
                                content: JSON.stringify(res)
                            });
                            // console.log('失败' + JSON.stringify(res))
                        },
                        complete(res) {
                            console.log('完成 res' + JSON.stringify(res))
                        }
                    })
                }
            },
            async wxPay() {

                let that = this
                //that.orderSn= this.orderId;
                let data = await that.$post(that.$api.common.wxPay + `?orderSn=${that.orderSn}`, {}, true)
                if (data) {
                    console.log('pay data', data);
                    wx.requestPayment({
                        timeStamp: data.timeStamp,
                        nonceStr: data.nonceStr,
                        package: data.package,
                        signType: data.signType,
                        paySign: data.paySign,
                        success(res) {
                            that.btnText = `支付成功`

                            let tempScene=wx.getStorageSync("temp_scene") //1101发红包
                            //that.$util.showToast('支付成功:'+tempScene);
                            // 可以发红包
                            if (data.canSendEnvelopes&&(tempScene===1011||tempScene===1025||tempScene===1047||tempScene===1024)) {
                                that.sendBizRedPacket();
                            } else {
                                that.$util.showToast('支付成功');
                                let count = 2
                                that.btnText = `支付成功(${count})`
                                let interval = setInterval(() => {
                                    count--
                                    that.btnText = `支付成功(${count})`
                                    if (count < 0) {
                                        clearInterval(interval)
                                        that.btnText = `支付成功`
                                        that.leftClicked()
                                    }
                                }, 1000)
                                //that.leftClicked();
                            }

                        },
                        fail(res) {
                            //that.$util.showToast('支付失败')
                            //console.log('支付失败' + res)
                        },
                        complete(res) {
                            console.log('支付完成 res.errMsg' + res.errMsg)
                        }
                    })
                }
            },
            // 立即支付
            async payClicked() {
                let that = this
                let parms = {
                    orderId: this.orderId,
                    payType: this.payIndex,
                }
                let data = await this.$post(this.$api.cart.payOrder, parms, true);
                if (data) {
                    that.btnText = `支付成功`

                    let tempScene=wx.getStorageSync("temp_scene") //1101发红包
                    //that.$util.showToast('支付成功:'+tempScene);
                    debugger
                    // 可以发红包
                    if (data.canSendEnvelopes&&(tempScene===1011||tempScene===1025||tempScene===1047||tempScene===1024)) {
                        that.sendBizRedPacket();
                    } else {
                        that.$util.showToast('支付成功');
                        let count = 2
                        that.btnText = `支付成功(${count})`
                        let interval = setInterval(() => {
                            count--
                            that.btnText = `支付成功(${count})`
                            if (count < 0) {
                                clearInterval(interval)
                                that.btnText = `支付成功`
                                that.leftClicked()
                            }
                        }, 1000)
                    }

                }
            }
        }
    }
</script>

<style lang='scss' scoped>
    .img-pay-btn {
        position: absolute;
        top: 50%;
        right: 5%;
        /* border: 1px solid #dd524d; */
        border-radius: 18rpx;
        color: #fff;
        padding: 12rpx 16rpx;
        font-size: 20rpx;
        background: #dd524d;
    }

    .container {

        .content-view {
            height: 100vh;
            background-color: #FFFFFF;

            .pay-num-view {
                background: linear-gradient(to right, #EF3E3D, #C4282F);
                width: 100%;
                height: 190rpx;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                display: flex;

                .currency-text {
                    color: #FFFFFF;
                    font-size: 42rpx;
                }

                .num-text {
                    font-size: 64rpx;
                    font-weight: 800;
                    line-height: 90rpx;
                    color: #FFFFFF;
                }

                text {
                    font-size: 26rpx;
                    font-weight: 400;
                    line-height: 37rpx;
                    color: #FFFFFF;
                }
            }

            .pay-scroll {
                width: 100%;
                white-space: nowrap;
                height: 260rpx;
                background-color: #FFFFFF;

                .pay-content-view {
                    height: 100%;
                    justify-content: center;
                    align-items: center;
                    flex-direction: row;
                    display: flex;
                }



                .pay-view {
                    width: 23%;
                    height: 100%;
                    display: inline-block;
                    justify-content: center;
                    align-items: center;

                    .pay-item-view {
                        background: #F5F5F5;
                        width: 150rpx;
                        height: 190rpx;
                        margin-top: 40rpx;
                        margin-left: 20rpx;
                        flex-direction: column;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        position: relative;

                        .pay-type-iamge {
                            width: 72rpx;
                            height: 72rpx;
                        }

                        .select-pay-image {
                            position: absolute;
                            bottom: -16rpx;
                            width: 50rpx;
                            height: 30rpx;
                        }



                        text {
                            font-size: 26rpx;
                            font-weight: bold;
                            color: #FFFFFF;
                            margin-top: 20rpx;
                        }
                    }
                }
            }

            .pay-type-content {
                flex-direction: column;
                display: flex;
                justify-content: center;
                align-items: center;

                text {
                    margin-left: 30rpx;
                    margin-right: 30rpx;
                    margin-top: 40rpx;
                    font-size: 28rpx;
                    font-weight: bold;
                    line-height: 40rpx;
                    color: #222222;
                }

                image {
                    margin-top: 20rpx;
                    width: 76%;
                }
            }

            .bank-btn {
                position: fixed;
                bottom: constant(safe-area-inset-bottom);
                bottom: env(safe-area-inset-bottom);
                z-index: 99;
                bottom: 68rpx;
            }

            .bottom-line-view {
                height: 68rpx;
                background-color: #FFFFFF;
                width: 100%;
                position: fixed;
                bottom: 0;
            }

            .pay-btn {
                margin-top: 80rpx;
                /* margin-left: 40rpx; */
                background: linear-gradient(132deg, #C11920 0%, #EE2626 100%);
                opacity: 1;
                width: 670rpx;
                border-radius: 48px;
                text-align: center;
                color: #FFFFFF;
                font-size: 32rpx;
                font-weight: bold;
                line-height: 96rpx;
            }
        }

        .bank-view {
            padding: 20px;
            flex-direction: column;
            display: flex;
            background-color: #FFFFFF;
            padding-bottom: 100px;

            .collection-info-view {
                margin-left: 50rpx;
                width: 650rpx;
                border-radius: 12rpx;
                margin-top: 30rpx;
                height: 300rpx;
                display: flex;
                flex-direction: column;
                /* box-shadow: 0rpx 3rpx 3rpx 5rpx rgba(220, 220, 220, 0.7); */
                border: 1px #eeeeee solid;
                position: relative;

                .content-text {
                    margin-top: 20rpx;
                    margin-left: 50rpx;
                    font-size: 32rpx;
                    font-weight: 500;
                    color: #333333;
                }

                .title-text {
                    margin-top: 20rpx;
                    font-size: 26rpx;
                    font-weight: 400;
                    color: #787D88;
                    margin-left: 50rpx;
                }

                .copy-view {
                    flex-direction: row;
                    display: flex;
                    position: absolute;
                    right: 30rpx;
                    top: 20rpx;

                    text {
                        font-size: 26rpx;
                        font-weight: 400;
                        color: #787D88;
                    }

                    image {
                        margin-left: 10rpx;
                        width: 32rpx;
                        height: 32rpx;
                    }
                }
            }
        }



        .credit-view {
            margin-top: 200rpx;

            .quota-text {
                width: 100%;
                text-align: center;
                margin-top: 20rpx;
                font-size: 26rpx;
                font-weight: 400;
                color: #787D88;
            }
        }

        .credit-text-view {
            flex-direction: row;
            display: flex;
            width: 100%;
            justify-content: center;
            align-items: flex-end;

            .normal-text {
                font-size: 26rpx;
                font-weight: 400;
                color: #787D88;
            }

            .credit-text {
                margin-left: 10rpx;
                margin-right: 10rpx;
                font-size: 70rpx;
                line-height: 55rpx;
                font-weight: bold;
                color: #C0191F;
            }
        }

    }
</style>
