<template>
    <view class="container">

        <sn-sticky :offset-top="0" enable="true" z-index="999">
            <view class="list-contaier">
                <view class="sn-row top-view">
                    <view @click="clickTab(index)" class="tab-item sn-column-between" v-for="(item,index) in tabs" :key='index'>
                        <text class="text" :class="{'un-select':currentTab !== index}">{{item.text+(item.num!==0?'('+ item.num +')':'')}}</text>
                        <view v-if="currentTab === index" class="bottom-line"></view>
                    </view>

                    <view v-if="currentTab === 0" class="edit-view" @click="editClicked">
                        {{isEdit ? '完成' : '编辑'}}
                    </view>

                </view>
            </view>
        </sn-sticky>


        <view>
            <view class='tab-content' v-if="currentTab === i" v-for="(tab,i) in tabs" :key="i">
                <view v-if="currentTab===0">

                    <sn-nodata v-if="tabs[0].list.length === 0" noData="/static/images/cart/car-nodata.png" title="您的购物车空空如也"></sn-nodata>

                    <view class="sn-column" v-else v-for="(item,index) in tab.list" :key="index">
                        <view class='cart-item-view'>
                            <view class='top-info-view'>
                                <view class='select-image' @click.stop='chooseProductClicked(item,index)'>
                                    <image :src='item.isSelect ? selectStr : unSelectStr'></image>
                                </view>
                                <image class='product-image' :src='item.pic' @click="itemClicked(item)"></image>

                                <view class='right-view'>
                                    <text class='product-name-text'>{{item.productName}}</text>
                                    <view class='price-add-view'>
                                        <view style="display: flex;justify-content: center;align-items: center;">
                                            <text>￥{{item.price === null ? item.standardPrice : item.price}}</text>
                                            <image v-if="priceList && priceList.length > 0" @click="surveyPrice(item.productId)" style="width: 40rpx;height: 40rpx;margin-left: 10rpx;" src="../../static/images/cart/survey.png" mode="aspectFit"></image>
                                        </view>
                                        <view class='add-view' @click.stop=''>
                                            <view class="image-view" @click="reduceClicked(item,index)" style="padding-left: 30rpx">
                                                <image :src='item.isCanReduce ? normalReduceStr : unReduceStr' @click='reduceClicked(item,index)'></image>
                                            </view>
                                            <input v-model='item.quantity' @blur='productNumChange(index,$event)'/>
                                            <view class="image-view" @click='addClicked(item,index)'>
                                                <image src='/static/images/cart/add-product.png' @click='addClicked(item,index)'></image>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </view>

<!--                            <view class='product-policy-view' @click="itemClicked(item)">-->
<!--                                <view class='policy-item-view' v-for="(value,key) in item.showActivity" :key="key">-->
<!--                                    {{value.name}}-->
<!--                                </view>-->
<!--                            </view>-->

                            <!-- <view class='activity-view' v-for="(value, key) in item.showActivity"
                                  @click.stop="activityClicked(value.id)"
                                  :key="key">
                                <image class='acticity-image' src='/static/images/home/activity1.png'></image>
                                <text>{{value.name+'|'+value.description+'|'+ (value.source ===0 ?'厂商活动':'商家活动')}}</text>
                                <image class='arrow-image' src='/static/images/home/arrow-right.png'></image>
                            </view> -->
                            <view v-if="item.activityList" v-for="(activity,aindex) in item.activityList">
                                 <view class='activity-view'>
                                     <view style="padding:10px 0 0 10px;">
                                       <text style="color: #666666;font-weight: bold;">{{activity.source ===0 ?'厂商活动：':'商家活动：'}}</text>
                                       <text style="color: #666666;">{{activity.name}}{{activity.giftSendType==1 && activity.activityGifts.length>0?'  多选一':''}}</text>
                                     </view>
                                     <view style="display: flex;align-items: center;padding:4rpx 0 0 10px;" v-for="(gift,gindex) in activity.activityGifts">
                                         <view :style="{marginLeft:(activity.minQuantity > 0 && activity.minPrice > 0 ? '-20rpx' : '30rpx')}" class='select-image' @click.stop='chooseGiftSendType(index,aindex,gindex)'>
                                             <image :src='gift.isSelect ? selectStr : unSelectStr'></image>
                                         </view>
                                         <view class="gift-require">
                                            <text @click.stop='chooseGiftSendType(index,aindex,gindex)'>赠品: {{gift.productName}}</text>
                                            <text>{{ gift.giftType == 1 ? '买'+ gift.doubleBase+ '赠' + gift.giftNum : '赠送数量' + gift.giftNum}}</text>
                                            <text v-if="activity.minQuantity > 0">{{'购买数量大于等于' + activity.minQuantity}}</text>
                                            <text v-if="activity.minPrice > 0">{{'单价大于等于' + activity.minPrice}}</text>
                                         </view>
                                     </view>
                                 </view>
                            </view>

                            <view class='line-view'></view>
                        </view>
                    </view>
                </view>

                <view v-if="currentTab===1">
                    <sn-nodata v-if="tabs[1].list.length === 0" title="暂无数据"></sn-nodata>

                    <product-item v-else v-for="(value,key) in tab.list"
                                  :item-obj="value"
                                  :key="key"
                                  :is-reset="isReset"
                                  @productItemClicked="itemClicked(value)"
                                  @addClicked="addClicked(value,key)"
                                  @reduceClicked="reduceClicked(value,key)"
                                  @cartNumChange="productNumChange(key,$event)"
                                  @activityClicked="activityClicked($event)">
                    </product-item>

                </view>

            </view>

        </view>

        <view class='cart-fiexd-view' v-if="currentTab === 0">

            <view class='select-all-view' @click='selectAllClicked'>
                <image :src='isAllSelect ? selectStr : unSelectStr'></image>
                <text>全选</text>
            </view>

            <view v-if="isEdit">
                <view class="settlement-text" @click="deleteProductClicked">
                    删除
                </view>
            </view>

            <view v-else class='settlement-view'>
                <view class='price-view'>
                    <view class='total-price-view'>
                        <text>合计：</text>
                        <text class='total-price-text'>￥{{totalPrice}}</text>
                    </view>
                </view>
                <view class='settlement-text' @click='settlementClicked'>
                    结算{{'('+(totalPiece === null ? 0 : totalPiece) +')'}}
                </view>
            </view>
        </view>

        <view class="bottom-line-view" v-if='$util.isIphonex()'></view>

        <!-- 阶梯价遮罩 -->
        <view class="mask" v-if="surveyMask">
            <view class="surveyMask">
                <image class="mask-close" @click="surveyPrice"  src="../../static/images/home/close.png" mode="aspectFit"></image>
                <view class="surveyMask-color">阶梯价策略</view>
                <view class="surveyMask-content">
                    <text v-for="item in newPriceList">{{item.description}}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import {mapState} from 'vuex'
import UniNavBar from '@/components/uni-nav-bar/uni-nav-bar'
import ProductItem from "../home/product-item/product-item"
export default {
    components: {
        UniNavBar,
        ProductItem,
    },
    data() {
        return {
            tabs:[
                {
                    text: '全部',
                    num: 0,
                    list: []
                },
                {
                    text: '常买',
                    num: 0,
                    list: []
                },
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
            /// 购物车数据
            dataList: [],
            offenBuyList: [],
            // 是否全部选中
            isAllSelect: false,
            // 编辑是否点击
            isEdit: false,
            isReset: true,
            /// 购物车选中商品id
            selectCartList: [],

            isCanRequest: true,
            selectActive: [],
            surveyMask: false, //阶梯价遮罩开关
            priceList: [],//所有阶梯价列表
            newPriceList: [],//当前阶梯价列表
        }
    },

    onLoad () {
    },

    onShow () {
        this.getCartList(0);
        this.getCartNum();
        this.selectActive = []
    },


    computed: {
        ...mapState({
            userInfo: state => state.common.userInfo,
            loginUser: state => state.common.loginUser,
            token: state => state.common.token
        }),

        totalPrice:function() {

            let priceNum =  0;
            this.tabs[this.currentTab].list.forEach((item) => {
                if (item.isSelect) {
                    priceNum += item.price*item.quantity
                }
            });
            return priceNum.toFixed(2);
        },

        /// 总件数
        totalPiece: function() {
            let productTotalNum = 0;

            let currentList = this.tabs[this.currentTab].list;

            let tempArr = currentList.filter((item)=> {return item.isSelect})

            if (tempArr.length > 0) {
                currentList.forEach((item,index) => {
                    if (item.isSelect) {
                        productTotalNum += parseInt(item.quantity);
                    }
                });
            }else {
                currentList.forEach((item,index) => {
                    productTotalNum += parseInt(item.quantity);
                });
            }
            return productTotalNum;
        }
    },

    methods: {

        /**
         * tab页点击事件
         * **/
        clickTab(i){

            if (this.currentTab === i) {
                return
            }

            this.currentTab = i;
            this.getCartList(i);
            this.$forceUpdate();
        },

        async getCartNum () {

            let data = await this.$get(this.$api.cart.offenBuyNum, {}, false);

            if (data) {
                this.tabs.forEach((item,index) => {
                    if (index === 0) {
                        item.num = data.cartCount;
                    }else {
                        item.num = data.oftenCount;
                    }
                })
            }
        },

        /// 选商品图片点击事件
        chooseProductClicked (item,index) {

            item.isSelect = !item.isSelect;
            let currentList = this.tabs[this.currentTab].list;

            this.$set(currentList, index, item)

            let tempArr = currentList.filter((value) => {
                return value.isSelect === false
            });

            if (item.isSelect) {
                this.selectCartList.push(item.id);
            }else {
                let key = this.selectCartList.indexOf(item.id);
                this.selectCartList.splice(key,1);
            }

            if (tempArr.length > 0) {
                this.isAllSelect = false;
            }else  {
                this.isAllSelect = true;
            }
            this.filterActive(item,index)
        },

        itemClicked (item) {

            uni.navigateTo({
                url: "/pages-home/detail/index?productId="+item.productId
            })
        },

        productNumChange (index, e) {
            let currentList = this.tabs[this.currentTab].list;

            let model = currentList[index];
            if (e.target.value >= model.minPurchase) {
                model.quantity = e.target.value
            }else {
                uni.showToast({
                    title: "输入商品数量不能小于" + model.minPurchase,
                    icon: "none"
                })
                model.quantity = model.minPurchase
            }
            this.$set(currentList, index, model);

            if (this.currentTab === 1) {
                this.isReset = false;
                this.$nextTick(()=> {
                    this.isReset = true
                });
            }
            this.isCanEdit(model);
            this.getPriceNum(model);
            this.fetchCartNum(model.quantity,model);
            this.computActivities();
            this.filterActive(model,index)
        },
        /// 活动点击事件
        activityClicked (id) {
            uni.navigateTo({
                url: "/pages-home/activityDetail/index?id="+id
            })
        },
        /// 添加商品
        addClicked (item,index) {

            if (!this.isCanRequest) {
                return
            }

            if (this.currentTab === 0) {
                item.quantity = Number(item.quantity) + Number(item.minStep);
                this.isCanEdit(item);
            }else {
                if (item.quantity === 0) {
                    item.quantity = item.minPurchase;
                }else {
                    item.quantity = Number(item.quantity) + Number(item.minStep);
                }
            }
            this.getPriceNum(item);
            this.fetchCartNum(item.quantity,item);
            this.computActivities();
            this.filterActive(item,index)
        },
        /// 减商品
        reduceClicked(item,index) {

            if (!this.isCanRequest) {
                return
            }

            if (this.currentTab === 0) {
                if (!item.isCanReduce) {
                    uni.showToast({
                        title: "不能小于最小购买量" + item.minPurchase,
                        icon: "none"
                    })
                    return
                }
                item.quantity = Number(item.quantity) - Number(item.minStep);
                if (item.quantity < item.minPurchase) {
                    uni.showToast({
                        title: "不能小于最小购买量" + item.minPurchase,
                        icon: "none"
                    })
                    item.quantity = item.minPurchase;
                }
                this.isCanEdit(item);
            }else {
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
            }
            this.getPriceNum(item);
            this.fetchCartNum(item.quantity,item);
            this.computActivities();
            this.filterActive(item,index)
        },

        getPriceNum (item) {

            if (item.priceList.length > 0) {

                if (item.quantity > 0 && item.priceList.length > 0) {
                    let priceList = item.priceList;

                    let firstPrice = priceList[0];
                    if (item.quantity <= firstPrice.minQuantity) {
                        item.price = item.standardPrice;
                        return
                    }

                    /// 筛选符合条件的价格
                    let filterPriceList =  priceList.filter((value,index) => {
                        return Number(item.quantity) > Number(value.minQuantity) && (Number(item.quantity) <= Number(value.maxQuantity) || Number(value.maxQuantity) === -1)
                    })

                    if (filterPriceList.length > 0) {
                        item.price = filterPriceList[0].price;
                    }else {
                        item.price = item.standardPrice;
                    }
                }
            }else {
                item.price = item.standardPrice;
            }
        },
        /// 购物车数量加减
        async fetchCartNum (cartNum,item) {

            this.isCanRequest = false
            let storeId = this.$storage.get("storeId")

            let parms = {
                "productId": item.productId,
                "quantity": cartNum,
                "storeId": storeId
            }

           let data = await this.$post(this.$api.cart.cartNum, parms, false);

            if (data) {
                if (this.currentTab === 1) {
                    await this.getCartNum();
                }
                this.isCanRequest = true
            }
        },

        isCanEdit (item) {
            if (item.quantity <= item.minPurchase) {
                item.isCanReduce = false
            }else {
                item.isCanReduce = true
            }
        },

        /// 全选事件
        selectAllClicked () {
            this.isAllSelect = !this.isAllSelect
            let currentList = this.tabs[this.currentTab].list;

            currentList.forEach((item,index) => {
                if (!this.isAllSelect) {
                    item.isSelect = false;
                    this.selectCartList = [];
                }else {
                    item.isSelect = true;
                    this.selectCartList.push(item.id);
                    console.log(this.selectCartList)
                }
                this.$set(currentList, index, item);
                this.filterActive(item,index)
            })
        },
        /// 结算
        // 结算时如果符合赠品条件,需要拦截并提示
       async settlementClicked () {

           let currentList = this.tabs[this.currentTab].list;
           let result = []; // 总赠品数
           let activeNum = 0; // 总活动数
           let allGiveNum = 0; // 全赠送活动数
           let onlyOneNum = 0; // 单一送活动数
           let screenArr = [];// 所有多选一的赠品数组
           let screenActiveArr = [];// 满足条件的多选一的赠品数组
           let minQuantityControl = null; // 是否达到最小数量
           let minQuantity = 0; // 最小数量

           for(let i = 0;i < currentList.length;i++){
               let activitys = currentList[i].activityList
               activeNum += activitys.length;
               for(let j= 0;j < activitys.length;j++){
                   let gifts = activitys[j].activityGifts
                   for(let v = 0;v < gifts.length;v++){
                      // minQuantityControl = parseFloat(currentList[i].quantity);
                      minQuantity = parseFloat(activitys[j].minQuantity);
                      let resultStr = currentList[i].isSelect && (parseFloat(currentList[i].quantity) >= parseFloat(activitys[j].minQuantity)) && (parseFloat(currentList[i].price) >= parseFloat(activitys[j].minPrice)) && (gifts[v].giftType == 1 ? parseFloat(currentList[i].quantity) >= parseFloat( gifts[v].doubleBase) : true);
                      result.push(resultStr)
                      //获取用户当前选中产品,多选一情况的赠品
                      if(activitys[j].giftSendType == 1){
                          if(currentList[i].isSelect){
                              screenArr = screenArr.concat(activitys[j].activityGifts);
                              if(resultStr){
                                  screenActiveArr.push(activitys[j].activityGifts);
                              }
                          }
                      }
                   }
               }
           }

            let obj = {};
            let newScreenArr = [];
            // 多选一赠品数去重
            for (var i = 0; i < screenArr.length; i++) {
              if (!obj[screenArr[i].productId]) {
                newScreenArr.push(screenArr[i]);
                obj[screenArr[i].productId] = true;
              }
            }
            screenArr = newScreenArr;
           // 满足条件的赠品数 result1
           let result1 = result.filter((e) => { return JSON.stringify(e) == "true"});


           let tempArr = currentList.filter((item) => {return item.isSelect})

           if (tempArr.length === 0) {
               uni.showToast({
                   title: "请选择结算商品",
                   icon: "none"
               })
               return
           }

           // if(!minQuantityControl && minQuantityControl != 0){
           //     uni.showToast({
           //         title: `最小数量不能低于${minQuantity}`,
           //         icon: "none"
           //     })
           //     return false
           // }
            this.selectActive = [];//置空
            for(let i=0;i<currentList.length;i++){
                let activity = currentList[i].activityList;
                for(let j=0;j<activity.length;j++){
                    let gifts = activity[j].activityGifts;
                    for(let v=0;v<gifts.length;v++){
                        if(gifts[v].isSelect){
                            this.selectActive.push({
                                activityId: activity[j].id, //活动ID
                                giftProductId: gifts[v].giftProductId,//赠品ID
                                productId: currentList[i].productId//参与活动的商品ID
                            })
                        }
                    }
                }
            }

             onlyOneNum = screenArr.length;
             allGiveNum = activeNum - onlyOneNum;
             console.log('所有赠品数','result',result)
             console.log('满足条件的赠品数','result1',result1)
             console.log('所有多选一的赠品数组','screenArr',screenArr)
             console.log('所有多选一的赠品数','screenArr',screenArr.length)
             console.log('符合条件的多选一赠品数','screenActiveArr',screenActiveArr.length)
             console.log('总活动数',"activeNum",activeNum)
             console.log('单一送活动数',"onlyOneNum",onlyOneNum)
             console.log('全赠送活动数','allGiveNum',allGiveNum)
             let computeResult = null;

             if(activeNum == allGiveNum){
                //如果所有活动是全赠送,最终结果为满足条件的赠品数
                computeResult = result1.length;
             }else if(activeNum == onlyOneNum){
                //如果所有活动是单一送
                if(screenActiveArr.length >= onlyOneNum){
                    //符合条件的单一送赠品数大于等于单一送的活动数,最终结果为单一送的活动数
                    computeResult = onlyOneNum;
                }else if(screenActiveArr.length < onlyOneNum){
                    //符合条件的单一送赠品数小于单一送的活动数,最终结果为单一送赠品数
                    computeResult = screenActiveArr.length
                }
             }else{
                //部分活动是单一送
                if(screenActiveArr.length >= onlyOneNum){
                    //符合条件的单一送赠品数大于等于单一送的活动数,最终结果为单一送的活动数 + 符合条件的全赠送品数
                    computeResult = onlyOneNum + (result1.length - screenArr.length);
                }else if(screenActiveArr.length < onlyOneNum){
                    //符合条件的单一送赠品数小于单一送的活动数,最终结果为单一送赠品数 + 符合条件的全赠送品数
                    computeResult = screenActiveArr.length + (result1.length - screenArr.length);

                }
             }
             
             console.log('结果',computeResult)
            if(this.selectActive.length < computeResult){
                 uni.showToast({
                    title: '有赠品可以领取,请勾选',
                    icon: 'none',
                    duration: 2000
                 })
                  return false
             }

           let selectList = [];
           let ids = [];

           currentList.forEach((item,index) => {
               if (item.isSelect) {
                   ids.push(item.id)
                   selectList.push({"productId": item.productId, "quantity": item.quantity})
               }
           });

           let submitParam = {
               addrId: "0",
               orderItemConfirmReq: selectList,
               basketIds: ids,
               storeId: this.$storage.get("storeId"),
               isSelfDelivery: 0,
               gifts: this.selectActive,
           }

           let data = await this.$post(this.$api.cart.orderConfirm, submitParam, true);

           if (data) {
               let orderData = JSON.stringify(data)
               uni.navigateTo({
                   url: "/pages-cart/cart-order/index?orderData=" + orderData
               })
           }
        },

         deleteProductClicked () {

            let tempArr = this.tabs[this.currentTab].list.filter((item,index) => {
                return item.isSelect;
            });

            if (tempArr.length === 0) {
                uni.showToast({
                    title: "请选择您要删除的商品",
                    icon: "none"
                });
                return
            }
            uni.showModal({
                content: "您确定要删除吗？",
                buttonText: '确定',
                success: (res) => {
                    if (res.confirm) {
                        this.deleteProduct();
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                }
            })
        },

        /// 根据ids删除商品
        async deleteProduct () {
            let ids = [];
            this.tabs[this.currentTab].list.forEach((item,index) => {
                if (item.isSelect) {
                    ids.push(item.id);
                }
            });

            let data = await this.$deleteRequest(this.$api.cart.deleteByIds+"?ids=" + ids.join(","), {}, true);

            if (data)  {
               await this.getCartList(this.currentTab);
               this.isAllSelect = false;

               if (this.tabs[0].list.length === 0) {
                   this.isEdit = false;
               }
               await this.getCartNum();
            }
        },
        /// 编辑点击事件
        editClicked () {
            this.isEdit = !this.isEdit;
        },

        /// 计算活动
        computActivities () {

            this.tabs[this.currentTab].list.forEach((item,index) => {

                if (item.activityList.length > 0) {
                    item.showActivity = item.activityList.filter((value,key) => {
                        return parseFloat(item.price) >= parseFloat(value.minPrice) && Number(item.quantity) >= Number(value.minQuantity)
                    })
                }
            });
        },

        /// 获取购物车列表
        async getCartList (i) {

            let url = ""
            if (i === 0) {
                url = this.$api.cart.cartList
            }else {
                url = this.$api.cart.offenBuy
            }

            let data = await this.$get(url, {}, true);

            if (data) {


                let tempArr = data;

                tempArr.forEach((item,index) => {

                    if (item.albumPics) {
                        let pic = item.albumPics.split(",")[0];
                        item.pic = pic;
                    }
                    item.isSelect = false;

                    if (this.selectCartList.length > 0) {
                        this.selectCartList.forEach((value,key) => {
                            if (item.id === value) {
                                item.isSelect = true;
                            }
                        });
                    }else {
                        item.isSelect = false;
                    }

                    if (item.quantity <= item.minPurchase) {
                        item.isCanReduce = false;
                    }else  {
                        item.isCanReduce = true;
                    }
                    if (item.priceList.length > 0) {

                        let firstPrice = item.priceList[0];
                        if (item.quantity <= firstPrice.minQuantity) {
                            item.price = item.standardPrice;
                            return
                        }

                        /// 筛选符合条件的价格
                        let filterPriceList =  item.priceList.filter((value,index) => {
                            return Number(item.quantity) > Number(value.minQuantity) && (Number(item.quantity) <= Number(value.maxQuantity) || Number(value.maxQuantity) === -1)
                        })

                        if (filterPriceList.length > 0) {
                            item.price = filterPriceList[0].price;
                        }else {
                            item.price = item.standardPrice;
                        }

                    }else {
                        item.price = item.standardPrice;
                    }
                })

                if (i === 0) {
                    if (tempArr.length > 0) {
                        let cartUnSelectList =  tempArr.filter((value) => { return value.isSelect === false})
                        this.isAllSelect = cartUnSelectList.length === 0;

                        // 赠品默认选中
                        for(let i=0;i<tempArr.length;i++){
                            if(tempArr[i].activityList.length > 0){
                                let list = tempArr[i].activityList
                                for(let j=0;j<list.length;j++){
                                    // checkbox给默认值
                                    list[j].activityGifts.forEach(item=>{
                                        item.isSelect = false
                                    })
                                       // if(list[j].giftSendType == 0){
                                       //     // 全赠送
                                       //     list[j].activityGifts.forEach(item=>{
                                       //         item.isSelect = true
                                       //     })
                                       // }else if(list[j].giftSendType == 1){
                                       //     // 单一选,默认选择第一项
                                       //     list[j].activityGifts[0].isSelect = true
                                       // }
                                }
                            }
                        }
                        this.priceList = [];
                        tempArr.forEach((item,index)=>{
                            this.filterActive(item,index);
                            item.priceList.forEach(pitem=>{
                                if(pitem.type == 0){
                                    pitem.productId =item.productId
                                    this.priceList.push(pitem)
                                }
                            })
                        })
                    }else {
                        this.isAllSelect = false
                    }
                }

                this.tabs[i].list = tempArr;
                /// 计算活动
                this.computActivities();
            }
        },
        /**
         *
         * 勾选必须满足以下条件:
         * 1.商品数量大于大于活动最小数量
         * 2.商品价格大于大于活动最小价格
         * 3.商品数量大于大于赠品最小基数,并且是倍送机制
         *
         */
        chooseGiftSendType(index,aindex,gindex){
            let list = this.tabs[this.currentTab].list[index];
            let actives = list.activityList[aindex];
            let gifts = actives.activityGifts[gindex];
            let obj = {};
            let result = (parseFloat(list.quantity) >= parseFloat(actives.minQuantity)) && (parseFloat(list.price) >= parseFloat(actives.minPrice)) && (gifts.giftType == 1 ? parseFloat(list.quantity) >= parseFloat( gifts.doubleBase) : true);

            if(result){
                // 多选一,排他,然后选中自己
                if(actives.giftSendType == 1 && actives.activityGifts.length > 0){
                    actives.activityGifts.forEach(item=>{
                        item.isSelect = false;
                    })
                    for(let i=0;i<this.selectActive.length;i++){
                        if(actives.id == this.selectActive[i].activityId){
                            gifts.isSelect = !gifts.isSelect;
                            return false
                        }
                    }
                }
                gifts.isSelect = !gifts.isSelect;
            }else{
                uni.showToast({
                    title: '暂不满足活动要求',
                    icon: "none",
                    duration: 2000
                });
                return false
            }
        },
        /**
         * 计算符合条件的活动,并勾选
         */
        filterActive(item,index){
            let goodSelectState = item.isSelect;
            let selectVal = 0;
            item.activityList.forEach(aitem=>{
                for(let i=0;i<aitem.activityGifts.length;i++){
                    let giftSelectState = (parseFloat(item.quantity) >= parseFloat(aitem.minQuantity)) && (parseFloat(item.price) >= parseFloat(aitem.minPrice)) && (aitem.activityGifts[i].giftType == 1 ? parseFloat(item.quantity) >= parseFloat( aitem.activityGifts[i].doubleBase) : true);

                    if(aitem.giftSendType == 1 && goodSelectState && giftSelectState){
                        //排他
                        aitem.activityGifts[i].isSelect = false
                        //保存应选中
                        selectVal = i
                        return false
                    }else if(goodSelectState && giftSelectState){
                        aitem.activityGifts[i].isSelect = true
                    }else{
                        aitem.activityGifts[i].isSelect = false
                    }
                }
            })
            // //选中自己
            // item.activityList.forEach(aitem=>{
            //     aitem.activityGifts.forEach((gitem,gindex)=>{
            //         if(gindex == selectVal && aitem.giftSendType == 1 && goodSelectState){
            //             gitem.isSelect = true
            //         }
            //     })
            // })
            this.tabs[this.currentTab].list[index] = item;

        },
        surveyPrice(id){
            this.newPriceList = [];
            this.surveyMask = !this.surveyMask;
            this.priceList.forEach(item=>{
                if(item.productId == id){
                    this.newPriceList.push(item)
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>


    .container {
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
    }

    .list-contaier{
        background-color: #F5F5F7;
    }

    .top-view{
        width: 750rpx;
        height: 98rpx;
        border-radius: 0rpx 0rpx 40rpx 40rpx;
        box-shadow: 0 0 3px #e2e2e2;
        background-color: #ffffff;
        position: relative;
        align-items: center;

        .edit-view {
            position: absolute;
            right: 50rpx;
            background: linear-gradient(90deg, #C11920 0%, #EC3A40 100%);
            padding: 0 8rpx;
            border-radius: 4rpx;
            color: #FFFFFF;
            font-size: 22rpx;
            font-weight: 400;
            width: 60rpx;
            height: 38rpx;
            line-height: 38rpx;
        }

        .tab-item{
            width: 150rpx;
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

    .tab-content {
        flex-direction: column;
        display: flex;
        background-color: #FFFFFF;
        width: 100%;
        margin-top: 32rpx;
        border-top-left-radius: 40rpx;
        border-top-right-radius: 40rpx;
        margin-bottom: 109rpx;


        .cart-item-view {
            width: 100%;
            flex-direction: column;
            display: flex;
            justify-content: flex-start;

            .product-policy-view {
                flex-direction: row;
                display: flex;
                margin-left: 100rpx;
                margin-top: 27rpx;
                width: 612rpx;
                flex-wrap: wrap;

                .policy-item-view {
                    background-color: #F5F5F5;
                    display: flex;
                    border-radius: 6rpx;
                    padding: 3rpx 15rpx;
                    margin-left: 10rpx;
                    margin-top: 10rpx;
                    color: #666666;
                }

                text {
                    font-size: 22rpx;
                    font-weight: 400;
                    color: #999999;
                }
            }

            .activity-view {
                position: relative;
                flex-direction: row;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                flex-wrap: wrap;
                justify-content: center;
                background: rgba(192, 25, 31, 0.05);
                margin-top: 20rpx;
                min-height: 65rpx;
                margin-left: 16rpx;
                margin-right: 32rpx;
                border-radius: 10rpx;
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
                    color: #888888;
                    font-size: 24rpx;
                    // margin-right: 20rpx;
                    //margin-left: 10rpx;
                    // width: 450rpx;
                    margin-left: 10rpx;
                    padding-top: 10rpx;
                    padding-bottom: 10rpx;
                }

            }

            .top-info-view {
                flex-direction: row;
                display: flex;
                width: 100%;
                align-items: center;
                margin-top: 40rpx;
                .product-image {
                    margin-left: 30rpx;
                    width: 132rpx;
                    height: 132rpx;
                    border-radius: 12rpx;
                }

                .right-view {
                    width: 518rpx;
                    flex-direction: column;
                    display: flex;
                    height: 132rpx;
                    justify-content: space-between;

                    .product-name-text {
                        margin-left: 20rpx;
                        font-size: 28rpx;
                        font-weight: bold;
                        color: #222222;
                        width: 449rpx;
                    }

                    .price-add-view {
                        flex-direction: row;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        text {
                            margin-left: 20rpx;
                            font-size: 32rpx;
                            font-weight: bold;
                            color: #C0191F;
                        }

                        .add-view {
                            flex-direction: row;
                            display: flex;
                            margin-right: 30rpx;
                            justify-content: center;
                            align-items: center;
                            input {
                                max-width: 100rpx;
                                height: 32rpx;
                                text-align: center;
                            }
                            .image-view{
                                width: 74rpx;
                                height: 44rpx;
                                image {
                                    width: 44rpx;
                                    height: 44rpx;
                                }
                            }

                        }
                    }
                }
            }

            .line-view {
                margin-top: 20rpx;
                width: 720rpx;
                height: 2rpx;
                background-color: #E2E2E2;
                margin-left: 30rpx;
            }
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

        justify-content: space-between;
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

  .select-image {

      image {
          margin-left: 30rpx;
          width: 40rpx;
          height: 40rpx;
      }
  }

    .mask{
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.3);
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;

        .mask-close{
            width: 50rpx;
            height: 50rpx;
            position: absolute;
            top: -60rpx;
            right: 20rpx;
        }

        .surveyMask{
            width: 600rpx;
            height: 300rpx;
            background: #FFFFFF;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            display: flex;
            flex-wrap: wrap;

            .surveyMask-color{
                width: 100%;
                height: 40rpx;
                line-height: 40rpx;
                background: #E41F19;
                color: #FFFFFF;
                padding-left: 20rpx;
            }

            .surveyMask-content{
                height: calc(100% - 40rpx);
                padding: 20rpx 40rpx;

                text{
                    display: inline-block;
                    width: 100%;
                }
            }
        }
    }

    .gift-require{
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        text{
            display: flex;
            flex-shrink: 0;
        }
    }
</style>
