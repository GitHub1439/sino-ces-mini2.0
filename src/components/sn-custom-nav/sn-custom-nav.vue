<template>

    <view class='container' :style="[{height: statusHeight + navHeight + 'px'}]">

        <view class="message" :style="[{marginTop: statusHeight + (navHeight-20)/2 + 'px'}]" @click="messageClicked">
<!--            <button class="btn"  :open-type="'contact'" :plain="true">-->
                <image @click="callPhone" class="image" src="/static/images/home/message.png"></image>
<!--            </button>-->
            <text v-if="messageNum !== '0'">{{messageNum}}</text>
        </view>

        <text v-if='isShowTitle' class='nav-title' :style="[{marginTop: statusHeight + (navHeight-19)/2 + 'px', width: windowWidth + 'px'}]">{{navTitle}}</text>

        <view v-else class="custom-bar_wrapper" :style="[{marginTop: statusHeight + (navHeight-40)/2 + 'px', width: windowWidth*0.53 + 'px'}]" >
            <view class="search-group" @click="searchTextClicked">
                <image src="/static/images/home/search.png" mode="aspectFit" />
                <text>热销产品</text>
            </view>
        </view>

    </view>

</template>


<script>
    export default  {

        props: {
            isShowTitle: {
                type: Boolean,
                default: true
            },
            navTitle: {
                type: String,
                default: "哈尔滨龙宇医疗器械店"
            },
            messageNum: {
                type: String,
                default: "0"
            },
            store: {
                type: Object,
                default: ()=>{
                    return {}
                }
            }

        },

        data () {
            return {
                statusHeight: 0,
                navHeight: 0,
                isiOS: false,
                windowWidth: 0,
            }
        },
        created() {


            const that = this;
            uni.getSystemInfo({
                success: function (res) {
                    that.windowWidth = res.windowWidth;
                }
            });
            this.setNavSize()
            console.log(this.windowWidth)
        },
        methods:{
            /**
             * 设置导航栏高度
             * **/
            setNavSize: function() { //设置头部高度
                let sysinfo = wx.getSystemInfoSync()
                this.statusHeight = sysinfo.statusBarHeight
                this.isiOS = sysinfo.system.indexOf('iOS') > -1
                this.navHeight =0
                !this.isiOS ? (this.navHeight = 48) : (this.navHeight = 44)
            },

            /// 消息点击事件
            messageClicked () {
                this.$emit("messageClicked")
            },
            /// 搜索点击事件
            searchTextClicked () {
                this.$emit("searchTextClicked")
            },
            callPhone(){
                let that = this
                uni.showModal({
                    title: '咨询电话',
                    content: that.store.phone,
                    confirmText:'拨打',
                    complete(e){
                        if(e.confirm){
                            uni.makePhoneCall({
                                phoneNumber: that.store.phone
                            })
                        }
                    }
                })
            }

        }
    }


</script>

<style lang="scss" scoped>

    .container {
        background: linear-gradient(to right, #EF3E3D,#C4282F);
        width: 100%;
        flex-direction: row;
        display: flex;
        padding: 0;
        margin: 0;
    }

    .message {
        position: relative;
        margin-left: 32rpx;
        width: 50rpx;
        height: 50rpx;
        .btn{
            border: none;
            width: 50rpx;
            height: 50rpx;
            background-image: url("/static/images/home/message.png");
            background-size: 50rpx 50rpx;
            background-repeat:no-repeat;
        }

        .image {
            width: 50rpx;
            height: 50rpx;
        }

        text {
            position: absolute;
            top: -5rpx;
            right: -10rpx;
            color: #C0191F;
            background-color: #ffffff;
            width: 24rpx;
            height: 24rpx;
            line-height: 24rpx;
            border-radius: 12rpx;
            font-size: 15rpx;
            text-align: center;
        }
    }

    .nav-title {
        width: 100%;
        text-align: center;
        color: #FFFFFF;
        font-size: 34rpx;
        position: absolute;
        left: 0;
    }

    .custom-bar_wrapper {
        padding: 0rpx;
        display: flex;
        justify-content: center;
        align-items: center;

        .search-group {
            width: 100%;
            height: 56rpx;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            border-radius: 60rpx;
            margin-left: 30rpx;
            padding: 0 10rpx;
            background: rgba(255, 255, 255, 0.9);
            opacity: 1;

            text{
                font-size: 24rpx;
                color: #C0191F;
                font-weight: 400;
            }

            image {
                height: 32rpx;
                width: 32rpx;
                margin-right: 20rpx;
            }
        }
    }
</style>
