<template>
    <view>
        <scroll-view :style="getHeight" :refresher-default-style="refresherDefaultStyle" scroll-y="false" refresher-enabled="true" :refresher-triggered="triggered"
                     :refresher-threshold="60" :refresher-background="refresherBackground" @refresherrefresh="onRefresh" @refresherrestore="onRestore"
                     @refresherabort="onAbort" @scrolltolower="scrollBottem">
            <view class="sn-column">
                <slot></slot>
                <!-- 加载....没有更多 -->
                <view v-if="isNeedLoad" style="line-height: 60rpx;margin-bottom: 20rpx;margin-top:20rpx">
                    <u-loadmore bg-color="#F7F8FA" :status="loadStatus" :icon-type="iconType" :load-text="loadText" />
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
export default {
    name: 'sn-custom-refresh',
    props:{
        //0只有导航栏高度,1导航栏+标签高度
        distanceType: {
            type: Number,
            default: 0
        },
        refresherBackground: {
            type: String,
            default: '#F7F8FA'
        },
        refresherDefaultStyle: {
            type: String,
            default: 'black'
        },
        duration: {
            type: Number,
            default: 500
        },
        isNeedLoad: {
            type: Boolean,
            default: true
        },
        loadStatus: {
            type: String,
            default: 'loadmore'
        }
    },
    computed:{
        getHeight(){
            let {distanceType,statusHeight,navHeight} = this
            let distanceTop = 0
            if(distanceType ===0){
                distanceTop = statusHeight + navHeight
            }else if(distanceType ===1){
                distanceTop = statusHeight + navHeight + uni.upx2px(98)
            }
            return `overflow-y: hidden;height: calc(100vh - ${distanceTop}px);`
        }
    },
    created () {
        console.log(this.isNeedLoad)
        let sysinfo = wx.getSystemInfoSync()
        this.statusHeight = sysinfo.statusBarHeight
        this.isiOS = sysinfo.system.indexOf('iOS') > -1
        this.navHeight = 0
        !this.isiOS ? (this.navHeight = 48) : (this.navHeight = 44)
    },
    data(){
        return {
            triggered:true,
            loadText: {
                loadmore: '上拉加载更多',
                loading: '努力加载中',
                nomore: '没有更多数据了'
            },
            iconType: 'flower',
            statusHeight: 0,
            navHeight: 0,
            isiOS: false

        }
    },
    methods: {
        /**
         * 刷新操作
         * */
        onRefresh(){
            setTimeout(()=>{
                this.triggered = false
                this.$emit('refresherrefresh')
            },this.duration)
        },
        /**
         * 下拉被复位
         *  */
        onRestore(){
            this.triggered = true; // 需要重置
        },
        /**
         * 下拉被中止，没下拉完就松手就会触发
         * */
        onAbort(){
            console.log("onAbort");
        },
        /**
         * 滑动到底部操作
         * */
        scrollBottem(){
            if(!this.isNeedLoad){
                return
            }
            setTimeout(()=>{
                // this.triggered = false;
                this.$emit('scrolltolower')
            },this.duration)
        }
    }
}
</script>

<style scoped lang="scss">

</style>
