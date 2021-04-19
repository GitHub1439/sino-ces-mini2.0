<template>
    <view class="container">
        <!-- 顶部 -->
        <uni-nav-bar :left-icon="'back'"
                     :gradual-change="true"
                     title="授信管理"></uni-nav-bar>
        <!-- 头部 金钱 -->
        <sn-custom-refresh
            @refresherrefresh="onRefresh"
            :is-need-load="false"
            refresher-background="linear-gradient(to right, #EF3E3D,#C4282F)"
        >
            <view class="header" >
                <view class="tist">
                    <text>可用授信(元)</text>
                </view>
                <view class="price">
                    <text>{{detail.creditRemain}}</text>
                </view>
<!--                <view class="btn">-->
<!--                    <text @click='gohexiao'>立即核销</text>-->
<!--                </view>-->
            </view>
            <!-- 中部数据 -->
            <view class="maindata">
                <view class="profit" style="background: url(https://sino-cloud-base.oss-cn-hangzhou.aliyuncs.com/fileupload-product/sino-ces/img/tg-bg.png);background-size: 100% 100%;">
                    <view class="expect">
                        <label>已用额度</label>
                        <text>{{detail.creditCost}}</text>
                    </view>
                    <view class="expect">
                        <label>授信总额</label>
                        <text>{{detail.creditTotal}}</text>
                    </view>
                </view>
                <view class="maindata-l">
                    <view class="maindata-lis sn-column" @click="goOrder('2')" bindtap="goPromotionOrder">
                        <view class="lis-test">
                            <image src="https://sino-cloud-base.oss-cn-hangzhou.aliyuncs.com/fileupload-product/sino-ces/img/iisy.png"></image>
                            <text>在途订单(笔)</text>
                        </view>
                        <view class="lis-num">
                            <text>{{detail.loadOrderTotal}}</text>
                        </view>
                        <view class="lis-b">
                            <text>未完成订单</text>
                        </view>
                    </view>
                    <view class="maindata-lis" @click="goOrder('3')" data-nav="1">
                        <view class="lis-test">
                            <image src="https://sino-cloud-base.oss-cn-hangzhou.aliyuncs.com/fileupload-product/sino-ces/img/iisy.png"></image>
                            <text>待核销订单(笔)</text>
                        </view>
                        <view class="lis-num">
                            <text>{{detail.creditOrderTotal}}</text>
                        </view>
                        <view class="lis-b">
                            <text>已完成待核销</text>
                        </view>
                    </view>
                    <view class="maindata-lis" @click="goOrder('-1')" data-nav="2">
                        <view class="lis-test">
                            <image src="https://sino-cloud-base.oss-cn-hangzhou.aliyuncs.com/fileupload-product/sino-ces/img/iisy.png"></image>
                            <text>打款日志(笔)</text>
                        </view>
                        <view class="lis-num">
                            <text>{{detail.settleTotal}}</text>
                        </view>
                        <view class="lis-b">
                            <text>核销打款记录</text>
                        </view>
                    </view>
                </view>
            </view>
            <view v-if="orderList.length !== 0" @click.stop="goDetail(item)" class="order-item sn-column"  v-for="(item,index) in orderList" :key="index">
                <view class="sn-row-between">
                    <text class="order-no ellipsis">订单号:{{item.orderSn}}</text>
                    <text class="status-text" :style="{'color': getStatus(item.status).color}">{{getStatus(item.status).text}}</text>
                </view>
                <view class="sn-column" v-for="(orderItems,i) in item.orderItems" :key="i">
                    <view class="sn-row-between info">
                        <image class="image" :src="orderItems.productPic"></image>
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
                <view class="sn-row total">
                    <text class="num-text">优惠:¥{{item.promotionAmount+',运费:¥'+item.transportAmount}}</text>
                </view>
                <view class="sn-row total">
                    <text class="num-text">共{{getGoodsNum(item.orderItems,item.factoryGifts)+'件商品 需支付'}}</text>
                    <text class="total-price">￥{{item.payAmount}}</text>
                </view>
            </view>
        </sn-custom-refresh>

    </view>
</template>

<script>
import SnCustomNav from '@/components/sn-custom-nav/sn-custom-nav'
import SnCustomRefresh from '@/components/sn-custom-refresh/sn-custom-refresh'
export default {
    name: '授信管理',
    components: {SnCustomRefresh, SnCustomNav},
    data(){
        return {
            detail: {
                creditCost: 0.00,
                creditOrderTotal: 0,
                creditRecord: [],
                creditRemain: 0.00,
                creditTotal: 0.00,
                loadOrderTotal: 0,
                settleTotal: 0
            },
            orderList: []
        }
    },
    computed: {
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
        }
    },
    async onLoad(){
        await this.getCreditDetail()
        await this.getOrderList()
    },
    methods:{
        /**
         * 获取订单列表
         * */
        async getOrderList(isDialog = true){
            let param = {
                current: 1,
                size: 1,
                queryType: 10
            }
            let data = await this.$get(this.$api.person.orderList, param,isDialog)
            if(data){
                this.orderList = data.records
                console.log(this.orderList)
            }
        },
        onRefresh(){
            this.getCreditDetail()
        },
        async getCreditDetail(){
            let data = await this.$get(this.$api.person.creditDetail,{})
            if(data){
                this.detail = data
            }
        },
        goOrder(index){
            if(index === '-1'){
                this.$util.showToast('查看暂无开放')
                return
            }
            uni.navigateTo({
                url: `/pages-person/order/index?cur=${index}`
            })
        },
        gohexiao(){
            uni.navigateTo({
                url: '/pages-person/order/write-off-index'
            })
        },
        goDetail(item){
            uni.navigateTo({
                url: `/pages-person/order/order-detail?id=${item.id}`
            })
        }
    }
}
</script>

<style scoped lang="scss">
page{
    background-color: #F2F3F3;
}
.container {
    width: 100%;
    font-size: 28rpx;
    overflow: hidden;
}

/* -------- 头部 --------- */
.navbars {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 199;
    width: 100%;
    height: 80rpx;
    line-height: 50rpx;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    color: #fff;
    font-size: 26rpx;
    background-color: #E40137;
}

.navbar {
    position: relative;
    width: 100%;
    text-align: center;

}

.back-icon,
.home-icon {
    /* width: 35rpx;
    height: 35rpx; */
    position: absolute;
    transform: translateY(-50%);
    top: 50%;
    display: flex;
}

.back-icon text {
    display: inline-block;
    width: 25rpx;
    height: 25rpx;
    line-height: 28rpx;
    font-size: 20rpx;
    background-color: #ffffff;
    border-radius: 50%;
    color: #1C394C;
    position: absolute;
    right: 0rpx;
    top: 20rpx;
}

.back-icon {
    left: 10px;
}

.home-icon {
    left: 44px
}

.back-icon image {
    width: 20rpx;
    height: 33rpx;
    margin: auto;
}

.home-icon image {
    width: 20px;
    height: 20px;
    margin: auto;
}

.nav-title,
.nav-icon {
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    font-size: 36rpx;
    font-weight: bolder;
    letter-spacing:2rpx;
    color: #fff;
}

/* header */
.header{
    width: 100%;
    height: 350rpx;
    background: linear-gradient(to right, #EF3E3D,#C4282F);
    color: #fff;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
}
.header .tist,
.header .price,
.header .btn{
    display: block;
    width: 100%;
    text-align: center;
}
.header .tist {
    font-size: 26rpx;
    height: 50rpx;
    line-height: 50rpx;
    margin-top: 30rpx;
}
.header .price{
    font-size: 60rpx;
    font-weight: bold;
    letter-spacing: 6rpx;
    height: 118rpx;
    line-height: 100rpx;
}
.header .btn text{
    display: inline-block;
    width: 200rpx;
    height: 55rpx;
    line-height: 55rpx;
    text-align: center;
    color: #E40137;
    font-weight: bold;
    border-radius: 28rpx;
    background-color: #fff;
    font-size: 24rpx;
}

/* 中部数据 */
.maindata{
    width: 100%;
    background-color: #fff;
    padding-top: 30rpx;
    font-size: 28rpx;
    color: #1C394C;
}
.maindata .profit{
    width: 690rpx;
    height: 160rpx;
    /* padding: 30rpx; */
    /* background-color: #fff; */
    display: flex;
    justify-content: space-around;
    margin: 0 auto;
    margin-top: -80rpx;
    position: relative;
    /* background: url('https://sino-cloud-base.oss-cn-hangzhou.aliyuncs.com/fileupload-product/sino-ces/img/tg-bg.png'); */
    background: #fff;
    /* background-size: 100%; */
}
.maindata .profit image{
    width: 630rpx;
    height: 100rpx;
    position: absolute;
    top: 0;
    left: 0;
    /* z-index: -1; */
}

.maindata .profit .expect{
    width: 49%;
    height: 100rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: space-between;
    font-size: 30rpx;
    font-weight: bold;
    margin: 30rpx 0;
    /* border-right: 2rpx solid #E6E6E6; */
}

.maindata .profit .expect label,
.maindata .profit .expect text{
    display: block;
    width: 100%;
    text-align: center;
}

.maindata .profit .expect label{
    /* height: 60rpx; */
}
.maindata .profit .expect text{
    font-size: 46rpx;
    color: #E40137;
}

.maindata-l{
    width: 750rpx;
    display: flex;
    justify-content: space-around;
    padding: 35rpx 0;
}
.maindata-l .maindata-lis{
    width: 33.3%;
    text-align: center;
    border-right: 2rpx dotted #909BAA;
    font-weight: bold;
}
.maindata-l .maindata-lis:last-child{
    border: 0;
}
.maindata-lis .lis-test{
    font-size: 24rpx;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
}
.maindata-lis .lis-num{
    font-size: 40rpx;
    margin-top: 10rpx;
    color: #E40137;
}
.maindata-lis .lis-b{
    font-size: 22rpx;
    margin-top: 5rpx;
    color: #A1A0A1;
    font-weight: 400;
}
.maindata-lis .lis-test image{
    width: 25rpx;
    height: 25rpx;
    margin-right: 10rpx;
}

/* 中间选项 */
.option{
    width: 750rpx;
    margin: 30rpx 0;
    /* display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    padding-bottom: 70rpx; */
}

.option .option-lis{
    width: 220rpx;
    height: 210rpx;
    background-color: #fff;
    border-radius: 10rpx;
    margin-bottom: 20rpx;
    text-align: center;
    /* padding: 10rpx; */
    position: relative;
    margin-left: 23rpx;
    float: left;
}
.option .option-lis text,
.option .option-lis label{
    display: block;
}

.option .option-lis image{
    width: 60rpx;
    height: 60rpx;
    margin: 15rpx;
}
.option .option-lis label{
    font-size: 26rpx;
    font-weight: bold;
    margin-bottom: 15rpx;
}
.option .option-lis text{
    color: #A1A0A1;
    font-size: 20rpx;
}

/* .option-lis .test{
	position: absolute;
	bottom: -80rpx;
	right: 60rpx;
	background-color: #fff;
	box-shadow: 0 0 10rpx #ccc;
}
.option-lis .test label{
	position: absolute;
	right: 30rpx;
	top: -37rpx;
	display: inline-block;
	width: 0;
	border: 20rpx solid transparent;
	border-bottom-color: #fff;
}
.option-lis .test text{
	display: inline-block;
	min-width: 630rpx;
	height: 36rpx;
	text-align: center;
	font-size: 20rpx;
	color: #E40137;
} */

/* 中间提示 */
.tistol{
    width: 670rpx;
    padding: 0 40rpx;
    margin-top: 20rpx;
    margin-bottom: 20rpx;
    height: 60rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    color: #1C394C;
    font-size: 24rpx;
    background-color: #FCF9DA;
}
.tistol .tistol-main{
    display: flex;
    align-items: center;
    align-content: center;
}
.tistol image{
    width: 23rpx;
    height: 23rpx;
}
.tistol .tistol-main image{
    margin-right: 20rpx;
    width: 24rpx;
    height: 24rpx;
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
        margin-top: 22rpx;
        .empty{
            min-width: 152rpx;
            padding-left: 15rpx;
            padding-right: 15rpx;
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
        .solid{
            min-width: 152rpx;
            padding-left: 15rpx;
            padding-right: 15rpx;
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
</style>
