<template>
    <view class="sn-column">
        <sn-sticky :offset-top="0" enable="true" z-index="999">
            <view class="list-contaier">
                <view class="sn-row top-view">
                    <view @click="clickTab(index)" :style="{'width': 750/tabs.length +'rpx'}" class="tab-item sn-column-between" v-for="(item,index) in tabs">
                        <text class="text" :class="{'un-select':currentTab !== index}">{{item.text+(item.num!==0?'('+ item.num +')':'')}}</text>
                        <view v-if="currentTab === index" class="bottom-line"></view>
                    </view>
                </view>
            </view>
        </sn-sticky>
        <view v-show="currentTab === i" v-for="(tab,i) in tabs" :key="i">
            <sn-custom-refresh
                @refresherrefresh="onRefresh"
                @scrolltolower="scrollBottem"
                :load-status="tab.loadStatus"
                :is-need-load="isNeedLoad(tab)"
            >
                <view v-if="tab.list.length !== 0" class="sn-column" v-for="(item,index) in tab.list">
                    <view class="item-view sn-row" :class="{'mgt32': index === 0}" @click="itemClicked(item)">
                        <image :src="item.pic"></image>
                        <view class="item-info">
                            <text class="text ellipsis2">{{item.productName}}</text>
                            <view class="tip">品牌自营</view>
                            <view class="price sn-row"><text class="uint">¥</text>{{(item.minPrice === item.maxPrice) ? item.minPrice : (item.minPrice + '~' + item.maxPrice)}}</view>
                            <image class="cart-image" src="/static/images/person/icon_gwc.png" @click.stop="addCartClicked(item)"></image>
                        </view>
                    </view>
                    <view class="item-line"></view>
                </view>
                <sn-nodata  v-if="tab.list.length ===0" :title="currentTab===0?'暂无收藏':'暂无常买'"></sn-nodata>
            </sn-custom-refresh>
        </view>

    </view>
</template>

<script>
import SnCustomRefresh from '@/components/sn-custom-refresh/sn-custom-refresh'
export default {
    name: 'index',
    components: {SnCustomRefresh},
    data(){
        return {
            currentTab: 0,
            tabs:[
                {
                    text: '产品收藏',
                    num: 0,
                    list:[],
                    current: 1,
                    size: 10,
                    loadStatus: 'loadmore'
                },
                {
                    text: '最新常买',
                    num: 0,
                    list:[],
                    current: 1,
                    size: 10,
                    loadStatus: 'loadmore'
                }
            ],
        }
    },
    computed: {
        isNeedLoad(){
            return (tab)=>{
                return tab.list.length >= tab.size
            }
        }
    },
    onLoad(){
    },
    onShow(){
        this.getCartNum();
        if (this.currentTab === 0) {
            this.getCollect();
        }else {
            this.getOffenBuy();
        }
    },
    methods:{

        async getCartNum () {

            let data = await this.$get(this.$api.cart.offenBuyNum, {}, false);

            if (data) {
                this.tabs.forEach((item,index) => {
                    if (index === 0) {
                        item.num = data.collectCount;
                    }else {
                        item.num = data.oftenCount;
                    }
                })
            }
        },


        /**
         * tab页点击事件
         * **/
        clickTab(i){
            this.currentTab = i
            if (this.tabs[i].list.length === 0) {
                if(this.currentTab ===0){
                    this.getCollect()
                }else {
                    this.getOffenBuy()
                }
            }
            this.$forceUpdate()
        },
        /**
         * 刷新操作
         * */
        onRefresh(){
            if(this.currentTab === 0){
                this.getCollect()
            }else {
                this.getOffenBuy()
            }
        },
        /**
         * 上拉加载操作
         * */
        scrollBottem(){
            let that = this
            let item = this.tabs[that.currentTab]
            item.current ++
            if(this.currentTab ===0){
                this.getCollect()
            }else {
                this.getOffenBuy()
            }
        },
        /**
         * 最近常买
         * */
        async getOffenBuy(){
            let item = this.tabs[this.currentTab]
            let param = {
                current: item.current,
                size: item.size
            }
            let data = await  this.$get(this.$api.cart.offenBuy,param)
            if(data){
                if(item.current === 1){
                    item.list = data
                }else {
                    if(data.length ===0){
                        item.loadStatus = "nomore"
                    }else {
                        item.list = item.list.concat(data)
                    }
                }
                item.list.forEach((value,key) => {
                    if (value.albumPics) {
                        let pic = value.albumPics.split(",")[0];
                        value.pic = pic;
                    }
                })
            }
        },
        /**
         * 获取收藏列表
         * */
        async getCollect(){
            let item = this.tabs[this.currentTab]
            let param = {
                storeId: this.$storage.get('storeId'),
                current: item.current,
                size: item.size
            }
            let data = await this.$post(this.$api.person.collectList,param)
            if(data){
                if(item.current === 1){
                    item.list = data;
                }else {
                    if(data.length ===0){
                        item.loadStatus = "nomore"
                    }else {
                        item.list = item.list.concat(data)
                    }
                }
                item.list.forEach((value,key) => {
                    if (value.albumPics) {
                        let pic = value.albumPics.split(",")[0];
                        value.pic = pic;
                    }
                })
            }
        },

        async addCartClicked (item) {
            let storeId = this.$storage.get("storeId")

            let parms = {
                "productId": item.productId,
                "quantity": item.minPurchase,
                "storeId": storeId
            }

            let data = await this.$post(this.$api.cart.cartNum, parms, true);

            if (data) {

                uni.showToast({
                    title: "加入购物车成功",
                    icon: "none"
                })

                uni.navigateTo({
                    url: "/pages/cart/index"
                })
            }
        },

        itemClicked (item){
            uni.navigateTo({
                url: "/pages-home/detail/index?productId="+item.productId
            })
        }
    }
}
</script>

<style scoped lang="scss">
.list-contaier{
    background-color: #F5F5F7;
}
.top-view{
    width: 750rpx;
    height: 98rpx;
    border-radius: 0rpx 0rpx 40rpx 40rpx;
    box-shadow: 0 0 3px #e2e2e2;
    //position: absolute;
    //top: 0;
    background-color: #ffffff;
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
.item-view{
    width: 750rpx;
    height: 244rpx;
    opacity: 1;
    padding-left: 30rpx;
    padding-right: 30rpx;
    padding-top: 36rpx;
    padding-bottom: 36rpx;
    background-color: #fff;
    image{
        width: 172rpx;
        height: 172rpx;
        border: 1px solid #E2E2E2;
        border-radius: 4rpx;
    }
    &.mgt32{
        margin-top: 32rpx;
        border-radius: 40rpx 40rpx 0rpx 0rpx;
    }
    .item-info{
        width: 488rpx;
        height: 172rpx;
        margin-left: 24rpx;
        position: relative;
        .text{
            width: 488rpx;
            height: 80rpx;
            font-size: 28rpx;
            font-weight: bold;
            color: #444444;
            position: absolute;
            left: 0;
            top: 0;
        }
        .tip{
            position: absolute;
            top: 83rpx;
            width: 100rpx;
            height: 32rpx;
            background: linear-gradient(42deg, #FF5734 0%, #FF3636 100%);
            border-radius: 4rpx;
            font-size: 22rpx;
            font-weight: 400;
            line-height: 32rpx;
            color: #FFFFFF;
            text-align: center;
            margin-top: 9rpx;
        }
        .price{
            position: absolute;
            bottom: 0;
            left: 0;
            height: 32rpx;
            font-size: 32rpx;
            font-weight: bold;
            color: #EC3A40;
            opacity: 1;
            align-items: center;
            .uint{
                font-size: 26rpx;
                font-weight: bold;
                color: #EC3A40;
                margin-right: 5rpx;
            }
        }
        .cart-image{
            position: absolute;
            right: 0;
            bottom: 0;
            width: 60rpx;
            height: 60rpx;
            opacity: 1;
            border-radius: 30rpx;
        }
    }
}
.item-line{
    width: 720rpx;
    height: 1rpx;
    background: #E2E2E2;
    opacity: 1;
    margin-left: 15rpx;
}
</style>
