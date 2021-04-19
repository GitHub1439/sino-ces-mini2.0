<template>

    <view class='cell-view'>
        <view class='cell-content-view' :style="[{marginTop: marginTop + 'rpx'}]" @click='cellClicked'>

            <view class='address-class' v-if='showAddress'>
                <text class='name-text'>{{addressObj.consignee + '  ' + (addressObj.phone?addressObj.phone:'请选择地址')}}</text>
                <text class='detail-address-text'>{{addressObj.province + addressObj.city + addressObj.area + addressObj.fullAddress}}</text>
            </view>

            <text v-else class='title-text'>{{subTitle}}</text>

            <view class='right-view'>
                <text :class="isShowRightArrow ? '' : 'right-text'">{{contentText}}</text>
                <image v-if='isShowRightArrow' src='/static/images/cart/cart-arrow.png'></image>
            </view>
        </view>
        <view class='line-view'></view>
    </view>

</template>

<script>

export default {

    props: {
        // 是否显示地址
        showAddress: {
            type: Boolean,
            default: false
        },

        addressObj: {
            type: Object,
            default: {}
        },

        isShowRightArrow: {
            type: Boolean,
            default: true
        },

        subTitle: {
            type: String,
            default: ""
        },

        contentText: {
            type: String,
            default: ""
        },

        marginTop: {
            type: Number,
            default: 20
        }

    },

    data() {
        return {

        }
    },

    methods: {
        cellClicked () {
            this.$emit("cellClicked")
        }
    }
}


</script>

<style lang='scss' scoped>
    .cell-view {
        background-color: #FFFFFF;
        width: 750rpx;
        min-height: 130rpx;
        .cell-content-view {
            width: 750rpx;
            min-height: 129rpx;
            background: #FFFFFF;
            flex-direction: row;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .address-class {
                flex-direction: column;
                display: flex;

                .name-text {
                    font-size: 32rpx;
                    font-weight: bold;
                    color: #222222;
                    margin-left: 30rpx;
                    margin-top: 28rpx;
                }
                .detail-address-text {
                    width: 592rpx;
                    font-size: 28rpx;
                    font-weight: 400;
                    color: #888888;
                    margin-left: 30rpx;
                    margin-bottom: 28rpx;
                }
            }

            .title-text{
                font-size: 32rpx;
                font-weight: 400;
                line-height: 4rpx;
                color: #888888;
                margin-left: 30rpx;
            }

            .right-view {
                flex-direction: row;
                display: flex;
                justify-content: center;
                align-items: center;

                .right-text {
                    margin-right: 30rpx;
                    font-size: 32rpx;
                    font-weight: bold;
                    color: #C0191F;
                }


                text {
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
        }

        .line-view {
            width: 690rpx;
            height: 3rpx;
            background: #E2E2E2;
            margin-left: 30rpx;
            margin-right: 30rpx;
        }
    }


</style>
