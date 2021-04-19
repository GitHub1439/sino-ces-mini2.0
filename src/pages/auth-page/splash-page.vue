<template>
    <view class="container">
        <view class="content sn-column">
            <image src="/static/images/ic_logo.png"></image>
            <text class="logoName">器械邦</text>
            <text class="subcribe">让全球最优秀的品牌商资源为终端服务</text>
        </view>
    </view>
</template>

<script>
import auth from '@/utils/auth'
export default {
     async onLoad(e){
         let url = await auth.getLaunchUrl(e)
         // url = '/pages/auth-page/auth-info'
         setTimeout(()=>{
             uni.reLaunch({
                 url
             })
         },200)
     }
}
</script>

<style scoped lang="scss">
.container{
    width: 100%;
    height: 100vh;
    background-image: url($ic_splash_bg);
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;
    .content{
        width: 490rpx;
        position: absolute;
        left: 50%;
        top: 35%;
        transform: translateX(-50%);
        align-items: center;
        image{
            width: 170rpx;
            height: 170rpx;
        }
        .logoName{
            font-size: 36rpx;
            font-weight: 600;
            color: #333333;
            opacity: 1;
            letter-spacing: 10rpx;
            margin-left: 15rpx;
            margin-top: 55rpx;
            text-align: center;
        }
        .subcribe{
            width: 490rpx;
            font-size: 25rpx;
            font-weight: 400;
            color: #C9C9C9;
            opacity: 1;
            margin-left: 130rpx;
            margin-top: 30rpx;
        }
    }

}

</style>
