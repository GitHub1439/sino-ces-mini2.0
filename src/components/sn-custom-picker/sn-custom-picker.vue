<template>
    <view class="sn-datetime-picker">
        <view class="sn-mask" :class="{ 'sn-mask-show': isShow }" @touchmove.stop.prevent="stop" catchtouchmove="stop" @tap="hide"></view>
        <view class="sn-header" :class="{ 'sn-show': isShow }">
            <view class="picker-head sn-row">
                <text class="head-text">{{getOptions.title}}</text>
                <text @click="btnFix" class="btnText" :style="{color:isSelectStatus?'rgba(120, 125, 136, 1)':'#0073CF'}">确定</text>
            </view>
            <view class="sn-picker-body">
                <picker-view @pickstart="pickStart" @pickend="pickEnd" :value="value" @change="change" class="sn-picker-view">
                    <picker-view-column>
                        <view class="sn-column-item" v-for="(item1,index) in getOptions.array" :key="index">
                            {{item1.text}}<text class="sn-text">{{getOptions.unit}}</text>
                        </view>
                    </picker-view-column>
                </picker-view>
            </view>
        </view>
    </view>
</template>

<script>
/* 自定义选择组件 */
export default {
    name: 'SnCustomPicker',
    props: {
        // 固定类型，性别，健康状况，身高，体重，其他类型不传
        type: {
            type: String,
            default: ''
        },
        // 弹框头部标题，默认为空
        title: {
            type: String,
            default: ''
        },
        // 展示数据,常用类型不用传(性别，健康状况等),其他类型要传
        options: {
            type: Array,
            default: ()=>[]
        },
        // 编辑状态默认值
        obj: {
            type: Object,
            default() {
                return {}
            }
        },
        // 初始化时默认展示下标
        init: {
            type: Number,
            default: 0
        },
        // 健康状况数据,除健康状况不传
        healths: {
            type: Array,
            default: ()=>[]
        },
        // 性别数据字典,除性别不传
        sexs: {
            type: Array,
            default: ()=>[]
        },
        isShowCover: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            isShow: false,
            value: [0],
            item: {},
            reset: false,
            heights: [],
            weights: [],
            waistline: [],
            isSelectStatus: false

        }
    },
    computed: {
        getOptions() {
            let array = []
            let titleStr = ''
            let unitStr = ''
            switch (this.type) {
            case 'sex':
                array = this.sexs
                titleStr = '请选择您的性别'
                break
            case 'height':
                array = this.heights
                titleStr = '请选择您的身高'
                unitStr = 'cm'
                break
            case 'weight':
                array = this.weights
                titleStr = '请选择您的体重'
                unitStr = 'kg'
                break
            case 'waistline':
                array = this.waistline
                titleStr = '请选择您的腰围'
                unitStr = 'cm'
                break
            case 'health':
                array = this.healths
                titleStr = '请选择您的健康程度'
                break
            default:
                array = this.options
                titleStr = this.title
                unitStr = ''
                break
            }
            return {array, title: titleStr, unit: unitStr}
        }
    },
    mounted() {
        this.initData()
    },
    async created() {
        for (let i = 50; i <= 250; i++) {
            this.heights.push({value: i - 50, text: i})
        }
        for (let i = 10; i <= 200; i++) {
            this.weights.push({value: i - 10, text: i})
        }
        for (let i = 50; i <= 200; i++) {
            this.waistline.push({value: i - 50, text: i})
        }
    },
    watch: {
        propsChange() {
            this.reset = true
            setTimeout(() => {
                this.initData()
            }, 10)
        }
    },
    methods: {
        pickStart() {
            this.isSelectStatus = true
        },
        pickEnd() {
            this.isSelectStatus = false
        },
        getIndex(arr, val) {
            let index = arr.indexOf(val)
            return ~index ? index : 0
        },
        // 日期时间处理
        initSelectValue() {
            this.item = this.getOptions.array[0]
        },
        initData() {
            this.initSelectValue()
            this.reset = false
            this.value = [0]
            this.setOptions()

        },
        setOptions() {
            setTimeout(() => {
                this.$set(this.value, 0, this.getIndex(this.getOptions.array, this.item))
            }, 8)
        },
        show() {

            setTimeout(() => {
                let index = 0
                switch (this.type) {
                case 'sex':
                    this.value = [this.obj.sex - 1 || 0]
                    this.item = this.getOptions.array[this.obj.sex - 1 || 0]
                    break
                case 'height':
                    this.obj.height = this.obj.height || 150
                    this.getOptions.array.forEach((e, i)=>{
                        if (e.text === Number(this.obj.height)) {
                            index = i
                        }
                    })
                    this.value = [index]
                    this.item = this.getOptions.array[index]
                    break
                case 'weight':
                    this.obj.weight = this.obj.weight || 50
                    this.getOptions.array.forEach((e, i)=>{
                        if (e.text === Number(this.obj.weight)) {
                            index = i
                        }
                    })
                    this.value = [index]
                    this.item = this.getOptions.array[index]
                    break
                case 'waistline':
                    this.obj.waistline = this.obj.waistline || 80
                    this.getOptions.array.forEach((e, i)=>{
                        if (e.text === Number(this.obj.waistline)) {
                            index = i
                        }
                    })
                    this.value = [index]
                    this.item = this.getOptions.array[index]
                    break
                case 'health':
                    this.getOptions.array.forEach((e, i)=>{
                        if (e.text === this.obj.healthStatus) {
                            index = i
                        }
                    })
                    this.value = [index]
                    this.item = this.getOptions.array[index]
                    break
                default:
                    this.value = [this.init]
                    this.item = this.getOptions.array[this.init]
                    break
                }
                this.isShow = true
            }, 50)
        },
        hide() {
            this.isShow = false
            this.$emit('cancleLis', {show: this.isShow})
        },
        change(e) {
            this.value = e.detail.value
            this.item = this.getOptions.array[this.value[0]]
        },
        btnFix() {
            if (this.isSelectStatus) {
                return
            }
            this.$emit('confirm', this.item)
            this.hide()
        }
    }
}
</script>

<style>
    .page{
        background-color: #fff;
    }
    .sn-datetime-picker {
        position: relative;
        z-index: 999;
        border-radius: 12px 12px 0px 0px;
    }
    .sn-picker-view {
        height: 100%;
        box-sizing: border-box;
    }

    .sn-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.6);
        visibility: hidden;
        opacity: 0;
        transition: all 0.3s ease-in-out;
    }

    .sn-mask-show {
        visibility: visible !important;
        opacity: 1 !important;
    }

    .sn-header {
        z-index: 9999;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        transition: all 0.3s ease-in-out;
        transform: translateY(100%);
    }

    .sn-show {
        transform: translateY(0);
    }

    .sn-picker-header {
        width: 100%;
        height: 90rpx;
        padding: 0 40rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        font-size: 32rpx;
        background: #fff;
        position: relative;
    }

    .sn-picker-header::after {
        content: '';
        position: absolute;
        border-bottom: 1rpx solid #eaeef1;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        bottom: 0;
        right: 0;
        left: 0;
    }

    .sn-picker-body {
        width: 100%;
        height: 500rpx;
        overflow: hidden;
        background-color: #fff;
    }

    .sn-column-item {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36rpx;
        color: #333;
    }

    .sn-text {
        font-size: 24rpx;
        padding-left: 8rpx;
    }

    .sn-btn-picker {
        padding: 16rpx;
        box-sizing: border-box;
        text-align: center;
        text-decoration: none;
    }

    .sn-opacity {
        opacity: 0.5;
    }
    .picker-head {
        width: 750rpx;
        height: 108rpx;
        border-radius: 12px 12px 0px 0px;
        align-items: center;
        justify-content: center;
        background-color: #F1F1F1;
    }
    .head-text {
        font-size: 32rpx;
        line-height: 32rpx;
        color: rgba(120, 125, 136, 1);
        opacity: 1;
    }

    .btnText {
        font-size: 32rpx;
        line-height: 45rpx;
        color: #5677fc;
        opacity: 1;
        position: absolute;
        right: 45rpx;
        top: 31rpx;
    }
</style>
