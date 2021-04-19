<template>
    <view class="sn-datetime-picker">
        <view class="sn-mask" :class="{ 'sn-mask-show': isShow }" @touchmove.stop.prevent="stop" catchtouchmove="stop" @tap="hide"></view>
        <view class="sn-header" :class="{ 'sn-show': isShow }">
            <view class="picker-head sn-row">
                <text class="head-text">请选择您的地区</text>
                <text @click="btnFix" class="btnText" :style="{color:isSelectStatus?'rgba(120, 125, 136, 1)':'#0073CF'}">确定</text>
            </view>
            <view class="sn-picker-body">
                <picker-view @pickstart="pickStart" @pickend="pickEnd" :value="value" @change="change" class="sn-picker-view">
                    <picker-view-column>
                        <view class="sn-column-item" :class="[fontsizeClass(item.name)]" v-for="(item,index) in regions" :key="index">
                            {{item.name}}
                        </view>
                    </picker-view-column>
                    <picker-view-column>
                        <view class="sn-column-item" :class="[fontsizeClass(item.name)]" v-for="(item,index) in citys" :key="index">
                            {{item.name}}
                        </view>
                    </picker-view-column>
                    <picker-view-column>
                        <view class="sn-column-item" :class="[fontsizeClass(item.name)]" v-for="(item,index) in areas" :key="index">
                            {{item.name}}
                        </view>
                    </picker-view-column>
                </picker-view>
            </view>
        </view>
    </view>
</template>

<script>
/* 时间选择组件 */
export default {
    name: 'SnRegionsPicker',
    props: {
        initAddr: {
            type: Array,
            default: ()=>[]
        },
        initAddrStr: {
            type: Array,
            default: ()=>[]
        },
    },
    data() {
        return {
            isShow: false,
            regions: [{provinceName: '12'}, {provinceName: '33'}],
            citys: [],
            areas: [],
            value: [0, 0, 0],
            provinceName: '',
            provinceCode: -1,
            cityName: '',
            cityCode: -1,
            districtName: '',
            districtCode: -1,
            isSelectStatus: false

        }
    },
    async created() {
        this.initData()
    },
    watch: {

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
        fontsizeClass(e) {
            if (!e) return ''
            let len = e.length
            if (len > 8) return 'font-size4'
            let o = {5: 'font-size1', 6: 'font-size2', 7: 'font-size3', 8: 'font-size4'}
            return o[len] || ''
        },
        async initData() {
            this.regions = await this.getlist({type: '1', code: ''})
            this.citys = await this.getlist({type: '2', code: this.regions[this.value[0]].code}) || []
            this.areas = await this.getlist({type: '3', code: this.citys[this.value[1]].code}) || []
            if (this.initAddr.length !== 0 || this.initAddrStr.length !==0) {
                this.regions.forEach((e, i)=>{
                    if (this.initAddr[0] === e.code || this.initAddrStr[0] === e.name) {
                        this.$set(this.value, 0, i)
                    }
                })
                this.citys = await this.getlist({type: '2', code: this.regions[this.value[0]].code})
                this.citys.forEach((e, i)=>{
                    if (this.initAddr[1] === e.code || this.initAddrStr[1] === e.name) {
                        this.$set(this.value, 1, i)
                    }
                })
                this.areas = await this.getlist({type: '3', code: this.citys[this.value[1]].code})

                this.areas.forEach((e, i)=>{
                    if (this.initAddr[2] === e.code || this.initAddrStr[2] === e.name) {
                        this.$set(this.value, 2, i)
                    }
                })

            }
            console.log(this.value)
            this.provinceName = this.regions[this.value[0]].name
            this.cityName = this.citys[this.value[1]].name
            this.districtName = this.areas[this.value[2]].name
            this.provinceCode = this.regions[this.value[0]].code
            this.cityCode = this.citys[this.value[1]].code
            this.districtCode = this.areas[this.value[2]].code
        },
        show() {
            setTimeout(() => {
                this.isShow = true
            }, 50)
        },
        hide() {
            this.isShow = false
        },
        async getlist(arg) {
            let url = arg.code?'?code='+arg.code:''
            let list = await this.$get(this.$api.common.regionSelect + url, {}, false)
            return list
        },
        async change(e) {
            this.value = e.detail.value
            this.citys = await this.getlist({type: 2, code: this.regions[this.value[0]].code || -1})
            if (this.citys.length !== 0) {
                this.areas = await this.getlist({type: 3, code: this.citys[this.value[1]].code || -1})
            } else {
                this.citys = [{name: '台北市', code: -1}]
                this.areas = [{name: '其他区', code: -1}]
                this.value[1] = 0
                this.value[2] = 0
            }
            this.$nextTick(() => {
                this.provinceName = this.regions[this.value[0]].name
                this.cityName = this.citys[this.value[1]].name || ''
                this.districtName = this.areas[this.value[2]].name || ''
                this.provinceCode = this.regions[this.value[0]].code
                this.cityCode = this.citys[this.value[1]].code || 0
                this.districtCode = this.areas[this.value[2]].code || 0
            })
        },
        btnFix() {
            if (this.isSelectStatus) {
                return
            }
            let result = {}
            let provinceName = this.provinceName || ''
            let cityName = this.cityName || ''
            let districtName = this.districtName || ''
            let provinceCode = this.provinceCode || 0
            let cityCode = this.cityCode || 0
            let districtCode = this.districtCode || 0
            result = {
                provinceName,
                cityName,
                districtName,
                provinceCode,
                cityCode,
                districtCode,
                areaCode: `${provinceCode},${cityCode},${districtCode}`,
                resultName: `${provinceName}-${cityName}-${districtName}`
            }
            console.log(result)
            this.$emit('confirm', result)
            this.hide()
        }
    }
}
</script>

<style lang="scss" scoped>
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
        width: 250rpx;
        text-overflow:ellipsis;
        overflow:hidden;
        white-space:nowrap;
        &.font-size1 {
            font-size: 32rpx;
        }
        &.font-size2 {
            font-size: 28rpx;
        }
        &.font-size3 {
            font-size: 24rpx;
        }
        &.font-size4 {
            font-size: 20rpx;
        }
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
        color: rgba(23, 34, 45, 1);
        opacity: 1;
        position: absolute;
        right: 45rpx;
        top: 31rpx;
    }
</style>
