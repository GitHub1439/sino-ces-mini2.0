<template>
    <view>
        <view id='scale-wrapper' class='wrapper' :class="[statusbg]" style='background: #F5F5F5;'>
            <view class='zz' :style="{height:h/2 + 'px','border': '1px #52b8f5 solid'}"></view>
            <scroll-view class='scroll-view' scroll-x="true" :scroll-left="centerNum" scroll-with-animation='true' @scroll="bindscroll">
                <view id='canvas' class='scroll-wrapper'>
                    <view class='seat' :style="{width: windowWidth/2- fiexNum/2 +'px'}"></view>
                    <view class="scale-image" :style="{width: width +'px', 'height': h +'px'}">
                        <image :src='rulerImg' mode=''></image>
                    </view>
                    <view class='seat' :style="{'width': windowWidth/2-fiexNum/2 +'px'}"></view>
                </view>
            </scroll-view>
            <!-- <view class="loading-wrap" v-if="visible">
                <view class="mask"></view>
                <view class="body">
                    <sn-loadmore class="loading" :visible="visible"></sn-loadmore>
                </view>
            </view> -->
        </view>
        <view class='canvas' :style="{width: width+ 'px'}">
            <canvas class='canvas' :style="{width: width+ 'px'}" canvas-id="canvas"></canvas>
        </view>
    </view>
</template>

<script>
/* 尺子组件 */
import {debounce} from '@/utils/util'
export default {
    components: {
    },
    props: {
        // 最小值
        min: {
            type: Number,
            default: 0
        },
        // 最大值
        max: {
            type: Number,
            default: 100
        },
        // 是否开启整数模式
        int: {
            type: Boolean,
            default: true
        },
        // 每个格子的长度（只能是 1 ，2 ，5 一个能被10整除的数字 ）
        step: {
            type: Number,
            default: 1
        },
        // 每个格子的实际行度 （单位px ，相对默认值）
        single: {
            type: Number,
            default: 10
        },
        // 卡尺左右的余量 ，最为60
        fiexNum: {
            type: Number,
            default: 60
        },
        // 高度
        h: {
            type: Number,
            default: 80
        },
        styles: {
            type: Object,
            default: () => {
                return {
                    line: '#dbdbdb',
                    bginner: '#fbfbfb',
                    bgoutside: '#f5f5f5',
                    lineSelect: '#6088FD',
                    font: '#404040'
                }
            }
        }
    },
    data() {
        return {
            // visible: true,
            width: 0,
            rule: {
                spa: '', // 单个格子的距离
                unitNum: '', // 格子总数
                minNum: '', // 最小值
                maxNum: '', // 最小值
                num: '', // 仿数据总数
                FIXED_NUM: '', // 标尺左右空余部分
                single: '', // 每个格子的实际行度 （单位px ，相对默认值）
                step: '', // 每个格子的长度（只能是 1 ，2 ，5 一个能被10整除的数字 ）
                h: '',
                active: 0,
                styles: ''
            },
            windowWidth: 0,
            centerNum: 0,
            rulerImg: '',
            timer: null
        }
    },
    computed: {
        statusbg() {
            let value = Number(this.rule.active)
            if (value === 0) {
                return ''
            } else if (value > 0 && value <= 6.5) {
                return 'low'
            } else if (value > 6.5 && value <= 12) {
                return 'normal'
            }
            return 'high'

        }
    },
    onReady() {
        this.rule = {
            spa: '', // 单个格子的距离
            unitNum: '', // 格子总数
            minNum: this.min, // 最小值
            maxNum: this.max, // 最小值
            num: this.max - this.min, // 仿数据总数
            FIXED_NUM: this.fiexNum, // 标尺左右空余部分
            single: this.single, // 每个格子的实际行度 （单位px ，相对默认值）
            step: this.step, // 每个格子的长度（只能是 1 ，2 ，5 一个能被10整除的数字 ）
            h: this.h,
            active: 0,
            styles: this.styles
        }
        this.init().then(() => {
            uni.$on('watch', (e) => {
                let rule = this.rule
                let value = e < rule.minNum ? rule.minNum : (e > rule.maxNum ? rule.maxNum : e)
                rule.active = value
                let centerNum = this.assignValue(this, rule)
                this.centerNum = centerNum
            })
        })
    },
    methods: {
        init() {
            return new Promise((resolve) => {
                let rule = this.rule
                //  获取节点信息，获取节点宽度
                const query = uni.createSelectorQuery().in(this)
                query.select('#scale-wrapper').boundingClientRect((res) => {
                    res.top // 这个组件内 #the-id 节点的上边界坐标
                }).exec((e) => {
                    // 判断是否使用整数类型
                    if (this.int) {
                        rule.unitNum = rule.num / rule.step
                    } else {
                        rule.unitNum = rule.num * (rule.single / rule.step)
                    }
                    // 设置单个格子的长度
                    rule.spa = rule.single * rule.step
                    rule.total = rule.spa * rule.unitNum + rule.FIXED_NUM

                    this.windowWidth = e[0].width
                    this.width = rule.total
                    this.fiexNum = rule.FIXED_NUM
                    this.draw().then(() => {
                        resolve()
                    })
                })
            })
        },
        draw() {
            return new Promise((resolve) => {
                let rule = this.rule
                // 判断是否使用整数类型
                if (this.int) {
                    rule.unitNum = rule.num / rule.step
                } else {
                    rule.unitNum = rule.num * (rule.single / rule.step)
                }
                // 设置单个格子的长度
                rule.spa = rule.single * rule.step
                rule.total = rule.spa * rule.unitNum + rule.FIXED_NUM
                let canvasHeight = 80
                let ctx = uni.createCanvasContext('canvas', this)
                //  绘制背景
                ctx.save()
                ctx.setFillStyle(rule.styles.bginner)
                ctx.fillRect(0, 0, rule.total, canvasHeight)
                ctx.restore()
                ctx.beginPath()
                ctx.setLineWidth(1)
                ctx.setStrokeStyle(rule.styles.line)
                ctx.moveTo(rule.FIXED_NUM / 2, 0)
                ctx.lineTo(rule.total - rule.FIXED_NUM / 2, 0)
                ctx.stroke()
                for (let i = 0; i < rule.unitNum + 1; i++) {
                    // 绘制文字
                    if (i % (rule.single / rule.step) === 0) {
                        ctx.setFontSize(18)
                        ctx.setFillStyle(rule.styles.font)
                        ctx.setTextAlign('center')
                        if (this.int) {
                            ctx.fillText(i * rule.step + rule.minNum, rule.FIXED_NUM / 2 + (i * rule.spa), canvasHeight - 15)
                        } else {
                            ctx.fillText(i / (rule.single / rule.step) + rule.minNum, rule.FIXED_NUM / 2 + (i * rule.spa), canvasHeight - 15)
                        }
                    }

                    // 绘制刻度
                    if (i % 5 === 0) {
                        ctx.beginPath()
                        ctx.setLineWidth(2)
                        ctx.setStrokeStyle(rule.styles.line)
                        ctx.moveTo(rule.FIXED_NUM / 2 + (i * rule.spa), 0)
                        ctx.lineTo(rule.FIXED_NUM / 2 + (i * rule.spa), canvasHeight / 2)
                        ctx.stroke()
                    } else {
                        ctx.beginPath()
                        ctx.setLineWidth(1)
                        ctx.setStrokeStyle(rule.styles.line)
                        ctx.moveTo(rule.FIXED_NUM / 2 + (i * rule.spa), 0)
                        ctx.lineTo(rule.FIXED_NUM / 2 + (i * rule.spa), canvasHeight - 50)
                        ctx.stroke()
                    }
                }
                this.canvasToimgURL(ctx, canvasHeight).then(() => {
                    resolve()
                })
            })
        },
        canvasToimgURL(ctx, canvasHeight) {
            let rule = this.rule
            return new Promise((resolve, reject) => {
                ctx.draw(false, setTimeout(() => {
                    uni.canvasToTempFilePath({
                        x: 2,
                        y: 0,
                        width: rule.total,
                        height: canvasHeight,
                        canvasId: 'canvas',
                        success: (res) => {
                            // 改变高度重新计算
                            rule.total = rule.total / 80 * rule.h
                            rule.FIXED_NUM = rule.FIXED_NUM / 80 * rule.h
                            let centerNum = this.assignValue()
                            this.rulerImg = res.tempFilePath
                            this.centerNum = centerNum
                            let resultNum = this.int ? rule.minNum : rule.minNum.toFixed(1)
                            this.$emit('value', resultNum)
                            resolve()
                        },
                        fail(e) {
                            console.log(e)
                            reject(e)
                        }
                    }, this)
                }, 500))
            })
        },
        assignValue() {
            let rule = this.rule
            return this.int ?
                ((rule.active - rule.minNum) / rule.step) *
                    parseInt(rule.total - rule.FIXED_NUM) / rule.num * rule.step :
                ((rule.active - rule.minNum) * 10 / rule.step) *
                    parseFloat((rule.total - rule.FIXED_NUM)) / rule.num / (rule.single / rule.step)
        },
        bindscroll(e) {
            let rule = this.rule
            // 移动距离
            let left = e.detail.scrollLeft
            // 单格的实际距离
            let spa
            // 判断是否是整数
            if (this.int) {
                spa = parseInt(rule.total - rule.FIXED_NUM) / rule.num * rule.step
            } else {
                spa = parseFloat(rule.total - rule.FIXED_NUM) / rule.num / (rule.single / rule.step)
            }
            // 当前显示值
            let resultNum = Math.round(left / spa)
            // 还原为实际数值
            let redNum = Math.round(resultNum * spa)
            // 小数位处理
            resultNum = this.int ? resultNum * rule.step + rule.minNum : ((resultNum * rule.step) / 10 + rule.minNum).toFixed(1)

            if (resultNum < rule.minNum || resultNum > rule.maxNum) {
                return
            }
            rule.active = resultNum
            this.$emit('value', resultNum)

            /* throttle(() => {
                    console.log(resultNum, rule.minNum, rule.maxNum)
                    this.centerNum = redNum;
                    this.$emit('value', resultNum)
                }, 50) */
            debounce(() => {
                this.centerNum = redNum
                rule.active = resultNum
                this.$emit('value', resultNum)
            })
        }
    }
}
</script>

<style scoped lang="scss">
    .wrapper {
        position: relative;
        width: 100%;
        box-sizing: border-box;
        background: #dbdbdb;
        border: 4upx solid transparent;
        box-shadow: 0 0 10upx transparent;
        &.high {
            outline: 4upx solid #FF6F78;
            /* box-shadow: 0 0 10upx #FF6F78; */
        }
        &.low {
            outline: 4upx solid #FACC14;
            /* box-shadow: 0 0 10upx #FACC14; */
        }
        &.normal {
            outline: 4upx solid #2fc25b;
            /* box-shadow: 0 0 10upx #2fc25b; */
        }
        .loading-wrap {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            z-index: 1119;
            .mask {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                right: 0;
                bottom: 0;
                top: 0;
                background-color: rgba(255,255,255,1);
                z-index: 1119;
            }
            .body {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                z-index: 1200;
                width: 100%;
            }
        }
    }

    .zz {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        width: 0px;
        /* height: 40px; */
        margin: auto;
        border: 1px #52b8f5 solid;
        z-index: 999;
    }

    .scroll-wrapper {
        display: flex;
    }

    .scale-image {
        flex-shrink: 0;
        height: 70px;
        box-sizing: border-box;
        overflow: hidden;
    }

    .scale-image image {
        width: 100%;
        height: 100%;
    }

    .seat {
        flex-shrink: 0;
        box-sizing: border-box;
    }

    .canvas {
        position: absolute;
        overflow: hidden;
        box-sizing: border-box;
        top: -100%;
        left: 0;
        z-index: -1;
    }
</style>
