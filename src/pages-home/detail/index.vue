<template>

    <view class='container'>

        <uni-nav-bar class='nav-bar'
                     :gradual-change="true"
                     left-icon="back"
                     title="商品详情"></uni-nav-bar>
<!--         轮播图-->
            <swiper indicator-dots="true" indicator-color="#FCF3F3" indicator-active-color="#EC3A40" class='swiper-view'>
                <swiper-item v-for="(item,index) in swiperList" :key="index">
                    <image mode='scaleToFill' :src="item"></image>
                </swiper-item>
            </swiper>

<!--        产品简介-->
        <view class='product-view'>
            <text class='product-text'>{{detailData.productName}}</text>
            <view class='price-month-sale-view'>
                <view class='price-view'>
                    <text v-if="detailData.cartQuantity > 0" class='price-text'>￥{{detailData.price === null ? detailData.standardPrice : detailData.price}}</text>
                    <text v-else class='price-text'>￥{{ detailData.minPrice === detailData.maxPrice ?  detailData.minPrice : (detailData.minPrice + '~' + detailData.maxPrice)}}</text>
                    <text class='unit-text'>/{{detailData.productUnit}}</text>
                </view>
                <view class='month-sale-view'>
                    <text>剩余{{detailData.productSku + detailData.productUnit}}</text>
                    <view class='line'></view>
                    <text>销量{{detailData.sale}}</text>
                    <view class='line'></view>
                    <text class='buy-num'>{{detailData.salePeople}}位买家</text>
                </view>
            </view>
        </view>

<!--        选规格-->
<!--        <view class='sn-row-between choose-specs-view' @click='chooseSpecsClicked'>-->
<!--            <text>规格</text>-->
<!--            <view class='sn-row specs-type-view'>-->
<!--                <text>安稳瓶装试纸50支</text>-->
<!--                <image src='/static/images/home/arrow-right.png'></image>-->
<!--            </view>-->
<!--        </view>-->

<!--        <view class='sn-row-between choose-specs-view'  @click='chooseSpecsClicked'>-->
<!--            <text>运费</text>-->
<!--            <view class='freight-text'>-->
<!--                运费10元，满300元免运费-->
<!--            </view>-->
<!--        </view>-->

        <view class='detail-line-view'></view>

        <sn-sticky :offset-top="navbarHeight" enable="true" z-index="999">
            <view class="list-contaier">
                <view class="sn-row top-view">
                    <view @click="clickTab(index)" class="tab-item sn-column-between" v-for="(item,index) in tabs" :key='index'>
                        <text class="text" :class="{'un-select':currentTab !== index}">{{item.text}}</text>
                        <view v-if="currentTab === index" class="bottom-line"></view>
                    </view>
                </view>
            </view>
        </sn-sticky>

        <view class='tab-content' v-if="currentTab === i" v-for="(tab,i) in tabs" :key="i">

            <view v-if="i === 0" class="html-content-view">
                <u-parse :content="detailData.detailHtml"></u-parse>
            </view>

<!--            <view v-if="i === 1" class="price-list-view">-->

<!--                <text v-if='priceRuleList.length === 0' class="nodata-text">暂无价格规则</text>-->
<!--                <text v-else v-for="(item,index) in priceRuleList"-->
<!--                      :style="{marginBottom: ((index === priceRuleList.length -1) ? 30 : 0) + 'rpx'}"-->
<!--                      :key="index">-->
<!--                    {{index+1 + ' : ' + item}}-->
<!--                </text>-->
<!--                -->
<!--            </view>-->

            <view v-if="i ===1 ">
               <!-- <view style="margin: 0 20px;" v-if="888">
                    建议零售价：888
                </view> -->
                <view class="price-line-view"></view>
                <view class="price-text-view">
                    <text v-for="(item,index) in priceTitleList"
                          :key="index"
                          :style="{marginLeft: (index !== 0 ? 2 : 0) + 'rpx'}"
                    >{{item}}</text>
                </view>

                <view  v-for="(value, key) in detailData.priceList">
                    <view class="price-text-view">
                        <text v-for="(item,index) in value.currentPriceList"
                              :key="index"
                              :style="{marginLeft: (index !== 0 ? 2 : 0) + 'rpx',
                                       marginBottom:  2 + 'rpx',
                                       background: '#FBFBFB',
                                       color: '#222222'}">
                            {{item}}
                        </text>
                    </view>
                </view>

                <view class="price-line-view"></view>
            </view>
        </view>

        <view>
            <view class="activity-view" v-if="detailData.activityList.length >0">
                <view class="sn-row item-view" @click="activityClicked(value)" v-for="(value,key) in detailData.activityList"
                      :style="{marginBottom: ((key === detailData.activityList.length -1) ? 30 : 8) + 'rpx'}"
                      :key="key">
                    <image src="/static/images/home/activity1.png"></image>
                    <text>{{value.name+'|'+value.description+'|'+ (value.source ===0 ?'厂商活动':'商家活动')}}</text>
                    <image class="arrow-image" src="/static/images/home/arrow-right.png"></image>
                </view>
            </view>
            <view v-else class="activity-line-view"></view>
        </view>



        <view class='flex-bottom-view' v-if="isOpenBot">

            <view class="sn-row-between left-view">

                <view class="sn-column-center left-item-view" v-for="(item,index) in leftItemList" :key="index" @click="itemClicked(index)">
                    <image v-if="item.text !== '咨询'" :src=" index === 2 ? (isCollection ? collectionStr : item.imageStr) : item.imageStr"></image>
                    <button v-else class="btn"  :open-type="'contact'" :plain="true"></button>
                    <text>{{item.text}}</text>
                </view>

            </view>

            <view class="sn-row-center right-view">
                <image src="/static/images/home/detail-reduce.png" @click="detailReduceClicked"></image>
                <input type="number" v-model="detailData.cartQuantity" @blur="productNumChange"/>
                <image src="/static/images/home/detail-add.png" @click="detailAddClicked"></image>
            </view>

        </view>

        <view class="bottom-line-view" v-if='$util.isIphonex()'></view>
    </view>

</template>

<script>
import UniNavBar from '@/components/uni-nav-bar/uni-nav-bar';
import uParse from '@/components/u-parse/u-parse'
import snSticky from "@/components/sn-sticky/sn-sticky"

export default  {

    components: {
        UniNavBar,
        snSticky,
        uParse
    },

    onLoad (parms) {
        this.isOpenBot = Number(parms.disable) === 0? false: true
        console.log(parms)
        this.fetchData(parms.productId);
    },

    onShow () {

    },

    created() {
        this.setNavSize();
    },


    data() {
        return {
            navbarHeight: 0,
            statusHeight: 0,
            navHeight: 0,
            windowWidth: 0,
            isiOS: false,
            tabs:[{text: '商品简介'}, {text: '价格规则'}],

            leftItemList: [{"imageStr": "/static/images/home/detail-cart.png", "text": "购物车"},
                {"imageStr": "/static/images/home/detail-chart.png", "text": "咨询"},
                {"imageStr": "/static/images/home/detail-collection.png", "text": "收藏"},
            ],

            collectionStr: "/static/images/home/collection-nor.png",

            currentTab: 0,
            /// 商品数量
            productNum: 0,
            /// 步进基数
            stepNum: 5,

            /// 详情数据
            detailData: {
                salePeople: "",
                minPrice: "",
                maxPrice: "",
                minPurchase: "",
                minStep: "",
                productName: "",
                productUnit: "",
                productSku: "",
                sale: "",
                cartQuantity: 0,
                productId: "",
                price: "",
                priceList: []
            },
            /// 轮播图片
            swiperList: [],
            /// 价格规则
            priceRuleList: [],
            /// 商品是否被收藏
            isCollection: false,
            isReset: true,

            priceTitleList: ["大于","小于等于","类型","折扣/价格"],

            isCanRequest: true,
            isOpenBot: true

        }
    },

    methods: {
        /// 获取详情数据
        async fetchData (productId) {

            let parms = {
                productId: productId
            }

            let data = await this.$get(this.$api.home.detail, parms, true);

            if (data) {
                this.detailData = data;

                this.swiperList = data.albumPics.split(",");

                let priceList = data.priceList;
                priceList.forEach((item,index) => {
                    // this.priceRuleList.push(item.description);

                    let tempArr = []
                    tempArr.push(item.minQuantity);

                    if (item.maxQuantity === -1) {
                        tempArr.push("无限制");
                    }else {
                        tempArr.push(item.maxQuantity);
                    }
                    if (item.priceType === 0){
                        tempArr.push("价格");
                        tempArr.push(item.price+'元')
                    }else {
                        tempArr.push("折扣");
                        tempArr.push("0." + item.discount)
                    }

                    item.currentPriceList = tempArr;
                });

                /// 判断商品是否被收藏
                this.isCollection = data.isCollect === 1;

                this.getPriceNum();
            }
        },

        setNavSize: function() { //设置头部高度
            let sysinfo = wx.getSystemInfoSync()
            this.windowWidth = sysinfo.windowWidth;
            this.statusHeight = sysinfo.statusBarHeight
            this.isiOS = sysinfo.system.indexOf('iOS') > -1
            this.navHeight =0
            !this.isiOS ? (this.navHeight = 48) : (this.navHeight = 44)
            let height = this.statusHeight + this.navHeight;
            let rpx = height/(uni.upx2px(height)/height);
            this.navbarHeight = rpx
        },
        // 选规格
        chooseSpecsClicked () {
            uni.showToast({
                title: "选规格",
                icon: "none"
            })
        },
        /// tab 切换事件
        clickTab(index) {
            this.currentTab = index;
        },

        /// 购物车 咨询 收藏点击事件
        itemClicked (index) {

            let url = "/pages/cart/index"
            switch (index) {
                case 0:
                    url = "/pages/cart/index"
                    break
                case 1:
                    url = ""
                    break
                case 2:
                    if (this.isCollection) {
                        this.deleteCollectionProduct();
                    }else {
                        this.collectionProductClicked();
                    }
                    return
                default:
                    break
            }

            uni.navigateTo({
                url: url
            })
        },

        /// 收藏 删除收藏
        async collectionProductClicked () {
            this.isCollection = !this.isCollection;

            let parms = {
                productId: this.detailData.productId
            }

            let data = await this.$post(this.$api.home.collectionProduct, parms, true);

            if (data) {
                uni.showToast({
                    title: "收藏成功",
                    icon: "none"
                })
            }
        },

        async deleteCollectionProduct () {
            this.isCollection = !this.isCollection;

            let parms = {
                productId: this.detailData.productId
            }
            let data = await this.$post(this.$api.home.removeProduct, parms, true);

            if (data) {
                uni.showToast({
                    title: "取消收藏",
                    icon: "none"
                })
            }
        },

        /// 商品减
        detailReduceClicked () {
            if (this.detailData.cartQuantity === 0) {
                return
            }
            if (!this.isCanRequest) {
                return
            }
            if (Number(this.detailData.cartQuantity) === Number(this.detailData.minPurchase)) {
                this.detailData.cartQuantity = Number(this.detailData.cartQuantity) - Number(this.detailData.minPurchase);
            }else {
                this.detailData.cartQuantity = Number(this.detailData.cartQuantity) - Number(this.detailData.minStep);

                if (this.detailData.cartQuantity < this.detailData.minPurchase && this.detailData.cartQuantity !== 0) {
                    uni.showToast({
                        title: "不能小于最小购买量" + this.detailData.minPurchase,
                        icon: "none"
                    })
                    this.detailData.cartQuantity = this.detailData.minPurchase;
                }
            }
            this.fetchCartNum(this.detailData.cartQuantity, this.detailData.productId);
            this.getPriceNum();
        },

        /// 商品数量输入框
        productNumChange (e) {

            this.detailData.cartQuantity = e.target.value;

            if (this.detailData.cartQuantity < this.detailData.minPurchase) {
                uni.showToast({
                    title: "输入产品数量不能小于" + this.detailData.minPurchase,
                    icon: 'none'
                });
                this.detailData.cartQuantity = this.detailData.minPurchase;
            }

            this.fetchCartNum(this.detailData.cartQuantity,this.detailData.productId);
            this.getPriceNum();
        },

        /// 商品加
        detailAddClicked () {

            if (!this.isCanRequest) {
                return
            }

            if (this.detailData.cartQuantity === 0) {

                if (Number(this.detailData.minStep) > Number(this.detailData.minPurchase)) {
                    this.detailData.cartQuantity = this.detailData.minStep;
                }else {
                    this.detailData.cartQuantity = this.detailData.minPurchase;
                }
            }else {
                this.detailData.cartQuantity = Number(this.detailData.cartQuantity) + Number(this.detailData.minStep);
            }

            this.fetchCartNum(this.detailData.cartQuantity, this.detailData.productId);
            this.getPriceNum();
        },

        /// 购物车数量加减
        async fetchCartNum (cartNum,productId) {

            this.isCanRequest = false
            let storeId = this.$storage.get("storeId")

            let parms = {
                "productId": productId,
                "quantity": cartNum,
                "storeId": storeId
            }

            let data = await this.$post(this.$api.cart.cartNum, parms, false);

            if (data) {
                this.isCanRequest = true
            }
        },

        activityClicked (value) {
            uni.navigateTo({
                url: "/pages-home/activityDetail/index?id="+value.id
            })
        },

        getPriceNum() {
            if (this.detailData.cartQuantity > 0) {

                if (this.detailData.priceList.length > 0) {
                    let priceList = this.detailData.priceList;

                    let firstPrice = priceList[0];
                    if (this.detailData.cartQuantity <= firstPrice.minQuantity) {
                        // this.detailData.price = this.detailData.standardPrice;

                        this.$set(this.detailData, 'price', this.detailData.standardPrice)
                        return
                    }

                    /// 筛选符合条件的价格
                    let filterPriceList =  priceList.filter((value,index) => {
                        return Number(this.detailData.cartQuantity) > Number(value.minQuantity) && (Number(this.detailData.cartQuantity) <= Number(value.maxQuantity) || Number(value.maxQuantity) === -1)
                    })

                    if (filterPriceList.length > 0) {
                        // this.detailData.price = filterPriceList[0].price;
                        this.$set(this.detailData, 'price', filterPriceList[0].price)

                    }else {
                        this.$set(this.detailData, 'price', this.detailData.standardPrice)
                    }

                }else {
                    this.$set(this.detailData, 'price', this.detailData.standardPrice)
                }
            }else {
                this.$set(this.detailData, 'price', this.detailData.standardPrice)
            }
        }
    }

}


</script>

<style lang='scss' scoped>
@import url('../../components/u-parse/u-parse.css');

.container {
    background-color: #F7F8FA;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    .swiper-view {
        width: 750rpx;
        height: 750rpx;
        image {
            width: 750rpx;
            height: 750rpx;
        }
    }
    .product-view {
        background-color: #FFFFFF;
        flex-direction: column;
        display: flex;
        width: 750rpx;
        height: 170rpx;
        justify-content: center;
        align-items: flex-start;

        .product-text {
            margin-left: 32rpx;
            font-size: 36rpx;
            font-weight: bold;
            color: #222222;
        }

        .price-month-sale-view {
            flex-direction: row;
            display: flex;
            width: 750rpx;
            justify-content: space-between;
            align-items: center;

            .price-view {
                margin-left: 32rpx;
                margin-top: 20rpx;
                flex-direction: row;
                display: flex;
                justify-content: center;
                align-items: center;
                .price-text {
                    font-size: 34rpx;
                    font-weight: bold;
                    color: #CA161D;
                }
                .unit-text {
                    font-size: 22rpx;
                    font-weight: 400;
                    color: #888888;
                }
            }

            .month-sale-view {
                margin-top: 20rpx;
                margin-right: 30rpx;
                flex-direction: row;
                display: flex;
                justify-content: center;
                align-items: center;
                .buy-num {
                    margin-right: 32rpx;
                }
                text {
                    font-size: 24rpx;
                    font-weight: 400;
                    color: #888888;
                }
                .line {
                    margin-left: 16rpx;
                    margin-right: 16rpx;
                    width: 1rpx;
                    height: 16rpx;
                    background: #DDDDDD;
                }
            }
        }
    }

    .choose-specs-view {
        width: 100%;
        height: 100rpx;
        align-items: center;
        background-color: #FFFFFF;
        margin-top: 20rpx;

        text {
            margin-left: 32rpx;
            font-size: 30rpx;
            font-weight: 400;
            color: #888888;
        }

        .freight-text {
            font-size: 30rpx;
            font-weight: 400;
            color: #222222;
            margin-right: 32rpx;
        }

        .specs-type-view {
            justify-content: center;
            align-items: center;

            text{
                font-size: 30rpx;
                font-weight: 400;
                color: #222222;
                margin-right: 16rpx;
            }

            image {
                width: 12rpx;
                height: 22rpx;
                margin-right: 32rpx;
            }
        }
    }

    .detail-line-view {
        background-color: #F7F8FA;
        width: 100%;
        height: 20rpx;
    }

    .list-contaier{
        background-color: #F5F5F7;
    }

    .top-view{
        width: 750rpx;
        height: 98rpx;
        background-color: #ffffff;
        .tab-item{
            width: 50%;
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
                border-radius: 4rpx 4rpx 0rpx 0rpx;
            }
        }
    }
    .tab-content {
        background-color: #FFFFFF;

        .price-line-view {
            width: 100%;
            height: 30rpx;
            background-color: #FFFFFF;
        }

        .price-text-view {
            background-color: #FFFFFF;
            margin-left: 32rpx;
            width: 686rpx;
            height: 64rpx;
            flex-direction: row;
            display: flex;
            align-items: center;
            justify-content: flex-start;


            text {
                background: #F5F5F5;
                width: 170rpx;
                height: 64rpx;
                line-height: 64rpx;
                text-align: center;
                color: #888888;
                font-size: 26rpx;
                font-weight: 400;
            }
        }


        .price-list-view {
            flex-direction: column;
            display: flex;
            background-color: #FFFFFF;

            text {
                padding-left: 30rpx;
                padding-right: 30rpx;
                padding-top: 30rpx;
                font-size: 30rpx;
                font-weight: 400;
                color: #222222;
            }

            .nodata-text {
                background-color: #F7F8FA;
                color: #222222;
                width: 100%;
                text-align: center;
                padding: 20rpx;
            }
        }
    }

    .activity-line-view {
        width: 100%;
        height: 110rpx;
    }

    .activity-view {
        padding-top: 60rpx;
        padding-bottom: 120rpx;
        flex-direction: column;
        display: flex;
        background-color: #FCF3F3;
        border-radius: 20rpx 20rpx 0rpx 0rpx;
        width: 750rpx;

        .item-view {
            justify-content: flex-start;
            align-items: center;
            position: relative;
            image {
                margin-left: 32rpx;
                width: 30rpx;
                height: 24rpx;
            }
            text {
                margin-left: 10rpx;
                font-size: 26rpx;
                font-weight: 400;
                color: #222222;
                width: 620rpx;
            }

            .arrow-image {
                position: absolute;
                right: 30rpx;
                width: 12rpx;
                height: 22rpx;
            }
        }
    }


    .flex-bottom-view {
        position: fixed;
        width: 750rpx;
        height: 110rpx;
        background: #FFFFFF;
        box-shadow: 0rpx -3rpx 6rpx rgba(226, 231, 242, 0.4);
        bottom: constant(safe-area-inset-bottom);
        bottom: env(safe-area-inset-bottom);
        flex-direction: row;
        display: flex;
        z-index: 99;

        .left-view {
            width: 434rpx;
            height: 100%;

            .left-item-view {
                width: 33.3%;
                height: 100%;
                justify-content: center;
                .btn{
                    border: none;
                    width: 48rpx;
                    height: 48rpx;
                    background-image: url("/static/images/home/detail-chart.png");
                    background-size: 48rpx 48rpx;
                    background-repeat:no-repeat;
                }
                image {
                    width: 48rpx;
                    height: 48rpx;
                }

                text {
                    font-size: 22rpx;
                    font-weight: 400;
                    color: #888888;
                }
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

    .bottom-line-view {
        height: 68rpx;
        background-color: #F7F8FA;
        width: 100%;
        position: fixed;
        bottom: 0;
    }
}

</style>
