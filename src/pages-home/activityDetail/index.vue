<template>

    <view class="container">
        <uni-nav-bar :gradual-change="true"
                     :is-need-back="true"
                     left-icon="back" title="活动详情"></uni-nav-bar>

        <view class="activity-content-view">

            <view class="activity-title-text">
                {{activityData.name}}
            </view>

            <view class="validity-text">{{activityData.startDate + '~' + activityData.endDate}}</view>

            <!--产品范围-->
            <view>
                <view class="sn-row product-title-view">
                    <image src="/static/images/home/range.png"></image>
                    <text class="product-title-text">产品范围：</text>
                    <text class="product-description-text">购买此范围内的产品，将根据活动策略赠送相应的赠品</text>
                </view>

                <view class="sn-column range-view">
                    <text v-for="(item,index) in activityData.listProductRange"
                          :key="index"
                          :style="{marginTop: (index === 0 ? 60 : 10) + 'rpx'}"
                    >{{index + 1 + '、' + item.productName}}</text>
                </view>
            </view>

            <view>
                <view class="sn-row product-title-view">
                    <image src="/static/images/home/range.png"></image>
                    <text class="product-title-text">赠品清单：</text>
                    <text class="product-description-text">本次活动涵盖的赠品及数量</text>
                </view>

                <view class="sn-column gift-view">
                    <view class="sn-row-center gift-item-view"
                          v-for="(item,index) in activityData.listGift"
                          :style="{marginTop: (index === 0 ? 60 : 10) + 'rpx'}">
                        <text class="gift-title-text">{{index + 1 + '、' + item.productName}}</text>
                        <text class="count-text">x {{item.giftNum}}</text>
                    </view>
                </view>
            </view>

            <view class="activity-explain-view">
                <view class="line-view"></view>
                <view class="activity-title-text" :style="{color: '#222222'}">
                    活动说明
                </view>
                <view class="description-text">
                    <u-parse  no-data="暂无数据" :content="activityData.description"></u-parse>
                </view>
            </view>

        </view>

    </view>

</template>

<script>
import uParse from '@/components/u-parse/u-parse'

export default {

    components: {
        uParse
    },

    onLoad (parms) {
        this.id = parms.id;
        console.log(this.id)
        this.fetchData();
    },

    data () {
        return {
            id: "",
            activityData: {
                name: "",
                startDate: "",
                endDate: "",
            }
        }
    },

    methods: {
        /// 获取活动详情
        async fetchData() {

            let data = await this.$get(this.$api.home.activityDetail, {id: this.id}, true);

            if (data) {

                if (data.startDate) {
                    data.startDate = data.startDate.split(' ')[0]
                }
                if (data.endDate) {
                    data.endDate = data.endDate.split(' ')[0]
                }

                this.activityData = data;

            }
        }
    }
}

</script>

<style lang="scss" scoped>
    .container {
        width: 100%;
        height: 100%;
        background: linear-gradient(to right, #EF3E3D,#C4282F);

        .activity-content-view {

            .activity-title-text {
                margin-top: 30rpx;
                width: 100%;
                text-align: center;
                font-size: 32rpx;
                font-weight: 800;
                color: #FFFFFF;
            }
            .validity-text {
                width: 100%;
                text-align: center;
                font-size: 24rpx;
                font-weight: 800;
                color: #FFFFFF;
            }

            .product-title-view {
                justify-content: flex-start;
                align-items: center;
                margin-top: 30rpx;
                image {
                    width: 30rpx;
                    height: 30rpx;
                    margin-left: 30rpx;
                }

                .product-title-text {
                    margin-left: 20rpx;
                    font-size: 32rpx;
                    font-weight: 800;
                    color: #FFFFFF;
                }

                .product-description-text {
                    font-size: 20rpx;
                    font-weight: 400;
                    color: #FFFFFF;
                }
            }

            .range-view {
                text {
                    margin-left: 80rpx;
                    font-size: 23rpx;
                    font-weight: 400;
                    color: #FFFFFF;
                }
            }


            .gift-view {

                .gift-item-view{
                    .gift-title-text {
                        margin-left: 80rpx;
                        font-size: 23rpx;
                        font-weight: 400;
                        color: #FFFFFF;
                        width: 500rpx;

                    }

                    .count-text {
                        width: 90rpx;
                        text-align: center;
                        margin-right: 80rpx;
                        font-size: 23rpx;
                        font-weight: 400;
                        color: #FFFFFF;
                    }
                }
            }

            .activity-explain-view {
                margin-top: 100rpx;
                border-radius: 12rpx;
                background-color: #F9D7C7;
                width: 690rpx;
                margin-left: 30rpx;

                .line-view {
                    width: 100%;
                    height: 20rpx;
                }

                .explain-title-text {
                    width: 100%;
                    text-align: center;
                    font-size: 23rpx;
                    font-weight: 400;
                    color: #888888;
                }

                .description-text {
                    padding-top: 30rpx;
                    padding-left: 30rpx;
                    padding-right: 30rpx;
                    padding-bottom: 120rpx;
                }
            }
        }
    }

</style>
