<template>
    <view class="sn-column container">
        <!-- 导航-->
        <sn-custom-nav class='custom-nav' :is-show-title="isFiexd" :nav-title="storeData.name" :store="storeData"
            @messageClicked="" @searchTextClicked="goUrl('/pages-home/search/index')">
        </sn-custom-nav>
        <sn-fiexd-btn class='fiexd-btn' :shop-num="cartNum" @imageClicked="imageClicked">
        </sn-fiexd-btn>
        <view v-if='isFiexd' class="go-top-view" @click='gotop'>
            <image src='/static/images/home/go-top.png'></image>
        </view>

        <!-- 代理商信息 -->
        <view class="header" :style="[{marginTop: statusHeight+ navHeight + 'px'}]">
            <view class="header-info">
                <view class="top-info">
                    <text class="company-title" @click="goUrl('/pages/auth-page/register')">{{storeData.name}}</text>
                    <!--  特点-->
                    <view class="advantages">
                        <view class="advantages-list" v-for='(item,index) in advantageList' :key='index'>
                            <image :style="[{marginLeft: item.marginLeft + 'px'}]" :src="item.imageStr"></image>
                            <text>{{item.title}}</text>
                        </view>
                    </view>
                    <!-- 代理商logo -->
                    <view class="company-logo" @click="goUrl('/pages/auth-page/register')">
                        <image :src="storeData.logo?storeData.logo:'/static/images/ic_logo2.png'"></image>
                        <text>已认证</text>
                    </view>
                    <!-- 地址 -->
                    <view class="company-address">
                        <image src="/static/images/home/address.png"></image>
                        <text>{{storeData.address}}</text>
                    </view>
                    <!-- 政策-->
                    <view class="policy-view">
                        <view class='policy'>
                            <text v-for="(item,index) in policyList" :key='index'
                                :style="[{marginLeft: 5 +'px'}]">{{item}}</text>
                        </view>
                    </view>

                    <!-- 公告-->
                    <view class='public-notice' @click="showOrCloseNotice">
                        <text>公告：{{storeData.notice}}</text>
                    </view>
                </view>
            </view>
        </view>

        <view class="top-line-view"></view>

        <view class="product-container" :style="[{height: windowHeight - statusHeight-navHeight -7 + 'px'}]">
            <!--   左边分类-->
            <scroll-view :scroll-top="leftScrollTop" @scroll="leftScroll" :scroll-y="scrollTop>headerHeight"
                class='product-classify'>
                <view class='classify-name' v-for='(item,index) in classifyList' :key='index' :style="[{height: windowHeight*0.112 + 'px',
                              backgroundColor: index === selectIndex ? '#ffffff': '#F7F8F9'}]"
                    @click='classifyClicked(item,index)'>
                    <image :src="item.icon"></image>
                    <text :style="[{color: index === selectIndex ? '#222222': '#888888'}]">{{item.name}}</text>
                </view>
            </scroll-view>
            <!-- 商品展示-->
            <scroll-view :scroll-top="rightScrollTop > 0 ? -1 : 0" @scroll="rightScroll" class="product-list"
                @scrolltolower="onreachBottom" :scroll-y="scrollTop>headerHeight">

                <!-- 商品筛选-->
                <sn-goods-filter :allBrand="allBrand" :specsList="specsList" @selectBrandOk="selectBrandOk"
                    @sureSpecifi="sureSpecifi" @updateSpecs="updateSpecs" />


                <sn-nodata v-if="productList.length === 0"></sn-nodata>

                <product-item v-else v-for="(item,index) in productList" :item-obj="item" :key="index"
                    :is-reset="isReset" @productItemClicked="productItemClicked(item.productId)"
                    @chooseSpecsClicked="chooseSpecsClicked" @addClicked="addClicked(item)"
                    @reduceClicked="reduceClicked(item)" @cartNumChange="cartNumChange(item,index,$event)"
                    @activityClicked="activityClicked($event)">

                </product-item>
            </scroll-view>

        </view>

        <view class="container-background-view"></view>


        <sn-popup class='popup-view' ref="popup" :mask-click='false' type='center'>
            <view class='pop-container'>
                <view class='content-view'>
                    <text class='product-title'>安稳+瓶装试条套装</text>
                    <text class='sub-text'>规格</text>

                    <view class='specs-view'>
                        <view class='specs-title' v-for='(item,index) in ["50支/盒","100支/盒","25支/盒"]' :style="[{borderColor: selectSpecsIndex === index ? '#C0191F' : '#CCCCCC',
                          backgroundColor: selectSpecsIndex === index ? '#FAF3F3' : '#FFFFFF',
                          color: selectSpecsIndex === index ? '#C0191F' : '#888888',
                          }]" :key='index' @click="specsClicked(item,index)">{{item}}
                        </view>
                    </view>

                    <text class='sub-text'>价格</text>

                    <view class='price-view'>
                        <view class='sub-content-text' v-for='(item,index) in priceList' :key='index'>{{item}}
                        </view>
                    </view>

                    <text class='sub-text'>运费</text>

                    <text class='sub-content-text'>运费10元，满300元免运费</text>
                    <text class='sub-text'>税率</text>
                    <text class='sub-content-text'>本店默认6个点，如有特殊需求 请联系店主</text>
                    <view class='line-view'></view>

                    <view class='price-add-view'>
                        <view class='specs-price-view'>
                            <text class='specs-price-text'>￥249~268</text>
                            <text class='specs-unit-text'>/套</text>
                        </view>
                        <view class='add-shop-view'>
                            加入购物车
                        </view>
                    </view>
                </view>
                <image class='close-image' src='/static/images/home/close.png' @click='closeImageClicked'></image>
            </view>

        </sn-popup>

        <!-- 公告弹窗  -->
        <sn-modal :show="modalIsShow" custom="true" radius="10px" :maskClosable="true" @cancel="showOrCloseNotice">
            <slot>
                <view style="min-height: 128px;">

                    <view style="position: relative;text-align: center;padding-bottom: 20px;">
                        <text style="font-size: 34rpx;color: #333;font-weight: bold;">
                            店铺公告
                        </text>
                        <uni-icons @click="showOrCloseNotice" color="#CA161D" style="position: absolute;
              top: -12px;
              right: -25px;" type="clear" class="backicon" size="24" />
                    </view>
                    <view style="color: #888888;">
                        {{storeData.notice}}
                        <view>
                        </view>
                    </view>

                </view>
            </slot>
        </sn-modal>



    </view>
</template>

<script>
    import snCustomNav from "@/components/sn-custom-nav/sn-custom-nav";
    import snFiexdBtn from "@/components/sn-fixed-btn/sn-fiexd-btn";
    import snGoodsFilter from "@/components/sn-goods-filter/sn-goods-filter.vue";
    import productItem from "./product-item/product-item";
    import snPopup from "@/components/sn-popup/uni-popup";
    import snModal from "@/components/sn-modal/sn-modal.vue";

    export default {
        computed: {

            isFiexd: function() {
                return this.scrollTop > this.headerHeight
            }

        },

        components: {
            productItem,
            snCustomNav,
            snFiexdBtn,
            snPopup,
            snModal,
            snGoodsFilter
        },


        data() {
            return {
                // 查询产品list的model
                fetchProductModel: {
                    productModels: []
                },
                // 全部型号
                specsList: [{
                    productModel: '不限',
                    id: '',
                    isSelected: true
                }],
                // 全部品牌
                allBrand: [],
                // 公告弹窗是否显示
                modalIsShow: false,
                // 公告弹窗按钮
                modalButton: [{
                    text: '关闭',
                    type: 'red',
                    plain: true // 是否空心
                }],
                statusHeight: 0,
                navHeight: 0,
                isiOS: false,
                windowWidth: 0,
                windowHeight: 0,
                // header 高度
                headerHeight: 0,
                // 距离顶部高度
                scrollTop: 0,

                // 代理商优势
                advantageList: [{
                        "imageStr": "/static/images/home/advantages1.png",
                        "title": "品牌代理",
                        "marginLeft": 0
                    },
                    {
                        "imageStr": "/static/images/home/advantages2.png",
                        "title": "经营资质",
                        "marginLeft": 15
                    }
                ],
                // 优惠政策
                policyList: [],
                /// 分类list
                classifyList: [],
                // 记录点击那个分类
                selectIndex: 0,
                /// 每个分类的商品list
                productList: [],
                // 规格选中的索引
                selectSpecsIndex: 0,
                // 价格政策
                priceList: ["0~9件，不打折",
                    "10~19件，0.95折",
                    "20~49件，0.90折",
                    "50~以上，0.85折"
                ],
                // 店铺详情
                storeData: {
                    notice: ""
                },
                /// 控制刷新子组件
                isReset: true,
                oldLeftScrollTop: 0,
                oldRightScrollTop: 0,
                leftScrollTop: 0,
                rightScrollTop: 0,
                /// 购物车数量
                cartNum: 0,
                /// 当前页数
                current: 1,
                /// 是否在操作购物车
                isCanRequest: true
            }
        },

        onLoad() {
            this.fetchStoreDetail();

        },

        onShow() {
            this.current = 1;
            if (this.classifyList.length > 0) {
                // this.productList = [];
                this.fetchProductList(this.classifyList[this.selectIndex])
            }
            this.getCartNum()

        },

        created() {
            this.setNavSize()
            const that = this;
            uni.getSystemInfo({
                success: function(res) {
                    that.windowWidth = res.windowWidth;
                    that.windowHeight = res.windowHeight;
                }
            });
            //获取节点信息
            let view = uni.createSelectorQuery().select('.header');
            // console.log(view)
            //获取对应的节点值位置高度信息
            view.boundingClientRect(data => {
                // console.log("得到布局位置信息" + JSON.stringify(data));
                // console.log("节点离页面顶部的距离为" + data.top);
                // 计算高度值并赋值
                that.headerHeight = data.height - 15;

                console.log(that.headerHeight)
            }).exec();

        },
        onPageScroll(res) {
            this.scrollTop = res.scrollTop;
        },


        methods: {
            // 选择品牌成功
            selectBrandOk(data) {
                console.log('selectBrandOk data', data)
                this.fetchProductModel.factoryId = data;
                this.fetchProductList(this.fetchProductModel);
                // 选择品牌查询对应型号
                this.getSpecsList();


            },
            // 选择品牌查询对应型号
            async getSpecsList() {

                let that = this;
                if (!this.fetchProductModel.factoryId) {
                    return false;
                }

                let parms = {
                    // "current": this.current,
                    // "size": 10,
                    "storeId": this.storeData.storeId
                }

                parms.factoryId = this.fetchProductModel.factoryId;
                if (this.fetchProductModel.productModels.length > 0) {
                    parms.productModels = this.fetchProductModel.productModels;
                }

                if (this.fetchProductModel.type === 0) {
                    parms.productCategoryId = this.fetchProductModel.id;
                } else if (this.fetchProductModel.type === 1) {
                    parms.isHot = 1;
                } else if (this.fetchProductModel.type === 2) {
                    parms.isActivity = 1
                }


                let data = await this.$post(this.$api.home.selectSpecByBrand, parms, false);
                if (data) {
                    let resData = data;
                    this.specsList = resData.map(v => {
                        return {
                            ...v,
                            isSelected: false
                        };
                    });

                } else {
                    this.specsList = [];

                }
                // that.specsListLength = that.specsList.length;

                that.specsList.unshift({
                    productModel: '不限',
                    id: '',
                    isSelected: true
                });
                if (this.specsList.length >= 2) {
                    this.specsList[0].isSelected = true;
                }



            },
            updateSpecs(index) {
                this.specsList[index].isSelected = !this.specsList[index].isSelected;
                for (let i = 0; i < this.specsList.length; i++) {
                    if (index == i) {
                        this.specsList[i].isSelected = true
                    } else {
                        this.specsList[i].isSelected = false
                    }
                }

            },
            // 选择规格成功
            sureSpecifi(data) {
                // console.log('selectsureSpecifiOk data', data)
                this.fetchProductModel.productModels = data;
                this.fetchProductList(this.fetchProductModel);

            },
            // 显示或者关闭通知弹窗
            showOrCloseNotice() {
                let that = this;
                that.modalIsShow = !that.modalIsShow;
            },
            setNavSize: function() { //设置头部高度
                let sysinfo = wx.getSystemInfoSync();
                this.statusHeight = sysinfo.statusBarHeight;
                this.isiOS = sysinfo.system.indexOf('iOS') > -1;
                this.navHeight = 0;
                !this.isiOS ? (this.navHeight = 48) : (this.navHeight = 44);
            },
            imageClicked(index) {
                let url = ""
                if (index === 0) {
                    url = "/pages/person/index"
                } else if (index === 1) {
                    url = "/pages-person/collect/index"
                } else {
                    url = "/pages/cart/index"
                }
                this.goUrl(url)
            },
            goUrl(url) {
                uni.navigateTo({
                    url
                })
            },
            // 左边分类点击事件
            classifyClicked(item, index) {
                this.selectIndex = index;
                this.current = 1;
                this.fetchProductList(item);
                // 选择品牌查询对应型号
                this.getSpecsList();
            },

            // 根据门店查询品牌
            async getBrandByStore(storeId) {
                let parms = {
                    storeId
                }
                let data = await this.$get(this.$api.home.allBrand, parms, false);
                console.log('data', data);
                if (data) {
                    this.allBrand = data;
                    this.allBrand.unshift({
                        name: '全部品牌',
                        factoryId: ''
                    })
                }
            },

            leftScroll(e) {
                this.oldLeftScrollTop = e.detail.scrollTop;
            },

            rightScroll(e) {
                this.oldRightScrollTop = e.detail.scrollTop;
            },

            /// 回到顶部
            gotop() {

                //视图会发生重新渲染
                this.leftScrollTop = this.oldLeftScrollTop;
                this.rightScrollTop = this.oldRightScrollTop;
                //当视图渲染结束 重新设置为0

                this.$nextTick(() => {
                    this.leftScrollTop = 0;
                    this.rightScrollTop = 0;
                });

                uni.pageScrollTo({
                    duration: 500, // 毫秒
                    scrollTop: 0 // 位置
                });
            },
            /**
             * PopUp 弹出层点击事件
             */
            /// 选规格
            chooseSpecsClicked() {
                this.$refs.popup.open();
            },
            /// 规格点击事件
            specsClicked(item, index) {
                console.log(index)
                this.selectSpecsIndex = index
            },
            /// 关闭图片点击事件
            closeImageClicked() {
                this.$refs.popup.close();
            },
            /// 商品详情接口
            productItemClicked(productId) {
                uni.navigateTo({
                    url: "/pages-home/detail/index?productId=" + productId
                })
            },
            /// 获取店铺详情接口
            async fetchStoreDetail() {
                let data = await this.$get(this.$api.home.storeDetail, {
                    "mchId": this.$storage.get('mchId')
                }, true);
                if (data) {
                    this.storeData = data;
                    this.$storage.set('storeId', data.storeId)
                    this.policyList = data.labels.split(",")
                    await this.fetchCategoryList();
                    await this.getBrandByStore(data.storeId);
                }
            },
            /// 获取分类数据接口
            async fetchCategoryList() {

                let data = await this.$get(this.$api.home.categoryList, {
                    "storeId": this.storeData.storeId
                }, false);

                if (data) {
                    this.classifyList = data;
                    await this.fetchProductList(data[0])
                }
            },

            // 获取分类下商品
            async fetchProductList(model) {
                this.fetchProductModel = Object.assign(this.fetchProductModel, model);

                let parms = {
                    "current": this.current,
                    "size": 10,
                    "storeId": this.storeData.storeId
                }

                if (this.fetchProductModel.factoryId) {
                    parms.factoryId = this.fetchProductModel.factoryId;
                }
                if (this.fetchProductModel.productModels.length > 0) {
                    parms.productModels = this.fetchProductModel.productModels.map(item=>{
                       return  item.productModel
                    });
                }

                if (model.type === 0) {
                    parms.productCategoryId = model.id;
                } else if (model.type === 1) {
                    parms.isHot = 1;
                } else if (model.type === 2) {
                    parms.isActivity = 1
                }

                let data = await this.$post(this.$api.home.productList, parms, false);

                if (data) {

                    let tempArr = data;

                    tempArr.forEach((item, index) => {

                        if (item.albumPics) {
                            let pic = item.albumPics.split(",")[0];
                            item.pic = pic;
                        }

                        if (item.quantity > 0) {

                            if (item.priceList.length > 0) {

                                let priceList = item.priceList;

                                let firstPrice = priceList[0];
                                if (item.quantity <= firstPrice.minQuantity) {
                                    item.price = item.standardPrice;
                                    return
                                }

                                /// 筛选符合条件的价格
                                let filterPriceList = priceList.filter((value, index) => {
                                    return Number(item.quantity) > Number(value.minQuantity) && (
                                        Number(item.quantity) <= Number(value.maxQuantity) ||
                                        Number(value.maxQuantity) === -1)
                                })

                                if (filterPriceList.length > 0) {
                                    item.price = filterPriceList[0].price;
                                } else {
                                    item.price = item.standardPrice;
                                }

                            } else {
                                item.price = item.standardPrice;
                            }
                        } else {
                            item.price = item.standardPrice;
                        }
                    });
                    if (this.current === 1) {
                        this.productList = tempArr;
                    } else {
                        if (tempArr.length === 0) {
                            uni.showToast({
                                title: "没有更多数据了",
                                icon: 'none'
                            })
                        } else {
                            this.productList = this.productList.concat(tempArr);
                        }
                    }
                    this.computActivities();
                }
            },

            /// 计算活动
            computActivities() {
                this.productList.forEach((item, index) => {

                    if (item.activityList.length > 0) {
                        item.showActivityList = item.activityList.filter((value, key) => {
                            return parseFloat(item.price) >= parseFloat(value.minPrice) && Number(item
                                .quantity) >= Number(value.minQuantity)
                        })
                    }
                });
            },

            /// 购物车数量加
            addClicked(item) {

                if (!this.isCanRequest) {
                    return
                }

                if (item.quantity === 0) {
                    if (Number(item.minStep) > Number(item.minPurchase)) {
                        item.quantity = item.minStep;
                    } else {
                        item.quantity = item.minPurchase;
                    }
                } else {
                    item.quantity = Number(item.quantity) + Number(item.minStep);
                }
                this.fetchCartNum(item.quantity, item);
                this.getPriceNum(item);
                this.computActivities();
            },
            /// 购物车数量减
            reduceClicked(item) {

                if (!this.isCanRequest) {
                    return
                }

                if (Number(item.quantity) === Number(item.minPurchase)) {
                    item.quantity = Number(item.quantity) - Number(item.minPurchase);
                } else {
                    item.quantity = Number(item.quantity) - Number(item.minStep);

                    if (item.quantity < item.minPurchase && item.quantity !== 0) {
                        uni.showToast({
                            title: "不能小于最小购买量" + item.minPurchase,
                            icon: "none"
                        })
                        item.quantity = item.minPurchase;
                        this.isReset = false;
                        this.$nextTick(() => {
                            this.isReset = true;
                        })
                    }
                }
                this.fetchCartNum(item.quantity, item);
                this.getPriceNum(item);
                this.computActivities();
            },

            cartNumChange(item, index, e) {

                this.productList[index].quantity = e.target.value;

                if (e.target.value < item.minPurchase) {
                    uni.showToast({
                        title: "输入产品数量不能小于" + item.minPurchase,
                        icon: 'none'
                    });

                    item.quantity = item.minPurchase;
                    this.isReset = false;
                    this.$nextTick(() => {
                        this.isReset = true;
                    })
                }

                this.fetchCartNum(item.quantity, item);
                this.getPriceNum(item);
                this.computActivities();
            },

            activityClicked(id) {

                uni.navigateTo({
                    url: "/pages-home/activityDetail/index?id=" + id
                })

            },

            getPriceNum(item) {

                if (item.priceList.length > 0) {

                    if (item.quantity > 0 && item.priceList.length > 0) {
                        let priceList = item.priceList;

                        let firstPrice = priceList[0];
                        if (item.quantity <= firstPrice.minQuantity) {
                            item.price = item.standardPrice;
                            return
                        }

                        /// 筛选符合条件的价格
                        let filterPriceList = priceList.filter((value, index) => {
                            return Number(item.quantity) > Number(value.minQuantity) && (Number(item
                                    .quantity) <= Number(value.maxQuantity) || Number(value.maxQuantity) ===
                                -1)
                        })

                        if (filterPriceList.length > 0) {
                            item.price = filterPriceList[0].price;
                        } else {
                            item.price = item.standardPrice;
                        }
                    }
                } else {
                    item.price = item.standardPrice;
                }
            },

            /// 购物车数量加减
            async fetchCartNum(cartNum, item) {
                this.isCanRequest = false;
                let parms = {
                    "productId": item.productId,
                    "quantity": cartNum,
                    "storeId": this.storeData.storeId
                }

                let data = await this.$post(this.$api.cart.cartNum, parms, false);

                if (data) {
                    this.isCanRequest = true;
                    if (cartNum === item.minPurchase || cartNum === item.minStep || cartNum === 0) {
                        await this.getCartNum();
                    }
                }
            },

            async getCartNum() {

                let data = await this.$get(this.$api.cart.offenBuyNum, {}, false);

                if (data) {
                    this.cartNum = data.cartCount;
                }
            },



            onreachBottom() {
                this.current++;
                let id = this.classifyList[this.selectIndex].id;
                this.fetchProductList(id);

            },

        }
    }
</script>

<style lang="scss" scoped>
    .container {

        .container-background-view {

            background: linear-gradient(to right, #EF3E3D, #C4282F);
            position: fixed;
            top: 0;
            right: 0;
            left: 0;
            height: 100%;
            z-index: -40;
        }
    }

    .custom-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 50;
    }

    .fiexd-btn {
        position: fixed;
        bottom: 28rpx;
        left: 32rpx;
        z-index: 99;
    }

    .go-top-view {
        position: fixed;
        bottom: 28rpx;
        right: 32rpx;
        width: 90rpx;
        height: 90rpx;
        background: #222222;
        border-radius: 50%;
        opacity: 0.8;
        justify-content: center;
        align-items: center;
        display: flex;
        z-index: 99;

        image {
            width: 32rpx;
            height: 32rpx;
        }
    }

    .scroll-class {
        background-color: #2fc25b;
        width: 100%;
    }


    .header {
        //height: 380rpx;
        background: linear-gradient(to right, #EF3E3D, #C4282F);


        .header-info {
            //min-height: 380rpx;
            display: flex;
            border-top-left-radius: 50rpx;
            border-top-right-radius: 50rpx;
            background-color: #fff;
            position: relative;

            .company-logo {
                position: absolute;
                right: 32rpx;
                top: 40rpx;
                width: 136rpx;
                height: 147rpx;

                image {
                    width: 136rpx;
                    height: 136rpx;
                    border-radius: 50%;
                }

                text {
                    background: linear-gradient(343deg, #C4282F 0%, #EF3E3D 100%);
                    text-align: center;
                    color: #fff;
                    width: 94rpx;
                    height: 38rpx;
                    line-height: 38rpx;
                    border-radius: 19rpx;
                    font-size: 22rpx;
                    display: inline-block;
                    position: absolute;
                    bottom: 0rpx;
                    left: 21rpx;
                }
            }

            .top-info {
                margin-top: 53rpx;

                .company-title {
                    margin-left: 32rpx;
                    color: #333333;
                    font-size: 45rpx;
                    font-weight: bold;
                }

                .advantages {
                    margin-left: 32rpx;
                    margin-top: 17rpx;
                    flex-direction: row;
                    display: flex;

                    .advantages-list {
                        flex-direction: row;
                        display: flex;
                        align-items: center;

                        image {
                            width: 32rpx;
                            height: 32rpx;
                        }

                        text {
                            font-size: 28rpx;
                            font-weight: 400;
                            color: #222222;
                            opacity: 1;
                            margin-left: 4rpx;
                        }
                    }
                }

                .company-address {
                    flex-direction: row;
                    display: inline-block;
                    background-color: #F5F5F6;
                    border-radius: 8rpx;
                    //justify-content: flex-start;
                    //align-items: center;
                    margin-left: 32rpx;
                    margin-right: 32rpx;
                    margin-top: 20rpx;
                    height: 40rpx;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    //display: -webkit-box !important;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    align-items: center;

                    image {
                        width: 24rpx;
                        height: 24rpx;
                        margin-left: 10rpx;
                        margin-top: 8rpx;
                    }

                    text {
                        color: #333333;
                        font-size: 24rpx;
                        padding: 5rpx 10rpx;
                    }
                }

                .policy-view {
                    margin-left: 27rpx;
                    width: 686rpx;
                    margin-top: 10rpx;
                }

                .policy {
                    //margin-left: 32rpx;
                    flex-direction: row;
                    display: flex;
                    flex-wrap: wrap;

                    text {
                        height: 28rpx;
                        border-radius: 12rpx;
                        border: 1rpx solid #FFC6C1;
                        color: #FF4A26;
                        font-size: 20rpx;
                        font-weight: bold;
                        padding: 5rpx 10rpx;
                        margin-top: 10rpx;
                    }
                }

                .public-notice {
                    margin-left: 32rpx;
                    margin-right: 32rpx;
                    margin-top: 14rpx;
                    margin-bottom: 14rpx;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    display: -webkit-box !important;
                    -webkit-line-clamp: 1; //文字上限行
                    -webkit-box-orient: vertical;

                    text {
                        height: 33rpx;
                        color: #888888;
                        font-size: 24rpx;
                    }
                }
            }
        }
    }

    .is_fixed {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
    }

    .top-line-view {
        width: 100%;
        height: 15rpx;
        background-color: #F5F5F6;
    }

    .product-container {
        display: flex;
        flex-direction: row;

        .product-classify {
            padding-bottom: 130rpx;
            height: 100%;
            background-color: #F7F8F9;
            width: 21.3%;
            flex-direction: column;
            display: flex;


            .classify-name {
                background-color: #F7F8F9;
                width: 100%;
                height: 100%;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                display: flex;

                image {
                    //margin-top: 26rpx;
                    width: 40rpx;
                    height: 50rpx;
                }

                text {
                    margin-top: 10rpx;
                    color: #222222;
                    font-size: 24rpx;
                }
            }
        }

        .product-list {
            padding-bottom: 130rpx;
            background-color: #FFFFFF;
            width: 78.7%;
            flex-direction: column;
            display: flex;
        }
    }

    .pop-container {
        flex-direction: column;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .close-image {
        margin-top: 40rpx;
        width: 72rpx;
        height: 72rpx;
    }

    .content-view {
        background-color: #FFFFFF;
        width: 91.4%;
        height: 73%;
        margin-top: 124rpx;
        border-radius: 20rpx;
        flex-direction: column;
        display: flex;

        .product-title {
            font-size: 34rpx;
            font-weight: 800;
            color: #222222;
            margin-left: 32rpx;
            margin-top: 32rpx;
        }

        .sub-text {
            font-size: 26rpx;
            font-weight: 400;
            color: #888888;
            margin-bottom: 12rpx;
            margin-left: 32rpx;
            margin-top: 40rpx;
        }

        .specs-view {
            flex-direction: row;
            display: flex;
            flex-wrap: wrap;

            .specs-title {
                margin-left: 32rpx;
                border: 1px solid #CCCCCC;
                width: 188rpx;
                height: 64rpx;
                background-color: #FFFFFF;
                border-radius: 10rpx;
                line-height: 64rpx;
                text-align: center;
                font-size: 26rpx;
                font-weight: 400;
                color: #888888;
            }
        }

        .price-view {
            flex-direction: column;
            display: flex;
        }

        .sub-content-text {
            margin-left: 32rpx;
            font-size: 30rpx;
            font-weight: 400;
            line-height: 42rpx;
            color: #222222;
        }

        .line-view {
            margin-top: 40rpx;
            margin-left: 32rpx;
            width: 91.4%;
            height: 1rpx;
            background-color: #E2E2E2;
        }

        .price-add-view {
            flex-direction: row;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 45rpx;
            margin-bottom: 44rpx;
            margin-left: 32rpx;

            .specs-price-view {
                flex-direction: row;
                display: flex;
                justify-content: center;
                align-items: center;

                .specs-price-text {
                    font-size: 42rpx;
                    font-weight: bold;
                    color: #CA161D;
                }

                .specs-unit-text {
                    font-size: 22rpx;
                    font-weight: 400;
                    line-height: 30rpx;
                    color: #888888;
                }
            }

            .add-shop-view {
                margin-right: 32rpx;
                width: 234rpx;
                height: 68rpx;
                background: linear-gradient(141deg, #C11920 0%, #EC3A40 100%);
                border-radius: 34rpx;
                font-size: 30rpx;
                font-weight: bold;
                color: #FFFFFF;
                text-align: center;
                line-height: 68rpx;
            }


        }


    }
</style>
