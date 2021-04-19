<template>
    <view class="box sn-column">
        <view class="center">
            <view><image :src="noData" class="bg" :style="{'width':width + 'rpx','height': height + 'rpx'}"></image></view>
            <view class="tips">{{title}}</view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'Nodata',
    props: {
        title: {
            type: String,
            default: '暂无数据'
        },
        width: {
            type: Number,
            default: 330
        },
        height: {
            type: Number,
            default: 330
        },
        distance: {
            type: Number,
            default: 0
        },
        noData: {
            type: String,
            default: "/static/images/person/image_zwshdz.png"
        }
    },
    data() {
        return {
            screenHeight: ''
        }
    }
}
</script>

<style>
    .box{
        width: 100%;
        height: 92vh;
        align-items: center;
        justify-content: center;
        align-self: center;
    }
    .tips{
        text-align: center;
        color: #777777;
        padding: 40rpx 0;

    }
</style>
