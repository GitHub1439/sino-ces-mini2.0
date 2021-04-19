<template>

    <view class='container'>
        <view v-show="submitData.isSelfDelivery === 1" class="top_line-view"></view>
        <cart-item-cell v-show="submitData.isSelfDelivery === 0" sub-title='请选择收货地址'
                        :show-address="JSON.stringify(addressObj) !== '{}'"
                        :address-obj='addressObj'
                        @cellClicked='chooseAddress'>
        </cart-item-cell>
        <view class='cart-item-view' v-for='(item,index) in orderData.items' :key='index'>
            <view class='top-info-view'>
                <image class='product-image' :src="item.productPic"></image>

                <view class='right-view'>
                    <text class='product-name-text'>{{item.productName}}</text>
                    <view class='price-add-view'>
                        <text>￥{{item.realPrice}}</text>
                        <text class="num-text">x{{item.quantity}}</text>
                    </view>
                </view>
            </view>
            <view class='gift-view' v-for="(value,key) in item.activitys" :key="key">
                <view class='gift-text'>
                    <text>赠品:</text>
                    <image :src='value.productPic'></image>
                    <text>{{value.productName}}</text>
                </view>

                <view class='gift-num'>
                    <text>数量 x {{value.quantity}} </text>
<!--                    <image src='/static/images/cart/cart-arrow.png'></image>-->
                </view>
            </view>

            <view class='line-view'></view>
        </view>

        <view class="note-view">
            <text>给商家留言</text>
            <textarea placeholder-style="color:#CCCCCC"
                      v-model="submitData.buyerNote"
                      maxlength="100"
                      placeholder="有什么想和商家说的" auto-height></textarea>
        </view>
        <view class="sn-row-between bill-view">
            <text>是否自提</text>
            <switch color="#C11920" @change="switchSelf"/>
        </view>
        <view class="bill-view" @click='openPicker'>
            <text>发票</text>
            <view  class="choose-bill-type">
                <view class="bill-text">{{billArray[index].text}}</view>
                <image src='/static/images/cart/cart-arrow.png'></image>
            </view>
        </view>

        <cart-item-cell sub-title='订单金额'
                        :is-show-right-arrow='false'
                        :content-text="'￥'+(orderData.orderAmount)">
        </cart-item-cell>

        <cart-item-cell sub-title='运费'
                        margin-top='0'
                        :is-show-right-arrow='false'
                        :content-text="'￥' + orderData.transportAmount">
        </cart-item-cell>

        <view class="empty-view"></view>

        <view class='submit-view'>

            <view class='total-price-view'>
                <text class='total-text'>合计:</text>
                <text class='price-text'>￥{{orderData.payAmount}}</text>
            </view>

            <view class='submit-text' @click='submitClicked'>
                提交
            </view>
        </view>

        <view class="bottom-line-view" v-if='$util.isIphonex()'></view>
        <sn-custom-picker
            title='请选择开票方式'
            ref='picker'
            :options="billArray"
            :init='submitData.billType'
            @confirm='comfirmData'

        />
    </view>
</template>

<script>

import cartItemCell from "./components/cart-item-cell";
import SnCustomPicker from '@/components/sn-custom-picker/sn-custom-picker'

export default {
    components: {
        SnCustomPicker,
        cartItemCell
    },
    onShow(){
        this.getFreight()
    },
    onLoad (parms) {
        let orderData = JSON.parse(parms.orderData)
        this.orderData = orderData
        console.log(this.orderData)
        this.productActivity = orderData.reqGifts
        this.addressObj = this.orderData.address? this.orderData.address :this.addressObj
        this.submitData.addrId = this.addressObj.id
        this.getActivityList(orderData)

        let that = this;
        uni.$on('updateAddress', (res) => {
            that.addressObj = res
            that.submitData.addrId = res.id
            that.getFreight()
        })
    },

    onUnload() {
        // 移除监听事件
        uni.$off('updateAddress')
    },
    // onHide() {
    //     // 存储开票类型
    //     uni.setStorageSync('bill_type', this.index+1);
    // },
    created() {
    },

    data () {
        return {
            // 总价格
            totalPrice: 0,
            // 可以减图片
            normalReduceStr: "/static/images/cart/normal-reduce.png",
            // 不可减图片
            unReduceStr: "/static/images/cart/un-reduce.png",
            addressObj: {
                id: '',
                consignee: '',
                phone:'',
                province:'',
                city:'',
                area:'',
                fullAddress:''
            },
            dataList: [{"productNum": 2,"stepNum": 3, "isCanReduce": true}],
            billArray: [{text:"不开发票",value:0},{text:"普通发票",value:1},{text:"普通电子发票",value:2},{text:"增值税专用发票",value:3}],
            index: 0,
            submitData: {
                /// 商家留言
                buyerNote: "",
                /// 地址id
                addrId: "",
                /// 发票类型
                billType: 0,
                isSelfDelivery: 0,
                storeId: this.$storage.get("storeId")
            },
            /// 订单信息
            orderData: {},
            /// 组装活动数据
            activityList: [],
            productList: [],//保存一次产品
            productActivity: [],//产品活动
        }
    },

    methods: {
        /**
         * 选择自提
         * */
        switchSelf(e){
            this.submitData.isSelfDelivery = e.detail.value? 1:0
            this.productList = this.orderData.items;
            this.getFreight()
            console.log(this.submitData.isSelfDelivery)
        },
        /**
         * 弹框选择数据
         * */
        comfirmData(e){
            this.index = e.value
            this.submitData.billType = e.value
        },
        /**
         * 打开选择弹框
         * */
        openPicker(){
            this.$refs.picker.show()
        },
        getActivityList(obj) {
            this.activityList = [];
            if (obj.storeGifts.length > 0) {
                obj.storeGifts.forEach((item,index) => {
                    this.activityList.push({"productPic": item.productPic,
                        "productId": item.productId,
                        "productName": item.productName,
                        "quantity": item.quantity,
                        "activityProduct": item.activityProduct
                    })
                })
            }

            if (obj.factoryGifts.length > 0) {
                obj.factoryGifts.forEach((item,index) => {
                    this.activityList.push({"productPic": item.giftPic,
                        "productId": item.giftId,
                        "productName": item.giftName,
                        "quantity": item.quantity,
                        "activityProduct": item.activityProductId
                    })
                })
            }

            obj.items.forEach((value,index) => {
                let tempArr = this.activityList.filter((item) => {
                    return value.productId === item.activityProduct;
                });
                value.activitys = tempArr;
                if(this.productList){
                   for(let i=0; i< this.productList.length;i++){
                       for(let j=0;j< this.orderData.items.length;j++){
                           if(this.orderData.items[j]){
                               if(this.productList[i].productId == this.orderData.items[j].productId){
                                   // 如果产品id跟存储的产品id一样,就把赠品添加
                                   this.orderData.items[j].activitys = [];
                                   this.orderData.items[j].activitys = this.productList[i].activitys;
                               }
                           }

                       }
                   }
                }
            })
        },
        // 确认订单，计算运费
        async getFreight() {

            let selectList = [];
            this.orderData.items.forEach((item,index) => {
                selectList.push({"productId": item.productId, "quantity": item.quantity});
            });
            let storeId = this.$storage.get("storeId")

            let submitParam = {
                addrId: this.submitData.addrId,
                orderItemConfirmReq: selectList,
                storeId: storeId,
                basketIds: this.orderData.basketIds,
                isSelfDelivery: this.submitData.isSelfDelivery,
                gifts: this.productActivity ? this.productActivity : null
            }

            let data = await this.$post(this.$api.cart.orderConfirm, submitParam, false);

            if (data) {
                this.orderData = data;
                this.getActivityList(this.orderData);
            }
        },

        // 选择地址
        chooseAddress () {
            uni.navigateTo({
                url: "/pages-person/address/index?isChooseAddress=" + true
            })
        },
        //
       async submitClicked () {

           let data = await this.$post(this.$api.cart.orderSubmit, this.submitData, true);

           if (data) {
               uni.navigateTo({
                   url: "/pages-home/pay/index?price=" + this.orderData.payAmount + "&orderId=" +data.id + "&back=false" + "&orderSn=" + data.orderSn
               })
           }
        },
        /// 选择发票
        bindPickerChange (e) {
            this.index = e.target.value;
            this.submitData.billType = this.index;
        }
    }
}

</script>

<style lang='scss' scoped>

    .container {
        background-color: #F5F5F7;

        .cart-item-view {
            background-color: #FFFFFF;
            width: 100%;
            flex-direction: column;
            display: flex;
            justify-content: flex-start;

            .product-policy-view {
                flex-direction: row;
                display: flex;
                margin-left: 30rpx;
                margin-top: 27rpx;

                .policy-item-view {
                    background-color: #F5F5F5;
                    flex-wrap: wrap;
                    display: flex;
                    flex-direction: column;
                    border-radius: 6rpx;
                    padding: 3rpx 5rpx;
                }

                text {
                    font-size: 22rpx;
                    font-weight: 400;
                    color: #333333;
                }
            }

            .gift-view {
                margin-left: 30rpx;
                margin-right: 30rpx;
                flex-direction: row;
                display: flex;
                background: rgba(192, 25, 31, 0.05);
                justify-content: space-between;
                align-items: center;
                min-height: 60rpx;
                margin-top: 20rpx;
                border-radius: 5rpx;
                .gift-text {
                    margin-left: 5rpx;
                    flex-direction: row;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    width: 540rpx;
                    text {
                        min-width: 50rpx;
                        font-size: 22rpx;
                        font-weight: 400;
                        color: #333333;
                    }

                    image {
                        width: 30rpx;
                        height: 30rpx;
                        margin-left: 20rpx;
                        margin-right: 20rpx;
                    }
                }

                .gift-num {
                    flex-direction: row;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    text {
                        font-size: 22rpx;
                        font-weight: 400;
                        line-height: 30rpx;
                        color: #333333;
                        margin-right: 20rpx;
                    }
                    image {
                        margin-right: 5rpx;
                        width: 20rpx;
                        height: 32rpx;
                    }
                }


            }

            .top-info-view {
                flex-direction: row;
                display: flex;
                width: 100%;
                align-items: center;
                margin-top: 40rpx;

                .product-image {
                    margin-left: 30rpx;
                    width: 132rpx;
                    height: 132rpx;
                }

                .right-view {
                    width: 588rpx;
                    flex-direction: column;
                    display: flex;

                    .product-name-text {
                        margin-left: 20rpx;
                        font-size: 28rpx;
                        font-weight: bold;
                        color: #222222;
                        width: 449rpx;
                    }

                    .price-add-view {
                        flex-direction: row;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        text {
                            margin-left: 20rpx;
                            font-size: 32rpx;
                            font-weight: bold;
                            color: #C0191F;
                        }

                        .num-text {
                            margin-right: 30rpx;
                            font-size: 28rpx;
                            font-weight: bold;
                            color: #222222;
                        }

                        .add-view {
                            flex-direction: row;
                            display: flex;
                            margin-right: 30rpx;
                            justify-content: center;
                            align-items: center;
                            input {
                                max-width: 100rpx;
                                height: 32rpx;
                                text-align: center;
                            }
                            image {
                                width: 44rpx;
                                height: 44rpx;
                            }
                        }
                    }
                }
            }

            .line-view {
                margin-top: 43rpx;
                width: 720rpx;
                height: 2rpx;
                background-color: #E2E2E2;
                margin-left: 30rpx;
            }
        }
        .top_line-view{
            width: 750rpx;
            height: 20rpx;
            background-color: #F7F8FA;
        }

        .note-view {

            justify-content: space-between;
            align-items: center;
            flex-direction: row;
            display: flex;
            width: 750rpx;
            min-height: 130rpx;
            background-color: #FFFFFF;

            text {
                margin-left: 30rpx;
                margin-right: 16rpx;
                font-size: 32rpx;
                font-weight: bold;
                color: #222222;
                width: 215rpx;
            }

            textarea {
                margin-top: 20rpx;
                margin-bottom: 20rpx;
                margin-right: 30rpx;
                font-size: 28rpx;
                font-weight: bold;
                color: #222222;
            }
        }

        .bill-view {
            margin-top: 20rpx;
            justify-content: space-between;
            align-items: center;
            flex-direction: row;
            display: flex;
            width: 750rpx;
            height: 130rpx;
            background-color: #FFFFFF;

            .choose-bill-type {
                flex-direction: row;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                width: 300rpx;
                height: 130rpx;

                .bill-text {
                    margin-right: 16rpx;
                    font-size: 32rpx;
                    font-weight: bold;
                    color: #222222;
                }

                image {
                    margin-right: 30rpx;
                    width: 20rpx;
                    height: 32rpx;
                }
            }

            text{
                font-size: 32rpx;
                font-weight: 400;
                color: #888888;
                margin-left: 30rpx;
            }

        }

        .empty-view {
            width: 100%;
            height: 110rpx;
            background-color: #FFFFFF;
        }

        .bottom-line-view {
            height: 68rpx;
            background-color: #FFFFFF;
            width: 100%;
            position: fixed;
            bottom: 0;
            z-index: 99;
        }

        .submit-view {
            position: fixed;
            bottom: constant(safe-area-inset-bottom);
            bottom: env(safe-area-inset-bottom);
            width: 750rpx;
            height: 109rpx;
            background: #FFFFFF;
            box-shadow: 0rpx -3rpx 6rpx rgba(226, 231, 242, 0.4);
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
                    margin-left: 30rpx;
                    color: #444444;
                    font-size: 32rpx;
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
    }


</style>
