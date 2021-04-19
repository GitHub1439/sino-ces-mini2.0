<template>

    <view>

        <view class='product-item-container' @click="productItemClicked">

            <view class='product-image'>
                <image :src="itemObj.pic?itemObj.pic:'/static/images/ic_no_image.png'"></image>
            </view>
            <view class='product-info'>
                <view class='product-title'>
                    <image v-if="itemObj.activityList.length > 0" src="/static/images/home/activity.png"></image>
                    <text>{{itemObj.productName}}</text>
                </view>
                <view class='month-sale-view'>
                    <text class='product-company'>{{itemObj.productFactory}}</text>
                    <view class='sale-buy-view'>
                        <text>销量{{itemObj.sale}}</text>
                        <text class='line-text'>|</text>
                        <text>{{itemObj.salePeople}}位买家</text>
                    </view>
                </view>
                <text class='surplus-text'>剩余{{itemObj.productSku}}套</text>

                <view class='specs-add-view'  @click.stop=''>
                    <view class='specs-view'>

                        <text class="money-text">￥</text>
                        <text v-if="itemObj.quantity" class='price-text'>{{itemObj.price === null ? itemObj.standardPrice : itemObj.price}}</text>
                        <text v-else class='price-text'>{{(itemObj.minPrice === itemObj.maxPrice) ? itemObj.minPrice : (itemObj.minPrice + '~' + itemObj.maxPrice)}}</text>

                        <text class='unit-text'>/{{itemObj.productUnit}}</text>
                    </view>

                    <view  class='add-reduce-view'>
                        <text v-if='!isChooseSale' class='specs-text' @click='chooseSpecsClicked'>选规格</text>

                        <view v-else class='add-view'>
                            <view v-if="itemObj.quantity > 0" @click="reduceClicked" class="image-view sn-row" style="padding-left: 30rpx">
                                <image  src='/static/images/home/reduce.png' @click="reduceClicked"></image>
                            </view>
                            <input v-if="itemObj.quantity > 0 && isReset" type="number" class="num_input" v-model="itemObj.quantity"  @blur="cartNumChange"/>
                            <view  @click="addClicked" class="image-view sn-row">
                                <image src='/static/images/home/add.png' @click="addClicked"></image>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <view class="bottom-line-view"></view>

        <!-- <view class='activity-view' v-for="(value, key) in itemObj.showActivityList"
              @click.stop="activityClicked(value.id)"
              :style="{marginBottom: ((key === itemObj.showActivityList.length - 1) ? 60 : 20) + 'rpx'}"
              :key="key">
            <image class='acticity-image' src='/static/images/home/activity1.png'></image>
            <text>{{value.name+'|'+value.description+'|'+ (value.source ===0 ?'厂商活动':'商家活动')}}</text>
            <image class='arrow-image' src='/static/images/home/arrow-right.png'></image>
        </view> -->

         <view v-if="itemObj.activityList" v-for="item in itemObj.activityList">
             <uni-collapse class='activity-view' accordion="true">
                 <uni-collapse-item :title="item.source ===0?'厂商活动：'+item.name+ (item.giftSendType==1 && item.activityGifts.length>0?'  多选一':''):'商家活动：'+item.name+ (item.giftSendType==1 && item.activityGifts.length>0?'  多选一':'') ">
                     <view style="padding:10rpx 0 10rpx  12px;color: #888888;font-size: 26rpx;" v-for="gift in item.activityGifts">
                         赠品: {{gift.productName}} {{gift.giftType == 1 ? '买'+ gift.doubleBase+ '赠' + gift.giftNum : '赠送数量' + gift.giftNum}}
                     </view>
                 </uni-collapse-item>
             </uni-collapse>
        </view>


    </view>


</template>

<script>
import uniCollapse from "@/components/uni-collapse/uni-collapse.vue"
import uniCollapseItem from "@/components/uni-collapse-item/uni-collapse-item.vue"


export default  {

    props: {

        isChooseSale: {
            type: Boolean,
            default: true
        },

        itemObj: {
            type: Object,
            default: {}
        },

        isReset: {
            type: Boolean,
            default: true
        }
    },
    components: {
        uniCollapse,
        uniCollapseItem
    },

    onLoad() {

    },

    data () {
        return {

        }
    },
    methods: {

        ///item 点击事件
        productItemClicked () {
            this.$emit("productItemClicked");
        },
        /// 选规格
        chooseSpecsClicked () {
            this.$emit("chooseSpecsClicked");
        },
        /// 加
        addClicked () {
           this.$emit("addClicked");
        },

        cartNumChange (e) {
            this.$emit("cartNumChange", e)
        },

        /// 减
        reduceClicked () {
            this.$emit("reduceClicked");
        },


        activityClicked (activityId) {
            this.$emit("activityClicked",activityId)
        },
    }
}

</script>

<style lang="scss" scoped>
   @import '@/static/css/mixin/text-overflow.scss';

    // 赠品
    .gift {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        padding-left: 20px;
        margin-left: 16rpx;
        margin-right: 32rpx;
        // border: 1px solid #C0191F;
        color: #C0191F;
        @include text-overflow();
    }

    .product-item-container {
        margin-left: 16rpx;
        flex-direction: row;
        display: flex;
        padding-top: 16rpx;
        .product-image {
           width: 168rpx;
            // height: 168rpx;
            display: flex;
            align-items: center;
            image{
                width: 168rpx;
                height: 168rpx;
                border-radius: 12rpx;
            }
        }

        .product-info {
            width: 98%;
            flex-direction: column;
            display: flex;
            margin-left: 16rpx;

            .product-title {
                flex-direction: row;
                display: flex;
                justify-content: flex-start;
                margin-bottom: 19rpx;

                text {
                    color: #222222;
                    font-size: 32rpx;
                    width: 330rpx;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    display: -webkit-box !important;
                    -webkit-line-clamp: 2;//文字上限行
                    -webkit-box-orient: vertical;
                }
                image {
                    margin-top: 8rpx;
                    margin-right: 5rpx;
                    width: 58rpx;
                    height: 32rpx;
                }

            }
            .month-sale-view {
                flex-direction: row;
                display: flex;

                .product-company {
                    color: #333333;
                    font-size: 22rpx;
                    padding: 5rpx 8rpx;
                    background-color: #F5F5F5;
                }
                .sale-buy-view {
                    margin-left: 8rpx;
                    border: 1rpx solid #DDDDDD;
                    flex-direction: row;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 6rpx;
                    text{
                        margin: 0rpx;
                        color: #888888;
                        font-size: 22rpx;
                        padding: 0rpx 8rpx;
                    }
                }
            }

            .surplus-text {
                color: #888888;
                font-size: 22rpx;
                margin-top: 15rpx;
            }

            .specs-add-view {
                flex-direction: row;
                display: flex;
                justify-content: space-between;
                margin-top: 16rpx;
                .specs-view {
                    flex-direction: row;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    height: 48rpx;
                    .money-text {
                        color: #CA161D;
                        font-size: 24rpx;
                        font-weight: bold;
                    }
                    .price-text {
                        color: #CA161D;
                        font-size: 34rpx;
                        font-weight: bold;
                    }
                    .unit-text {
                        font-size: 22rpx;
                        color: #888888;
                    }
                }

                .add-reduce-view {
                    margin-right: 32rpx;
                    flex-direction: row;
                    display: flex;
                    align-items: center;

                    .specs-text {
                        background: linear-gradient(to right, #C11920,#EC3A40);
                        width: 90rpx;
                        height: 42rpx;
                        text-align: center;
                        border-radius: 21rpx;
                        font-size: 22rpx;
                        color: #FFFFFF;
                        line-height: 42rpx;
                    }

                    .add-view {
                        flex-direction: row;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        .num_input {
                            height: 42rpx;
                            text-align: center;
                            max-width: 70rpx;
                            color: #333333;
                            font-size: 28rpx;
                        }
                        .image-view{
                            width: 72rpx;
                            height: 42rpx;
                            image {
                                width: 42rpx;
                                height: 42rpx;
                            }
                        }
                    }
                }
            }
        }
    }

    .bottom-line-view {
        width: 100%;
        height: 30rpx;
    }

    .activity-view {
        position: relative;
        flex-direction: row;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        min-height: 65rpx;
        margin-left: 16rpx;
        margin-right: 32rpx;
        // margin-bottom: 10rpx;
        .acticity-image {
            width: 30rpx;
            height: 24rpx;
            margin-left: 16rpx;
        }

        .arrow-image {
            position: absolute;
            right: 16rpx;
            width: 12rpx;
            height: 23rpx;
        }

        text {
            color: #333333;
            font-size: 24rpx;
            margin-right: 20rpx;
            //margin-left: 10rpx;
            width: 450rpx;
            margin-left: 10rpx;
            padding-top: 10rpx;
            padding-bottom: 10rpx;
        }

    }
</style>
