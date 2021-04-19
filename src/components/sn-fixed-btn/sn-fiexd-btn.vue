<template>

    <view class='bottom-fiexd-view'>

        <view class="image-view" v-for="(item,index) in imageList" :key="index" @click='imageClicked(index)'>
            <image :style="{marginLeft: (index === 0 ? 20 : 0) + 'rpx', marginRight: (index === 2 ? 20 : 0) + 'rpx'}" :src='item.src'></image>
        </view>
        <text v-if='shopNum > 0' class='shop-num'>{{shopNum}}</text>
    </view>

</template>

<script>

export default  {

    props: {
        shopNum: {
            type: Number,
            default: 0
        }
    },

    data () {
        return {
            imageList: [{"src": '/static/images/home/mine.png'},/// 我的
                {"src": '/static/images/home/collection.png'},/// 收藏
                {"src": '/static/images/home/shop.png'}, /// 购物车
            ],
        }
    },
    methods: {
        /// 点击事件
        imageClicked (index) {
            this.$emit('imageClicked',index)
        },
    }
}

</script>

<style lang="scss" scoped>

    .bottom-fiexd-view {

        flex-direction: row;
        display: flex;
        align-items: center;
        background-color: #222222;
        width: 340rpx;
        height: 90rpx;
        position: relative;
        border-radius: 45rpx;
        opacity: 0.8;

        .image-view {
            justify-content: center;
            align-items: center;
            display: flex;
            width: 113.3rpx;
            height: 100%;
            image {
                width: 60rpx;
                height: 60rpx;
            }
        }
        .shop-num {
            position: absolute;
            right: 30rpx;
            top: 10rpx;
            width: 34rpx;
            height: 34rpx;
            background-color: #C11920;
            border-radius: 17rpx;
            text-align: center;
            font-size: 24rpx;
            color: #ffffff;

        }
    }


</style>
