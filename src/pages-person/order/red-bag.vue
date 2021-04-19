<template>
    <view>
        <!-- 左侧红包 -->
        <!-- 	<view class="r_bag">
			<image class="bag1" :animation="bag1animation" src="/static/icon/bag1.png" mode="" @click="openrbagbtn()"></image>
		</view> -->

        <!-- 红包封面 -->
        <view class="rbag_model" v-if="rbagmodelshow" @touchmove.prevent.stop>
            <view class="rbag_con hidden">
                <view class="rbag_top">
                    <view class="rbag_top_info">
                        <image class="rbag_logo" src="/static/icon/logo.jpg" mode=""></image>
                        <view class="app_name">恭喜发财</view>
                        <view class="rbag_tips">送您一个红包</view>
                    </view>
                </view>
                <view class="open_rbag_btn" :animation="openbrnanimation" @click="openbtn()">開</view>
            </view>
            <!-- 	<view class="rbag_con">
				<view class="hide_btn" @click.stop="hidebtn">
					<icon type="cancel" color="#fbd977" size="28" />
				</view>
			</view> -->
        </view>

        <!-- 打开红包 -->
        <view class="open_rbag_model" v-if="openrbagmodelshow" @touchmove.prevent.stop>
            <image class="rbag_conbg" src="@/static/images/person/openrbag.png"></image>
            <view class="rbag_conbg open_rbag_con">
                <view class="open_title">— 恭喜您获得 —</view>
                <view class="rbag_detail">
                    <view class="open_money">
                        <countup :num="num" color="#c95948" width='21' height='34' fontSize='34'></countup>
                        <view class="danwei">元</view>
                    </view>
                    <view class="open_tips">已存入钱包，可直接体现</view>
                </view>
                <view class="lookbag_box">
                    <view class="lookbag_btn">
                        <view class="text" @click.stop="lookbagbrn()">完成</view>
                    </view>
                </view>
                <!-- 	<view class="hide_btn" @click.stop="hideopenbtn()">
					<icon type="cancel" color="#fbd977" size="28" />
				</view> -->
            </view>
        </view>


    </view>
</template>

<script>
    // 应用数字滚动插件
    import countup from '@/components/countUp/countUp.vue';
    export default {
        data() {
            return {
                sendBizRedPacket: {
                    timeStamp: "",
                    nonceStr: "",
                    package: "",
                    signType: "",
                    paySign: "",
                },
                orderSn: '',
                num: 12.68,
                bag1animation: {},
                openbrnanimation: {},
                rbagmodelshow: true,
                openrbagmodelshow: false,
            };
        },
        onLoad(options) {
            debugger
            console.log('options', options);
            this.orderSn = options.orderSn;
            this.wxPay();
        },
        onShow: function() {
            wx.hideHomeButton()
        },
        methods: {
            async wxPay() {
                let that = this
                let data =await that.$post(that.$api.common.sendRedBag + `?orderSn=${that.orderSn}`, {}, true)
                if (data) {
                    console.log("pay", JSON.stringify(data))
                    that.sendBizRedPacket = data;
                }
            },
            // 红包封面 => 关闭按钮
            hidebtn: function() {
                this.rbagmodelshow = false;
            },
            // 红包封面 => 開红包按钮
            openbtn: function() {
                let that = this;
                var animation = uni.createAnimation({
                    duration: 1000,
                    timingFunction: 'ease',
                })
                that.openbrnanimation = animation;
                // animation.rotate3d(0,1,0,360).step();
                animation.rotateY(360).step();
                that.openbrnanimation = animation.export();
                console.log("temp:"+JSON.stringify(that.sendBizRedPacket))
                let tempPar=that.sendBizRedPacket

                wx.sendBizRedPacket({
                    timeStamp: tempPar.timeStamp,
                    nonceStr: tempPar.nonceStr,
                    package: tempPar.package,
                    signType: tempPar.signType,
                    paySign: tempPar.paySign,
                    success(res) {
                        this.editbtn(res.redRecordId)

                        setTimeout(function() {
                            that.rbagmodelshow = false;
                            that.openrbagmodelshow = true;
                            that.openbrnanimation = {};
                        }, 1000);
                    },
                    fail(res) {
                        wx.showModal({
                          title: 'fail提示',
                          content: JSON.stringify(res)
                        });
                        // that.$util.showToast('支付失败')
                        console.log('失败' + JSON.stringify(res))
                    },
                    complete(res) {
                        console.log('完成 res' + JSON.stringify(res))
                    }
                })


            },
            // 更新红包领取状态
            async editbtn(rcoreId){
                let par={
                    id: rcoreId
                }
                let data =await that.$post(that.$api.common.sendRedBagNotice, par, true)
                if (data) {
                    uni.redirectTo({
                       url: "/pages-person/order/index?isPayPage=" + true + "&cur=4"
                    })
                }
            },

            // 打开红包  => 关闭按钮
            hideopenbtn: function() {
                this.openrbagmodelshow = false;
            },
            // 打开红包  => 完成
            lookbagbrn: function() {
                // 跳转订单
                uni.navigateTo({
                    url: "/pages-person/order/index?isPayPage=" + true + "&cur=4"
                })

            }
        },
        components: {
            countup
        },
    }
</script>

<style lang="scss">
    @import '@/static/css/red_bag.scss';
</style>
