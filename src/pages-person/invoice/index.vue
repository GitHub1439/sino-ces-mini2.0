<template>
    <view class="container">
        <sn-sticky :offset-top="0" enable="true" z-index="999">
            <view class="list-contaier">
                <view class="sn-row top-view">
                    <view @click="clickTab(index)" :style="{'width': 750/tabs.length +'rpx'}" class="tab-item sn-column-between" v-for="(item,index) in tabs" :key="index">
                        <text class="text" :class="{'un-select':currentTab !== index}">{{item.text+(item.num!==0?'('+ item.num +')':'')}}</text>
                        <view v-if="currentTab === index" class="bottom-line"></view>
                    </view>
                </view>
            </view>
        </sn-sticky>
        <view class="topview"/>
        <view class="sn-column" v-if="currentTab === i" v-for="(tab,i) in tabs" :key="i">
            <sn-custom-refresh
                :distance-type="1"
                @refresherrefresh="onRefresh"
                :is-need-load="false"
                :load-status="tab.loadStatus"
            >
                <view v-if="currentTab === 0" class="cart-item-view sn-column" :class="{'first': index === 0,'last': index === tab.list.length - 1}" v-for="(item,index) in tab.list" :key="index">
                    <view @click="selectOperate(item)" class="content sn-row-between">
                        <view class="sn-row left-content">
                            <image :src="item.isSelect? selectStr: unSelectStr"></image>
                            <view class="sn-column-between info">
                                <view class="sn-column">
                                    <text class="order-no ellipsis">{{item.orderSn}}</text>
                                    <text class="order-sub ellipsis">{{item.orderContent}}</text>
                                </view>
                                <text class="time ellipsis">{{item.createTime}}</text>
                            </view>
                        </view>
                        <view class="sn-column-between info-two">
                            <view class="sn-column">
                                <view class="price"><text class="unit">¥</text>
                                    {{item.totalAmount}}</view>
                                <text class="status">{{getStatus(item.status).text}}</text>
                            </view>
                        </view>
                    </view>
                    <view class="line-view"></view>
                </view>
                <view v-if="currentTab === 1"  v-for="(item,index) in tab.list" :key="index">
                    <view class="sn-column two-cart-view">
                        <view class="sn-row-between top">
                            <text class="title">{{item.billHeader}}</text>
                            <text class="tip">{{getInvoiceText(item.billType)}}</text>
                        </view>
                        <view class="item sn-column">
                            <text class="title">{{item.orderSn}}</text>
                            <text class="subtitle ellipsis">{{item.orderContent}}</text>
                            <text class="price">￥{{item.totalAmount}}</text>
                        </view>
                        <view class="sn-row-between top">
                            <text class="time">{{item.createTime}}</text>
                            <text class="time">{{getStatus(item.status).text}}</text>
                        </view>
                    </view>
                </view>
                <sn-nodata  v-if="tab.list.length===0" title="暂无未开票"></sn-nodata>
            </sn-custom-refresh>
        </view>

        <view v-if="currentTab === 0" class='cart-fiexd-view'>
<!--            <view class='select-all-view'>-->
<!--                <image :src='isAllSelect ? selectStr : unSelectStr'></image>-->
<!--                <text>全选</text>-->
<!--            </view>-->
            <view class='settlement-view'>
                <view class='price-view'>
                    <view class='total-price-view'>
                        <text>合计：</text>
                        <text class='total-price-text'>￥{{totalPrice}}</text>
                    </view>
                    <text v-if="totalPrice > 300" class='free-text'>免运费</text>
                </view>
                <view @click="toApply" class='settlement-text'>
                    去开票
                </view>
            </view>
        </view>
        <view class="bottom-line-view" v-if='$util.isIphonex()'></view>
    </view>
</template>

<script>
import {mapState} from 'vuex'
import UniNavBar from '@/components/uni-nav-bar/uni-nav-bar'
import SnCustomRefresh from '@/components/sn-custom-refresh/sn-custom-refresh'

export default {

    components: {
        SnCustomRefresh,
        UniNavBar,
    },
    data() {
        return {
            tabs:[
                {
                    text: '未开票',
                    num: 0,
                    list: [],
                    billStatus: 0,
                    current:1,
                    size:10,
                    loadStatus: 'loadmore'
                },
                {
                    text: '开票记录',
                    num: 0,
                    list: [],
                    current: 1,
                    size: 10,
                    billStatus: 1,
                    loadStatus: 'loadmore'
                }
            ],
            isShow: true,
            // 未选中图片
            unSelectStr: "/static/images/home/un-select.png",
            // 选中图片
            selectStr: "/static/images/home/select.png",
            // 可以减图片
            normalReduceStr: "/static/images/cart/normal-reduce.png",
            // 不可减图片
            unReduceStr: "/static/images/cart/un-reduce.png",
            currentTab: 0,
            // 是否全部选中
            isAllSelect: false,
            totalPrice: '0.00',
            invoiceTypes: [
                {text:'普通发票',value:1,selected:true},
                {text:'电子发票',value:2,selected:false},
                {text:'增值税发票',value:3,selected:false}
            ],


        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.common.userInfo,
            loginUser: state => state.common.loginUser,
            token: state => state.common.token
        }),
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
        getInvoiceText(){
            return (type) =>{
                let {invoiceTypes} = this
                let text = ''
                type = Number(type)
                invoiceTypes.forEach(e=>{
                    if (type === Number(e.value)) {
                        text = e.text
                    }
                })
                return text
            }
        }

    },
    onLoad(){
        this.getInvoiceList()
        uni.$on('refreshBill',()=>{
            this.getInvoiceList()
        })
    },
    onUnload(){
        uni.$off('refreshBill')
    },
    methods: {
        /**
         * 申请开票跳转
         * */
        toApply(){
            let list = this.tabs[0].list.filter(o=> o.isSelect === true)
            if(list.length === 0){
                this.$util.showToast('请选择开票选项')
                return
            }
            let item = list [0]
            uni.navigateTo({
                url: `/pages-person/invoice/apply?item=${encodeURIComponent(JSON.stringify(item))}`
            })
        },
        /**
         * tab页点击事件
         * **/
        clickTab(i){
            this.currentTab = i
            this.getInvoiceList()
            this.$forceUpdate()
        },
        /**
         * 刷新事件
         * */
        onRefresh(){
            let that = this
            let item = this.tabs[that.currentTab]
            item.loadStatus = 'loadmore'
            this.triggered = false
            that.getInvoiceList()
        },
        /**
         * 获取开票列表
         * */
        async getInvoiceList(){
            let item = this.tabs[this.currentTab]
            let param = {
                billStatus: item.billStatus
            }
            let data = await this.$get(this.$api.person.billList,param)
            if(data){
                item.list = data
                item.list.forEach(e=>{
                    e.isSelect = false
                })
                console.log(data)
            }
        },
        /**
         * 单选操作
         * */
        selectOperate(e){
            let item = this.tabs[this.currentTab]
            item.list.forEach(o=>{
                e.isSelect = e.isSelect || false
                if(e.id === o.id){
                    e.isSelect = !e.isSelect
                }else {
                    e.isSelect = false
                }

            })
            this.getTotalPrice()
            this.$forceUpdate()
        },
        getTotalPrice:function() {
            this.totalPrice = '0.00'
            let item = this.tabs[this.currentTab]
            item.list.forEach((item) => {
                if (item.isSelect) {
                    this.totalPrice = item.totalAmount
                }
            });
        }
    }
}
</script>

<style lang="scss" scoped>

.list-contaier{
    background-color: #F5F5F7;
}

.top-view{
    width: 750rpx;
    height: 98rpx;
    border-radius: 0rpx 0rpx 40rpx 40rpx;
    background-color: #ffffff;
    box-shadow: 0 0 3px #e2e2e2;
    .tab-item{
        width: 187.5rpx;
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

.cart-item-view {
    width: 750rpx;
    justify-content: flex-start;
    background-color: #FFFFFF;
    .content{
        width: 690rpx;
        margin-left: 30rpx;
        margin-top: 36rpx;
        align-items: center;
        .left-content{
            align-items: center;
            image {
                width: 40rpx;
                height: 40rpx;
                margin-right: 12rpx;
            }
        }
        .price{
            font-size: 48rpx;
            color: #222222;
            margin-bottom: 10rpx;
            .unit{
                font-size: 32rpx;
                color: #222222;
            }
        }
        .status{
            font-size: 26rpx;
            font-weight: 400;
            color: #888888;
            opacity: 1;
            text-align: right;
        }
        .info{
            height: 148rpx;
            margin-left: 28rpx;
        }
        .info-two{
            height: 148rpx;
            justify-content: flex-end;
            //margin-left: 37rpx;
        }
        .order-no{
            font-size: 32rpx;
            color: #222222;
            color: #222222;
        }
        .order-sub{
            width: 467rpx;
            height: 45rpx;
            font-size: 32rpx;
            color: #222222;
        }
        .time{
            font-size: 26rpx;
            font-weight: 400;
            color: #787D88;
        }
        image{
            width: 40rpx;
            height: 40rpx;
        }
    }
    &.first{
        width: 750rpx;
        height: 238rpx;
        margin-top: 32rpx;
        border-top-left-radius: 40rpx;
        border-top-right-radius: 40rpx;
    }
    &.last{
        margin-bottom: 109rpx;
    }
    .line-view {
        margin-top: 43rpx;
        width: 720rpx;
        height: 2rpx;
        background-color: #E2E2E2;
        margin-left: 30rpx;
    }
}

.cart-fiexd-view {
    position: fixed;
    width: 750rpx;
    height: 109rpx;
    background: #FFFFFF;
    box-shadow: 0rpx -3rpx 6rpx rgba(226, 231, 242, 0.4);
    bottom: constant(safe-area-inset-bottom);
    bottom: env(safe-area-inset-bottom);
    flex-direction: row;
    display: flex;
    z-index: 99;
    justify-content: flex-end;
    align-items: center;

    .select-all-view {
        flex-direction: row;
        display: flex;
        margin-left: 30rpx;
        justify-content: center;
        align-items: center;
        image {
            width: 40rpx;
            height: 40rpx;
            margin-right: 12rpx;
        }

        text {
            font-size: 32rpx;
            font-weight: 500;
            line-height: 45rpx;
            color: #444444;
        }
    }

    .settlement-view {
        flex-direction: row;
        display: flex;

        .price-view {
            flex-direction: column;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            margin-right: 20rpx;

            .total-price-view {

                text {
                    font-size: 26rpx;
                    font-weight: 500;
                    color: #888888;
                }

                .total-price-text {
                    font-size: 32rpx;
                    font-weight: bold;
                    line-height: 45rpx;
                    color: #222222;
                }

                .free-text {
                    font-size: 26rpx;
                    font-weight: 400;
                    color: #666666;
                }
            }
        }

        .settlement-text {
            color: #FFFFFF;
            align-items: center;
            line-height: 109rpx;
            width: 200rpx;
            height: 109rpx;
            text-align: center;
            background: linear-gradient(132deg, #C11920 0%, #EE2626 100%);
            font-size: 32rpx;
            font-weight: bold;
        }
    }
    .bottom-line-view {
        height: 68rpx;
        background-color: #FFFFFF;
        width: 100%;
        position: fixed;
        bottom: 0;
        z-index: 99;
    }
    .record-view{
        width: 690rpx;
        height: 466rpx;
        background: #FFFFFF;
        box-shadow: 0rpx 8rpx 16rpx rgba(226, 231, 242, 0.4);
        opacity: 1;
        border-radius: 12rpx;
    }
}
    .two-cart-view{
        width: 690rpx;
        margin-left: 30rpx;
        margin-top: 32rpx;
        background: #FFFFFF;
        box-shadow: 0rpx 8rpx 16rpx rgba(226, 231, 242, 0.4);
        opacity: 1;
        border-radius: 12rpx;
        padding-left: 30rpx;
        padding-right: 30rpx;
        padding-top: 28rpx;
        align-items: center;
        &.mgb{
            margin-bottom: 32rpx;
        }
        .top{
            width: 630rpx;
        }
        .item{
            width: 630rpx;
            height: 140rpx;
            background: #F6F7FA;
            border-radius: 8rpx;
            margin-top: 16rpx;
            position: relative;
            .title{
                font-size: 28rpx;
                font-weight: 500;
                color: #222222;
                opacity: 1;
                position: absolute;
                left: 24rpx;
                top: 28rpx;
            }
            .subtitle{
                max-width: 409rpx;
                font-size: 28rpx;
                color: #222222;
                opacity: 1;
                left: 24rpx;
                top: 72rpx;
                position: absolute;
            }
            .price{
                font-size: 32rpx;
                color: #222222;
                opacity: 1;
                right: 24rpx;
                top: 68rpx;
                position: absolute;
            }
        }
        .time{
            font-size: 26rpx;
            font-weight: 400;
            line-height: 37px;
            color: #787D88;
        }
        .tip{
            width: 100rpx;
            height: 32rpx;
            background: linear-gradient(42deg, #FF5734 0%, #FF3636 100%);
            border-radius: 4rpx;
            font-size: 22rpx;
            font-weight: 400;
            color: #FFFFFF;
            opacity: 1;
            text-align: center;
        }
    }


</style>
