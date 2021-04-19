<template>

    <view class="container">

        <sn-sticky class="sticky" :offset-top="0" enable="true" z-index="80">
            <view class="search-view">
                <view class="input-view">
                    <image src="/static/images/home/search1.png"></image>
                    <input v-model="searchStr" placeholder="输入点什么吧" confirm-type="search" @change="search" @confirm="search"/>
                    <image class="cloose-image" v-if="searchStr"
                           @click="clearInput"
                           src="/static/images/regist/close-tip.png"></image>
                </view>
            </view>
        </sn-sticky>

        <view class="list-view" v-if="searchList.length > 0">
            <view class="list-item-view" v-for="(item,index) in searchList" :key="index">
                <view class="list-item" @click="itemClicked(item)">
                    <image class="productImage" :src="item.pic"></image>

                    <view class="item-right-view">
                        <text class="name-text">{{item.productName}}</text>
                        <view class="brand-text">
                            <text>品牌自营</text>
                        </view>

                        <view class="bottom-view">
                            <text v-if="item.quantity > 0">￥{{item.price}}</text>

                            <text v-else>￥{{(item.minPrice === item.maxPrice) ? item.minPrice : (item.minPrice + '~' + item.maxPrice)}}</text>
                            <view class="add-view" @click.stop="">
                                <image v-if="item.quantity > 0" src='/static/images/home/reduce.png' @click.stop="searchReduceClicked(item)"></image>
                                <input v-if="item.quantity > 0" type="number" class="num_input" v-model="item.quantity"  @blur="productNumChange(item,index,$event)"/>
                                <image src='/static/images/home/add.png' @click.stop="searchAddClicked(item)"></image>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="bottom-line-view"></view>
            </view>
        </view>

        <sn-nodata v-else></sn-nodata>

    </view>

</template>

<script>

import SnNodata from "@/components/sn-nodata/sn-nodata"

export default {

    components: {
        SnNodata
    },

    onShow() {
        this.stroeId = this.$storage.get('storeId');
    },

    data () {
        return {
            // 商铺id
            stroeId: "",
            searchStr: "",
            // 搜索产品列表
            searchList: [],
            // 选中产品
            selectProductModel: {},
            // 当前页数
            current: 1,
        }
    },

    onPullDownRefresh(){
        setTimeout(()=>{
            if (this.searchStr.length > 0) {
                this.current = 1;
                this.searchList = [];
                this.fetchData();
            }
            uni.stopPullDownRefresh();
        },500)
    },

    onReachBottom(){
        this.current ++;
        this.fetchData();
    },

    methods: {

        /// 搜索列表接口
        async fetchData () {

            let parms = {
                current: this.current,
                keyword: this.searchStr,
                size: "10",
                storeId: this.stroeId
            }

            let data = await this.$post(this.$api.home.productList, parms, true);
            if (data) {

                let tempArr = data;
                tempArr.forEach((item,index) => {

                    if (item.albumPics) {
                        let pic = item.albumPics.split(",")[0];
                        item.pic = pic;
                    }

                    if (item.quantity > 0) {
                        if (item.priceList.length > 0) {

                            let firstPrice = item.priceList[0];

                            if (item.quantity <= firstPrice.minQuantity) {
                                item.price = item.standardPrice;
                                return
                            }

                            item.priceList.forEach((value,key) => {
                                if (item.quantity > value.minQuantity && item.quantity <= value.maxQuantity) {
                                    item.price = value.price;
                                }else if (item.quantity > value.minQuantity && value.maxQuantity === -1) {
                                    item.price = value.price;
                                }else {
                                    item.price = item.standardPrice;
                                }
                            });
                        }else {
                            item.price = item.standardPrice;
                        }
                    }
                })

                if (this.current === 1) {
                    this.searchList = tempArr;
                }else {
                    this.searchList = this.searchList.concat(tempArr)
                }
            }
        },

        search (e) {

            this.searchStr = e.target.value;
            if (this.searchStr.length === 0) {
                this.searchList = [];
                return
            }
            this.fetchData();
        },

        /// 清除输入框
        clearInput () {
            this.searchStr = "";
            this.searchList = [];
        },

        itemClicked(item) {
            uni.navigateTo({
                url: "/pages-home/detail/index?productId="+item.productId
            })
        },

        /// 商品减
        searchReduceClicked(item) {
            if (Number(item.quantity) === Number(item.minPurchase)) {
                item.quantity = Number(item.quantity) - Number(item.minPurchase);
            }else  {
                item.quantity = Number(item.quantity) - Number(item.minStep);

                if (item.quantity < item.minPurchase) {
                    uni.showToast({
                        title: "不能小于最小购买量" + item.minPurchase,
                        icon: "none"
                    })
                    item.quantity = item.minPurchase;
                }
            }
            this.fetchCartNum(item.quantity,item);
            this.getPriceNum(item);
        },
        /// 商品加
        searchAddClicked (item) {
            if (item.quantity === 0) {
                item.quantity = item.minPurchase;
            }else {
                item.quantity = Number(item.quantity) + Number(item.minStep);
            }
            this.fetchCartNum(item.quantity,item);
            this.getPriceNum(item);
        },

        getPriceNum (item) {

            if (item.priceList.length > 0) {
                let priceList = item.priceList;

                if (item.quantity > 0 && item.priceList.length > 0) {
                    let priceList = item.priceList;

                    let firstPrice = priceList[0];
                    if (item.quantity <= firstPrice.minQuantity) {
                        item.price = item.standardPrice;
                        return
                    }

                    priceList.forEach((value,key) => {
                        if (item.quantity > 0) {
                            if (value.maxQuantity !== -1) {
                                if (item.quantity > value.minQuantity && item.quantity <= value.maxQuantity) {
                                    item.price = value.price;
                                } else {
                                    item.price = item.standardPrice
                                }
                            }else if (value.maxQuantity === -1){
                                if (item.quantity > value.minQuantity) {
                                    item.price = value.price;
                                }
                            }
                        }
                    });
                }
            }else {
                item.price = item.standardPrice;
            }
        },

        /// 商品数量变化
        productNumChange (item,index,e) {

            console.log(e.target.value)

            let model = this.searchList[index];

            if (e.target.value >= model.minPurchase) {
                model.quantity = e.target.value
            }else {
                uni.showToast({
                    title: "输入商品数量不能小于" + model.minPurchase,
                    icon: "none"
                })
                model.quantity = model.minPurchase;
            }
            this.$set(this.searchList, index, model);

            this.fetchCartNum(model.quantity,model);
        },

        /// 购物车数量加减
        async fetchCartNum (cartNum,item) {

            let storeId = this.$storage.get("storeId")

            let parms = {
                "productId": item.productId,
                "quantity": cartNum,
                "storeId": storeId
            }

            await this.$post(this.$api.cart.cartNum, parms, false);
        },
    }
}
</script>

<style lang='scss' scoped>

.container {

    .search-view {
        background-color: #FFFFFF;
        height: 98rpx;
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom-left-radius: 40rpx;
        border-bottom-right-radius: 40rpx;
        .input-view {
            background-color: #F5F5F6;
            flex-direction: row;
            display: flex;
            margin-left: 30rpx;
            width: 690rpx;
            justify-content: flex-start;
            align-items: center;
            height: 60rpx;
            border-radius: 30rpx;
            image {
                margin-left: 20rpx;
                width: 28rpx;
                height: 28rpx;
            }

            input {
                padding: 0 20rpx;
                font-size: 28rpx;
                font-weight: 400;
                color: #222222;
            }

            .cloose-image {
                width: 24rpx;
                height: 24rpx;
                position: absolute;
                right: 60rpx;
            }
        }
    }
    .list-item-view {
        flex-direction: column;
        display: flex;
        height: 255rpx;
        .bottom-line-view {
            margin-left: 15rpx;
            width: 720rpx;
            height: 1rpx;
            background: #E2E2E2;
        }
    }

    .list-view {
        margin-top: 32rpx;
        border-top-left-radius: 40rpx;
        border-top-right-radius: 40rpx;
        width: 100%;
        background-color: #FFFFFF;

        .list-item {
            flex-direction: row;
            display: flex;
            align-items: center;
            width: 100%;
            height: 253rpx;

            .productImage {
                margin-left: 30rpx;
                width: 172rpx;
                height: 172rpx;
            }

            .item-right-view {
                width: 548rpx;
                flex-direction: column;
                display: flex;
                height: 100%;

                .name-text {
                    margin-left: 24rpx;
                    width: 488rpx;
                    font-size: 28rpx;
                    font-weight: bold;
                    color: #444444;
                    margin-top: 36rpx;
                }

                .brand-text {
                    margin-left: 24rpx;
                    width: 100rpx;
                    height: 32rpx;
                    text-align: center;
                    line-height: 32rpx;
                    background: linear-gradient(42deg, #FF3636 0%, #FF5734 100%);
                    border-radius: 4rpx;
                    font-size: 22rpx;
                    font-weight: 400;
                    color: #FFFFFF;
                    margin-top: 9rpx;
                    margin-bottom: 10rpx;

                }

                .bottom-view {
                    flex-direction: row;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 548rpx;
                    height: 45rpx;
                    margin-top: 10rpx;

                    .add-view {
                        margin-right: 30rpx;
                        flex-direction: row;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                        .num_input {
                            height: 42rpx;
                            text-align: center;
                            width: 100rpx;
                            color: #333333;
                            font-size: 28rpx;
                        }

                        image {
                            width: 42rpx;
                            height: 42rpx;
                        }
                    }

                    text {
                        margin-left: 24rpx;
                        font-size: 32rpx;
                        font-weight: bold;
                        color: #EC3A40;
                    }
                }
            }
        }
    }

    .pop-container {

        .pop-content-view {
            position: relative;
            width: 100%;
            height: 420rpx;
            background-color: #FFFFFF;
            flex-direction: column;
            display: flex;
            border-top-right-radius: 40rpx;
            border-top-left-radius: 40rpx;

            .product-info-view {
                margin-top: 41rpx;
                width: 100%;
                height: 244rpx;
                flex-direction: row;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .prodcut-image {
                    width: 150rpx;
                    height: 150rpx;
                    margin-left: 30rpx;
                }

                .price-name-view {
                    flex-direction: column;
                    display: flex;

                    .name-text {
                        margin-left: 24rpx;
                        width: 382rpx;
                        font-size: 28rpx;
                        font-weight: bold;
                        color: #444444;
                    }

                    .price-num-text {
                        margin-top: 24rpx;
                        margin-left: 24rpx;
                        font-size: 24rpx;
                        font-weight: 400;
                        color: #888888;
                    }
                }
            }

            .line-view {
                width: 100%;
                height: 1rpx;
                background-color: #E2E2E2;
                bottom: 110rpx;
                position: absolute;
            }

            .colse-image {
                width: 32rpx;
                height: 32rpx;
                position: absolute;
                right: 30rpx;
                top: 71rpx;
            }
        }

        .search-bottom-view {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 100rpx;
            flex-direction: row;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .left-view {
                width: 434rpx;
                height: 100%;
                flex-direction: row;
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .total-text {
                    margin-left: 30rpx;
                    font-size: 34rpx;
                    font-weight: 500;
                    color: #444444;
                }

                .price-text {
                    font-size: 32rpx;
                    font-weight: 500;
                    color: #C0191F;
                }
            }

            .right-view {
                width: 316rpx;
                height: 100%;
                background: linear-gradient(132deg, #C11920 0%, #EE2626 100%);
                justify-content: center;

                image {
                    width: 56rpx;
                    height: 56rpx;
                }

                input {
                    width: 124rpx;
                    height: 50rpx;
                    text-align: center;
                    font-size: 36rpx;
                    font-weight: 400;
                    color: #FFFFFF;
                }

            }
        }
    }
}
</style>
