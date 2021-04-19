<template>
    <view class="bank-item" :style="bankThem">
        <view class="copy-view" @click="copyClicked()">
            <text>点击复制</text>
            <image src="/static/images/cart/copy.png"></image>
        </view>

        <!-- #ifndef MP-WEIXIN -->
        <canvas v-if="showCanvas" class="bank-icon" :id="uuid" :canvas-id="uuid" />
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <canvas v-if="showCanvas" class="bank-icon" id="bankIcon" canvas-id="bankIcon" />
        <!-- #endif -->
        <view class="bank-head">
            <image :src="image"></image>
            <view class="bank-info">
                <text class="bank-name">{{itemData.bank}}</text>
                <text class="card-type">{{itemData.billType < 1 ? "收款人名:" : "收款方:"}}{{itemData.bankName}}</text>
            </view>

        </view>
        <view class="card-code">
            <text class="omit">{{itemData.bankAccount}}</text>
           <!-- <text class="omit">****</text>
            <text class="omit">****</text> -->
            <!-- <text>{{endNumber}}</text> -->
        </view>
        <view class="bank-watermark" :style="waterMark" />
    </view>
</template>

<script>
    export default {
        name: 'bankItem',
        props: {
            itemData: {
                type: Object,
                default: {}
            },
            bankCode: {
                type: String,
                required: true
            },
            // bankName: {
            //     type: String,
            //     required: true
            // },
            // cardType: {
            //     type: String,
            //     default: '储蓄卡'
            // },
            // userName: {
            //     type: String,
            //     default: '张三'
            // },
            // cardCode: {
            //     type: String,
            //     required: true
            // }
        },
        computed: {
            waterMark() {
                return `background-image: url(${this.image});`
            },
            endNumber() {
                let length = this.itemData.bankAccount.length;
                return this.itemData.bankAccount.substr(length - 4, length);
            }
        },
        data() {
            // #ifndef MP-WEIXIN
            const buildUuid = () => {
                return 'bank_' + parseInt(Math.random() * 100000000);
            };
            // #endif
            return {
                bankThem: '',
                image: '',
                showCanvas: true,
                // #ifdef MP-WEIXIN
                uuid: 'bankIcon',
                // #endif
                // #ifndef MP-WEIXIN
                uuid: buildUuid()
                // #endif
            };
        },
        methods: {
            /// 点击复制
            copyClicked() {
                let that = this;
                uni.setClipboardData({
                    data: that.itemData.bank + " " + that.itemData.bankAccount + " " + that.itemData.bankName,
                    success: function(res) {
                        uni.hideToast();
                        uni.getClipboardData({
                            success: function(res) {
                                uni.showToast({
                                    title: "已复制到剪贴板",
                                    icon: "none"
                                });
                            }
                        });
                    }
                });
            },
            async buildItem() {
                // this.bankThem = uni.getStorageSync(`BANK_${this.bankCode}`);
                // this.image = await this.getBankLogo();
                this.image = 'http://snjhyy.oss-cn-hangzhou.aliyuncs.com/upload/20210318/10ded0f178ee853041e7364f6a0ce8f5.png';
               // await this.getThemColor();
                this.showCanvas = false;
            },
            async getThemColor() {
                // if (this.bankThem != null && this.bankThem != '') return;
                let bgSize = uni.upx2px(100);
                let iconSize = uni.upx2px(72);
                this.iconContext = uni.createCanvasContext(this.uuid, this);
                this.iconContext.width = bgSize;
                this.iconContext.height = bgSize;
                this.iconContext.fillStyle = '#FFFFFF';
                this.iconContext.beginPath();
                let bgRadio = bgSize / 2;
                this.iconContext.arc(bgRadio, bgRadio, bgRadio - 1, 0, 2 * Math.PI, 0, true);
                this.iconContext.closePath();
                this.iconContext.fill();
                let iconRadio = bgSize / 2 - iconSize / 2;
                this.iconContext.drawImage(this.image, iconRadio, iconRadio, iconSize, iconSize);
                await this.draw(this.iconContext);
                let imageData = await this.getImageData(iconRadio, iconSize);
                this.parsingImageData(imageData);
            },
            parsingImageData(imageData) {
                let statistics = {};
                for (let i = 0, length = imageData.length; i < length; i += 4) {
                    let r = imageData[i];
                    let g = imageData[i + 1];
                    let b = imageData[i + 2];
                    if ((r + g + b) < 400) {
                        let rgb = [r, g, b];
                        let key = rgb.join(', ');
                        statistics[key] = statistics[key] == null ? 1 : statistics[key] + 1;
                    }
                }
                let maxKey = '';
                Object.keys(statistics).forEach(key => {
                    if (maxKey === '') {
                        maxKey = key;
                    } else {
                        maxKey = statistics[maxKey] > statistics[key] ? maxKey : key;
                    }
                });
                let beginColor = maxKey.split(', ').map((item, index) => {
                    item = parseInt(item);
                    if (index > 1) return item;
                    let newColor = item + 50;
                    return newColor > 255 ? 255 : newColor;
                }).join(', ');
                // this.bankThem = `background-image: linear-gradient(45deg, rgba(${beginColor}, 1), rgba(${maxKey}, 1));`;
                // uni.setStorageSync(`BANK_${this.bankCode}`, this.bankThem);
            },
            getImageData(radio, size) {
                return new Promise((resolve, reject) => {
                    uni.canvasGetImageData({
                            canvasId: this.uuid,
                            x: radio,
                            y: radio,
                            width: size,
                            height: size,
                            success(res) {
                                resolve(res.data);
                            },
                            fail(err) {
                                console.log(err);
                                reject();
                            }
                        },
                        this
                    );
                });
            },
            getBankLogo() {
                return new Promise((resolve, reject) => {
                    uni.downloadFile({
                        // url: `https://banklogo.yfb.now.sh/resource/logo/${this.bankCode}.png`,
                        url: `https://img-blog.csdnimg.cn/20210318095212492.png`,
                        success(res) {
                            // resolve(res.tempFilePath);
                        },
                        fail(err) {
                            console.log(err);
                            reject();
                        }
                    });
                });
            },
            draw(context, reserve = false) {
                return new Promise((resolve) => {
                    context.draw(reserve, () => {
                        resolve();
                    });
                });
            }
        },
        created() {
            this.$nextTick(() => {
                this.buildItem();
            });
        }
    };
</script>

<style lang="scss" scoped>
    .omit {
        font-size: 48rpx;
        margin-right: 30rpx;
    }

    .card-code {
        margin-top: 15rpx;
        display: flex;
        justify-content: flex-end;
        color: #FFFFFF;
        font-size: 38rpx;

    }

    .flex-1 {
        flex: 1;
    }

    .card-type {
        font-size: 24rpx;
        color: #F1F1F1;
        margin-top: 8px;
    }

    .bank-name {
        font-size: 32rpx;
        color: #FFFFFF;
    }

    .bank-info {
        display: flex;
        flex-direction: column;
        margin-left: 30rpx;
    }

    .bank-head {
        display: flex;
        flex: 1;
        align-items: center;
    }

    .bank-head image {
        width: 100rpx;
        height: 100rpx;
        padding: 15rpx;
        // background-color: #FFFFFF;
        border-radius: 50%;
        overflow: hidden;
    }

    .bank-icon {
        position: absolute;
        top: 20rpx;
        left: 20rpx;
        width: 100rpx;
        height: 100rpx;
    }

    .bank-watermark {
        position: absolute;
        right: -184rpx;
        bottom: 0rpx;
        width: 144rpx;
        height: 90rpx;
        background-repeat: no-repeat;
        filter: drop-shadow(-204rpx 0rpx 0rpx #fff);
        opacity: 0.1;
    }

    .bank-item {
        position: relative;
        flex: 1;
        height: 280rpx;
        margin-top: 20rpx;
        position: relative;
        border-radius: 20rpx;
        padding: 20rpx;
        background: linear-gradient(343deg, #C4282F 0%, #EF3E3D 100%);
    }

    .bank-item:after {
        content: "";
        display: block;
        background: inherit;
        filter: blur(10rpx);
        position: absolute;
        width: 100%;
        height: 100%;
        top: 10rpx;
        left: 10rpx;
        z-index: -1;
        opacity: 0.4;
        transform-origin: 0 0;
        border-radius: inherit;
        transform: scale(1, 1);
    }

    .copy-view {
        flex-direction: row;
        display: flex;
        position: absolute;
        right: 30rpx;
        top: 20rpx;

        text {
            font-size: 26rpx;
            font-weight: 400;
            color: #fff;
        }

        image {
            margin-left: 10rpx;
            width: 32rpx;
            height: 32rpx;
        }
    }
</style>
