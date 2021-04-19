<template>
    <view class="sn-column">
        <uni-nav-bar gradual-change title="器械邦"></uni-nav-bar>
        <sn-custom-refresh
            :is-need-load="false"
            refresher-background="linear-gradient(to right, #EF3E3D,#C4282F)"
        >
            <view class="head-view">
                <view class="head sn-column">
                    <view class="sn-row-between sn-row-center">
                        <view class="sn-row-center" style="margin-right: 200rpx">
                            <image class="logo" src="/static/images/ic_logo2.png"></image>
                            <text class="title">器械邦</text>
                        </view>
                        <button class="btn" :open-type="'contact'" :plain="true">
                            入驻咨询
                        </button>
                    </view>
                    <text class="line-text mgt26">您的医疗器械一站式平价采购平台。</text>
                    <text class="line-text">高效整合厂商资源，安全拓宽销售渠道，让全球的厂商资源 和活动信息直达终端，保证各类促销活动的有效落地，加快 商品的流通，成为您采销过程中的好帮手。</text>
                </view>
            </view>
            <view class="line-view"></view>
            <view class='sub-title'>
                <text >热卖产品</text>
            </view>
            <view class='hot-product-view'>
                <view @click="goGoodDetail" class='hot-product-item' v-for='(item,index) in hotPros'
                      :style="[{marginLeft: (index != 0 ? 10 : 0) + 'px'}]"
                      :key='index'>
                    <image :src="item.img?item.img:'/static/images/ic_no_image.png'"></image>
                    <text class="text ellipsis2">{{item.title}}</text>
                </view>
            </view>
            <view class="bottom-view sn-row">
                <view class="sn-column">
                    <text class="title">糖尿病并发症风险评估</text>
                    <text class="sub-title ellipsis2">1分钟预测你未来10年严重并发症风险 并获取最高万元保障金申请资格。</text>
                </view>
                <image src="/static/images/person/ic_join_txt.png"></image>
            </view>
        </sn-custom-refresh>
    </view>
</template>

<script>
import UniNavBar from '@/components/uni-nav-bar/uni-nav-bar'
export default {
    name: 'join-consult',
    components: {UniNavBar},
    data(){
        return {
            hotPros: [
                {title:'安稳瓶装试条套装~50支套(专用透明)',img: 'https://sino-cloud-base.oss-cn-hangzhou.aliyuncs.com/fileupload-product/sino-ces2.0/img/ic_hot_pro_1.png'},
                {title:'安稳免调码瓶装试条套装~50支(透明)',img: 'https://sino-cloud-base.oss-cn-hangzhou.aliyuncs.com/fileupload-product/sino-ces2.0/img/ic_hot_pro_2.png'},
                {title:'安稳+瓶装试条套装~50支(透明)',img: 'https://sino-cloud-base.oss-cn-hangzhou.aliyuncs.com/fileupload-product/sino-ces2.0/img/ic_hot_pro_3.png'}
            ]
        }
    },
    methods:{
        goConsult(){
            this.$util.showToast('入驻咨询')
        },
        goGoodDetail(){
            // uni.navigateTo({
            //     url: "/pages-home/detail/index?productId=1364525226117926914&disable=0"
            // })
        }
    }
}
</script>

<style lang="scss">
    page{
        background-color: #FFFFFF;
    }
    .head-view{
        background: linear-gradient(to right, #EF3E3D,#C4282F);
        .head{
            width: 750rpx;
            height: 349rpx;
            background-color: #FFFFFF;
            border-radius: 40rpx 40rpx 0px 0px;
            padding-left: 32rpx;
            padding-right: 32rpx;
            padding-top: 48rpx;
            padding-bottom: 31rpx;
            .logo{
                width: 96rpx;
                height: 96rpx;
            }
            .title{
                font-size: 46rpx;
                font-weight: bold;
                color: #222222;
                opacity: 1;
                margin-left: 24rpx;
            }
            .btn{
                width: 200rpx;
                height: 68rpx;
                background: linear-gradient(219deg, #C11920 0%, #EC3A40 100%);
                opacity: 1;
                border-radius: 34rpx;
                font-size: 30rpx;
                font-weight: bold;
                line-height: 68rpx;
                color: #FFFFFF;
                text-align: center;
                border: none;
            }
            .line-text{
                width: 676rpx;
                font-size: 26rpx;
                font-weight: 400;
                color: #888888;
                opacity: 1;
            }
            .mgt26{
                margin-top: 26rpx;
            }
        }
    }
    .line-view{
        width: 750rpx;
        height: 20rpx;
        background: #F5F5F7;
        opacity: 1;
    }
    .sub-title {
        margin-top: 24rpx;
        text {
            margin-left: 32rpx;
            font-size: 32rpx;
            font-weight: bold;
            color: #222222;
        }
    }

    .hot-product-view {
        flex-direction: row;
        display: flex;
        margin-left: 32rpx;
        margin-top: 24rpx;
        .hot-product-item {
            flex-direction: column;
            display: flex;
            image {
                width: 216rpx;
                height: 216rpx;
                border-radius: 12rpx;
            }

            .text{
                max-width: 216rpx;
                color: #222222;
                font-size: 26rpx;
                font-weight: 500;
                margin-top: 16rpx;
            }
        }
    }
    .bottom-view{
        width: 686rpx;
        height: 260rpx;
        background-image: url($ic_join_bg);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        box-shadow: 0rpx 8rpx 16rpx rgba(226, 231, 242, 0.4);
        border-radius: 12rpx;
        left: 32rpx;
        bottom: 97rpx;
        position: absolute;
        image{
            width: 210.78rpx;
            height: 198.57rpx;
            margin-top: 29rpx;
            margin-left: 15rpx;
        }
        .title{
            font-size: 36rpx;
            font-weight: 800;
            color: #FFFFFF;
            text-shadow: 0rpx 3rpx 6rpx #F03041;
            opacity: 1;
            margin-top: 50rpx;
            margin-left: 26rpx;
        }
        .sub-title{
            width: 424rpx;
            margin-left: 26rpx;
            margin-top: 20rpx;
            font-size: 26rpx;
            color: #fff;
        }
    }
</style>
