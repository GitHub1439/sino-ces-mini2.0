<template>
    <view class="sn-column bg">
<!--        <view class="line-view"></view>-->
<!--        <view class="item-view sn-row-center border-bottom">-->
<!--            <text class="title">订单号</text>-->
<!--            <text class="mgl24">{{detail.orderSn}}</text>-->
<!--        </view>-->
        <view class="line-view"></view>
        <view class="item-view sn-row-center border-bottom">
            <text class="title">发票类型</text>
            <view @click="selectType(item,index)" :class="[index===0?'mgl24':'mgl32',index === selectIndex?'select-view':'unselect-view']" v-for="(item,index) in invoiceTypes">
                {{item.text}}
            </view>
        </view>
        <view class="item-view sn-row-center border-bottom">
            <text class="title">发票抬头</text>
            <input @input="(e)=>inputChange(e,'billHeader')" placeholder="请填写发票抬头" placeholder-style="color:#888888;font-zise:32rpx"/>
        </view>
        <view class="item-view sn-row-center border-bottom">
            <text class="title">备注信息</text>
            <input @input="(e)=>inputChange(e,'billNote')" placeholder="给客服留个言" placeholder-style="color:#888888;font-zise:32rpx"/>
        </view>
        <view class="line-view"></view>
<!--        <text class="head-title">地址信息</text>-->
<!--        <view class="sn-row-between sn-row-center">-->
<!--            <view class="sn-column addr-view">-->
<!--                <view class="sn-row-between">-->
<!--                    <view class="sn-row-center">-->
<!--                        <text class="name">黄贤明</text>-->
<!--                        <text class="phone">12311111111</text>-->
<!--                    </view>-->
<!--                </view>-->
<!--                <view class="sn-row-between addr-content">-->
<!--                    <view class="addr"><text>湖南省长沙市岳麓区谷苑路265号湖南省长沙市岳麓区谷苑路265号</text></view>-->
<!--                </view>-->
<!--            </view>-->
<!--            <uni-icons style="margin-right: 20rpx" color="#888888" type="arrowright" size="24" />-->
<!--        </view>-->
        <view @click="goInvoice" class="add-btn">提交开票</view>
    </view>
</template>

<script>
export default {

    data(){
        return {
            detail: {},
            invoiceTypes: [
                {text:'普通发票',value:1,selected:true},
                {text:'电子发票',value:2,selected:false},
                {text:'增值税发票',value:3,selected:false}
            ],
            selectIndex: 0,
            params: {
                "billAmount": 0,
                "billHeader": "",
                "billNote": "",
                "billRate": 0,
                "billReceiverPhone": "",
                "billStatus": 0,
                "billTaxNumber": "",
                "billType": 0,
                "orderId": ""
            }
        }
    },
    onLoad(option){
        this.detail = JSON.parse(decodeURIComponent(option.item))
        console.log(this.detail)
        this.params.orderId = this.detail.id
        this.params.billAmount = this.totalAmount
    },
    methods: {
        /**
         * 文字输入监听
         * */
        inputChange(e,key){
            this.params[key] = e.detail.value
        },
        /**
         * 新增申请开票
         * */
        async goInvoice(){
            if(this.params.billHeader.length === 0){
                this.$util.showToast('请输入发票抬头')
                return
            }
            let data = await this.$post(this.$api.person.addBill,this.params)
            if(data){
                this.$util.showToast('开票成功')
                uni.$emit('refreshBill')
                uni.navigateBack({
                    delta: 1
                })

            }
        },
        /**
         * 选中发票类型
         * */
        selectType(e,i){
            this.selectIndex = i
            this.params.billType = this.invoiceTypes[i].value
            e.selected = true
            this.invoiceTypes.forEach((o,index)=>{
                if(i!==index){
                    o.selected = false
                }
            })
        }
    }
}
</script>

<style lang="scss">
     .bg{
         background-color: #fff;
     }
     .line-view{
         width: 750rpx;
         height: 20rpx;
         background-color: #F5F5F7;
     }
     .item-view{
         width: 690rpx;
         height: 128rpx;
         background: #FFFFFF;
         opacity: 1;
         margin-left: 30rpx;
         margin-right: 30rpx;
         input{
             width: 400rpx;
             height: 100rpx;
             margin-left: 24rpx;
         }
         .title{
             font-size: 32rpx;
             font-weight: 400;
             color: #222222;
             opacity: 1;
         }
         .select-view{
             padding-left: 18rpx;
             padding-right: 18rpx;
             height: 56rpx;
             background: #FFF6F7;
             border: 1rpx solid #C11920;
             opacity: 1;
             border-radius: 48rpx;
             font-size: 28rpx;
             line-height: 56rpx;
             text-align: center;
             color: #C11920;
         }
         .mgl32{
             margin-left: 24rpx;
         }
         .mgl24{
             margin-left: 32rpx;
         }
         .border-bottom{
             border-bottom: 2rpx solid #F5F5F7;
         }
         .unselect-view{
             padding-left: 18rpx;
             padding-right: 18rpx;
             height: 56rpx;
             background: #F5F5F7;
             border: 1rpx solid #888888;
             border-radius: 34rpx;
             line-height: 56rpx;
             text-align: center;
             font-size: 28rpx;
             color: #888888;
         }
     }
     .head-title{
         font-size: 32rpx;
         font-weight: bold;
         color: #444444;
         opacity: 1;
         margin-left: 30rpx;
         margin-top: 32rpx;
     }
     .addr-view{
         width: 750rpx;
         background-color: #fff;
         padding-left: 30rpx;
         padding-right: 30rpx;
         padding-bottom: 28rpx;
         padding-top: 28rpx;

         .name{
             font-size: 32rpx;
             font-weight: bold;
             color: #222222;
         }
         .phone{
             font-size: 28rpx;
             font-weight: bold;
             color: #222222;
             margin-left: 12rpx;
         }
         .addr{
             width: 592rpx;
             height: 80rpx;
             margin-top: 12rpx;
             font-size: 28rpx;
             font-weight: 400;
             color: #888888;
             opacity: 1;
             justify-content: center;
             text{
                 width: 592rpx;
                 height: 80rpx;
                 font-size: 28rpx;
                 font-weight: 400;
                 color: #888888;
                 text-overflow: -o-ellipsis-lastline;
                 overflow: hidden;
                 text-overflow: ellipsis;
                 display: -webkit-box;
                 -webkit-line-clamp: 2;
                 line-clamp: 2;
                 -webkit-box-orient: vertical;
             }
         }
         .addr-content{
             margin-top: 11rpx;
             align-items: center;
         }
         .edit-image{
             width: 48rpx;
             height: 48rpx;
         }
     }
     .add-btn{
         position: fixed;
         bottom: 64rpx;
         left: 40rpx;
         width: 670rpx;
         height: 96rpx;
         background: linear-gradient(178deg, #EE2626 0%, #C11920 100%);
         opacity: 1;
         border-radius: 48rpx;
         font-size: 32rpx;
         font-weight: bold;
         line-height: 96rpx;
         color: #FFFFFF;
         text-align: center;
     }
</style>
