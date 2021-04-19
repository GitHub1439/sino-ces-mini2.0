<template>
    <view @touchmove.stop.prevent>
        <view class="sn-modal-box" :style="{width:width,padding:padding,borderRadius:radius}" :class="[(fadein || show)?'sn-modal-normal':'sn-modal-scale',show?'sn-modal-show':'']">
            <view v-if="!custom">
                <view class="sn-modal-title" v-if="title">{{title}}</view>
                <view class="sn-modal-content" :class="[title?'':'sn-mtop']" :style="{color:color,fontSize:size+'rpx'}">{{content}}</view>
                <view class="sn-modalBtn-box" :class="[button.length!=2?'sn-flex-column':'']">
                    <block v-for="(item,index) in button" :key="index">
                        <button
                            class="sn-modal-btn"
                            :class="['sn-'+(item.type || 'primary')+(item.plain?'-outline':''),button.length!=2?'sn-btn-width':'',button.length>2?'sn-mbtm':'',shape=='circle'?'sn-circle-btn':'']"
                            :hover-class="'sn-'+(item.plain?'outline':(item.type || 'primary'))+'-hover'"
                            :data-index="index"
                            @click="handleClick"
                        >
                            {{item.text || "确定"}}
                        </button>
                    </block>
                </view>
            </view>
            <view v-else>
                <slot></slot>
            </view>
        </view>
        <view class="sn-modal-mask" :class="[show?'sn-mask-show':'']" @click="handleClickCancel"></view>
    </view>
</template>

<script>
export default {
    name: 'SnModal',
    props: {
        // 是否显示
        show: {
            type: Boolean,
            default: false
        },
        width: {
            type: String,
            default: '84%'
        },
        padding: {
            type: String,
            default: '40rpx 64rpx'
        },
        radius: {
            type: String,
            default: '0rpx'
        },
        // 标题
        title: {
            type: String,
            default: ''
        },
        // 内容
        content: {
            type: String,
            default: ''
        },
        // 内容字体颜色
        color: {
            type: String,
            default: '#999'
        },
        // 内容字体大小 rpx
        size: {
            type: Number,
            default: 28
        },
        // 形状 circle, square
        shape: {
            type: String,
            default: 'square'
        },
        button: {
            type: Array,
            default() {
                return [{
                    text: '取消',
                    type: 'red',
                    plain: true // 是否空心
                }, {
                    text: '确定',
                    type: 'red',
                    plain: false
                }]
            }
        },
        // 点击遮罩 是否可关闭
        maskClosable: {
            type: Boolean,
            default: true
        },
        // 自定义弹窗内容
        custom: {
            type: Boolean,
            default: false
        },
        // 淡入效果，自定义弹框插入input输入框时传true
        fadein: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    methods: {
        handleClick(e) {
            if (!this.show) return
            const dataset = e.currentTarget.dataset
            this.$emit('click', {
                index: Number(dataset.index)
            })
        },
        handleClickCancel() {
            console.log('66666');
            if (!this.maskClosable) return
            this.$emit('cancel')
        }
    }
}
</script>

<style>
    .sn-modal-box {
        position: fixed;
        left: 50%;
        top: 50%;
        margin: auto;
        background: #fff;
        z-index: 9999998;
        transition: all 0.3s ease-in-out;
        opacity: 0;
        box-sizing: border-box;
        visibility: hidden;
    }

    .sn-modal-scale {
        transform: translate(-50%, -50%) scale(0);
    }

    .sn-modal-normal {
        transform: translate(-50%, -50%) scale(1);
    }

    .sn-modal-show {
        opacity: 1;
        visibility: visible;
    }

    .sn-modal-mask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 9999996;
        transition: all 0.3s ease-in-out;
        opacity: 0;
        visibility: hidden;
    }

    .sn-mask-show {
        visibility: visible;
        opacity: 1;
    }

    .sn-modal-title {
        text-align: center;
        font-size: 34rpx;
        color: #333;
        padding-top: 20rpx;
        font-weight: bold;
    }

    .sn-modal-content {
        text-align: center;
        color: #999;
        font-size: 28rpx;
        padding-top: 20rpx;
        padding-bottom: 60rpx;
    }

    .sn-mtop {
        margin-top: 30rpx;
    }

    .sn-mbtm {
        margin-bottom: 30rpx;
    }

    .sn-modalBtn-box {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between
    }

    .sn-flex-column {
        flex-direction: column;
    }

    .sn-modal-btn {
        width: 46%;
        height: 68rpx;
        line-height: 68rpx;
        position: relative;
        border-radius: 10rpx;
        font-size: 24rpx;
        overflow: visible;
        margin-left: 0;
        margin-right: 0;
    }

    .sn-modal-btn::after {
        content: "";
        position: absolute;
        width: 200%;
        height: 200%;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scale(0.5, 0.5);
        transform: scale(0.5, 0.5);
        left: 0;
        top: 0;
        border-radius: 20rpx;
    }

    .sn-btn-width {
        width: 80% !important;
    }

    .sn-primary {
        background: #5677fc;
        color: #fff;
    }

    .sn-primary-hover {
        background: #4a67d6;
        color: #e5e5e5;
    }

    .sn-primary-outline {
        color: #5677fc;
        background: none;
    }

    .sn-primary-outline::after {
        border: 1px solid #5677fc;
    }

    .sn-danger {
        background: #ed3f14;
        color: #fff;
    }

    .sn-danger-hover {
        background: #d53912;
        color: #e5e5e5;
    }

    .sn-danger-outline {
        color: #ed3f14;
        background: none;
    }

    .sn-danger-outline::after {
        border: 1px solid #ed3f14;
    }

    .sn-red {
        background: #e41f19;
        color: #fff;
    }

    .sn-red-hover {
        background: #c51a15;
        color: #e5e5e5;
    }

    .sn-red-outline {
        color: #e41f19;
        background: none;
    }

    .sn-red-outline::after {
        border: 1px solid #e41f19;
    }

    .sn-warning {
        background: #ff7900;
        color: #fff;
    }

    .sn-warning-hover {
        background: #e56d00;
        color: #e5e5e5;
    }

    .sn-warning-outline {
        color: #ff7900;
        background: none;
    }

    .sn-warning-outline::after {
        border: 1px solid #ff7900;
    }

    .sn-green {
        background: #19be6b;
        color: #fff;
    }

    .sn-green-hover {
        background: #16ab60;
        color: #e5e5e5;
    }

    .sn-green-outline {
        color: #19be6b;
        background: none;
    }

    .sn-green-outline::after {
        border: 1px solid #19be6b;
    }

    .sn-white {
        background: #fff;
        color: #333;
    }

    .sn-white-hover {
        background: #f7f7f9;
        color: #666;
    }

    .sn-white-outline {
        color: #333;
        background: none;
    }

    .sn-white-outline::after {
        border: 1px solid #333;
    }

    .sn-gray {
        background: #ededed;
        color: #999;
    }

    .sn-gray-hover {
        background: #d5d5d5;
        color: #898989;
    }

    .sn-gray-outline {
        color: #999;
        background: none;
    }

    .sn-gray-outline::after {
        border: 1px solid #999;
    }

    .sn-outline-hover {
        opacity: 0.6;
    }

    .sn-circle-btn {
        border-radius: 40rpx !important;
    }

    .sn-circle-btn::after {
        border-radius: 80rpx !important;
    }
</style>
