<template>
    <view class="container">
        <uni-nav-bar left-icon="back" :gradual-change="true" title="资料信息"></uni-nav-bar>
        <view class="person-info">
            <image :src="wxUserInfo.avatarUrl" class="name-logo"></image>
            <view class="name-phone">
                <text class="name-text">{{ wxUserInfo.nickName ? wxUserInfo.nickName : '未知' }}</text>
                <text class="phone-text">联系电话:{{ phoneNumber ? phoneNumber : '未知' }}</text>
            </view>
            <!-- <image class="r-code-i" @click.stop="codeCheck" src="/static/images/person/qrcode.png"></image> -->
        </view>
        <view v-if="false" class="tip-view">
            <text>请填写真实信息，以便商家核实您的合作关系</text>
            <image src="/static/images/regist/close-tip.png" @click="closeTipClicked"></image>
        </view>
        <view class="costomer-type-view">
            <view class="sub-title"><text>请选择门店类型</text></view>
            <view class="type-view">
                <view
                    class="type-item"
                    v-for="(item, index) in typeList"
                    :key="index"
                    :class="{ isBorder: selectTypeIndex === index }"
                    :style="{ marginLeft: (index % 3 === 0 ? 0 : 26) + 'rpx' }"
                    @click="typeItemClicked(item, index)"
                >
                    <text :style="[{ color: selectTypeIndex === index ? '#C0191F' : '#888888' }]">{{ item.dictValue }}</text>
                    <image v-if="index === selectTypeIndex" class="recommend-image" src="/static/images/regist/ic_auth_top.png"></image>
                </view>
            </view>
            <view v-if="false" @click="openType" class="sn-row-center open-text">{{ isOpen ? '收起' : '展开' }}</view>
        </view>
        <view class="detail-address-view">
            <view class="detail-info">
                <text class="title-text">营业执照</text>
                <input
                    disabled
                    :placeholder-style="placeholderStyle"
                    :value="submitParams.customerCertificateNum"
                    placeholder="请输入营业执照"
                    @input="inputChange('customerCertificateNum', $event)"
                />
            </view>
            <view class="detail-info">
                <text class="title-text">门店名称</text>
                <input
                    disabled
                    :placeholder-style="placeholderStyle"
                    :value="submitParams.customerName"
                    placeholder="请输入门店名称"
                    @input="inputChange('customerName', $event)"
                />
            </view>
            <view class="detail-info">
                <text class="title-text">店主姓名</text>
                <input disabled :placeholder-style="placeholderStyle" :value="submitParams.contactName" placeholder="请输入店主姓名" @input="inputChange('contactName', $event)" />
            </view>

            <view class="detail-info">
                <text class="title-text">店主电话</text>
                <input
                    disabled
                    maxlength="11"
                    :placeholder-style="placeholderStyle"
                    :value="submitParams.contactPhone"
                    type="number"
                    placeholder="请输入店主电话"
                    @input="inputChange('contactPhone', $event)"
                />
            </view>

            <view class="detail-info">
                <text class="title-text">门店地址</text>
                <view class="choose-address">
                    <text :style="{ color: regionStr === '请选择' ? '#888888' : '#222222' }">{{ regionStr }}</text>
                    <image src="/static/images/home/arrow-right.png"></image>
                </view>
            </view>

            <view class="detail-info last">
                <text class="title-text">详细地址</text>
                <input disabled :placeholder-style="placeholderStyle" placeholder="请输入详细地址" :value="submitParams.address" @input="inputChange('address', $event)" />
            </view>
            <view class='detail-info'>
                <text class='title-text'>推荐人</text>
                <input disabled maxlength="11" :placeholder-style="placeholderStyle" :value="submitParams.inviter"  placeholder='请填写推荐人姓名'/>
            </view>
        </view>
        <view class="upload-photo-view">
            <view class="photo-item" @click="choosePhoto('customerCertificate')">
                <image v-if="!submitParams.customerCertificate" src="/static/images/regist/photo.png"></image>
                <text v-if="!submitParams.customerCertificate">门店营业执照</text>
                <image class="pic" v-if="submitParams.customerCertificate" :src="submitParams.customerCertificate"></image>
            </view>
            <view class="photo-item margin-size" @click="choosePhoto('customerPermit')">
                <image v-if="!submitParams.customerPermit" src="/static/images/regist/photo.png"></image>
                <text v-if="!submitParams.customerPermit">器械经营资质</text>
                <image class="pic" v-if="submitParams.customerPermit" :src="submitParams.customerPermit"></image>
            </view>
            <view class="photo-item margin-size" @click="choosePhoto('customerSecondCertificate')">
                <image v-if="!submitParams.customerSecondCertificate" src="/static/images/regist/photo.png"></image>
                <text v-if="!submitParams.customerSecondCertificate">二类器械经营凭证</text>
                <image class="pic" v-if="submitParams.customerSecondCertificate" :src="submitParams.customerSecondCertificate"></image>
            </view>
        </view>
        <view class="bottom-view"></view>
        <view v-if="false" class="submit-btn" @click="submitClicked">提交认证</view>
        <sn-regions-picker ref="picker" @confirm="confirmData" />
        <sn-popup ref="showtip">
            <view class="uni-image">
                <view class="showtip-title">邀请登录</view>
            	<image class="image" :src="qrCode" mode="scaleToFill" />
            	<view class="uni-image-close" @click="cancel('image')">
            		<uni-icons type="clear" color="#fff" size="30" />
            	</view>
            </view>
        </sn-popup>


    </view>

</template>

<script>
import UniNavBar from '@/components/uni-nav-bar/uni-nav-bar';
import snPopup from '@/components/sn-popup/uni-popup';
import { mapState } from 'vuex';
import SnRegionsPicker from '@/components/sn-regions-picker/sn-regions-picker';

export default {
    components: {
        SnRegionsPicker,
        UniNavBar,
        snPopup
    },

    data() {
        return {
            // 提示是否显示
            tipShow: true,
            // 客服类型
            typeList: [],
            typeListCopy: [],
            // 选中客服类型索引
            selectTypeIndex: 0,
            phoneNumber: this.$storage.get('phoneNumber'),
            placeholderStyle: 'color:#888888',
            regionStr: '请选择',
            isOpen: false,
            submitParams: {
                mchId: this.$storage.get('mchId'), //商户（经销商）ID
                openId: this.$storage.get('openId'), //微信openid
                isInner: this.$storage.get('isInner'),
                customerType: '1', //门店类型：1药店，2基层医疗，3二批商
                customerName: '', //门店名称
                customerPermit: '', //门店资质
                customerCertificateNum: '',
                customerCertificate: '', //营业执照
                customerSecondCertificate: '', //营业执照
                contactName: '', //联系人姓名
                contactPhone: '', //联系人手机
                contactSex: this.$storage.get('wxUserInfo').gender, //联系人性别
                contactAvatar: this.$storage.get('wxUserInfo').avatarUrl, //联系人头像
                contactMobile: this.$storage.get('phoneNumber'),
                contactNickname: this.$storage.get('wxUserInfo').nickName,
                province: '', //省
                city: '', //市
                region: '', //区
                address: '' //地址
            },
            qrCode: '' // 分享码
        };
    },
    computed: {
        ...mapState({
            wxUserInfo: state => state.common.wxUserInfo,
            loginUser: state => state.common.loginUser
        })
    },
    async onLoad() {
        await this.inviteCode();
        await this.getCustomType();
        await this.getApplyDetail();

    },
    methods: {
        /**
         * 邀请码
         * */
         async inviteCode() {
             let data = await this.$get(this.$api.common.inviteCode, {});
             if (data) {
                 // debugger
                 this.qrCode = data;
             }
         },
        /**
         * 获取客户类型
         * */
        async getCustomType() {
            let data = await this.$get(this.$api.common.dictionary, { code: 'customer_type' });
            if (data) {
                this.typeList = data;
            }
        },
        /**
         * 获取用户详情
         * */
        async getApplyDetail() {
            let data = await this.$get(this.$api.common.applyDetail, {});
            if (data) {
                let that = this;
                this.submitParams = data;
                this.regionStr = this.submitParams.province + '-' + this.submitParams.city + '-' + this.submitParams.region;
                this.typeList.forEach((e, i) => {
                    if (Number(e.dictKey) === Number(this.submitParams.customerType)) {
                        that.selectTypeIndex = i;
                    }
                });
                console.log(this.submitParams);
            }
        },
        /**
         * 展开收起
         * */
        openType() {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.typeListCopy = this.typeList;
            } else {
                this.typeListCopy = this.typeList.filter((e, i) => i < 3);
            }
            console.log(this.submitParams.customerType);
        },
        codeCheck() {
            this.$refs.showtip.open();
        },
        cancel() {
            this.$refs.showtip.close();
        },
        /**
         * 关闭提示
         * */
        closeTipClicked() {
            this.tipShow = false;
        },
        /**
         * 选择客户类型
         * */
        typeItemClicked(item, index) {
            return;
            this.selectTypeIndex = index;
            this.submitParams.customerType = item.dictKey;
            this.$forceUpdate();
            console.log(this.submitParams.customerType);
        },
        /**
         * 文本输入监听
         * */
        inputChange(key, e) {
            this.submitParams[key] = e.detail.value;
        },
        /**
         * 选择照片相册照片
         * */
        choosePhoto(key) {
            return;
            let that = this;
            uni.chooseImage({
                count: 1, //默认9
                sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album'], //从相册选择
                success: async function(res) {
                    that.submitParams[key] = await that.$util.uploadPic(res.tempFilePaths);
                    console.log(that.submitParams[key]);
                }
            });
        },
        /**
         * 地区选择
         * */
        confirmData(e) {
            console.log(e);
            this.regionStr = e.resultName;
            this.submitParams.province = e.provinceName;
            this.submitParams.city = e.cityName;
            this.submitParams.region = e.districtName;
        },
        /**
         * 打开选择地区控件
         * */
        openSelectRegion() {
            this.$refs.picker.show();
        },
        /**
         * 资料提交操作
         * */
        async submitClicked() {
            console.log(this.submitParams);
            if (!this.submitParams.customerCertificateNum) {
                this.$util.showToast('请输入营业执照');
                return;
            }
            if (!this.submitParams.customerName) {
                this.$util.showToast('请输入门店名称');
                return;
            }
            if (!this.submitParams.contactName) {
                this.$util.showToast('请输入店主姓名');
                return;
            }
            if (!this.submitParams.contactPhone) {
                this.$util.showToast('请输入店主电话');
                return;
            }
            if (!this.submitParams.province) {
                this.$util.showToast('请输入门店地址');
                return;
            }
            if (!this.submitParams.address) {
                this.$util.showToast('请输入详细地址');
                return;
            }
            if(!this.submitParams.customerCertificate){
                this.$util.showToast('请上传门店营业执照')
                return
            }if(!this.submitParams.inviter){
                this.$util.showToast('请填写推荐人')
                return
            }
            let data = await this.$post(this.$api.common.applySubmit, this.submitParams);
            if (data) {
                this.$util.showToast('提交成功');
                //0 申请中， 1已申请， 2，已拒绝， 3未申请
                this.$store.dispatch('common/SETAPPLYSTATUS', 0);
                uni.navigateBack({
                    delta: 1
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    background-color: #f7f8fa;
    .person-info {
        width: 686rpx;
        height: 200rpx;
        background: #ffffff;
        box-shadow: 0px 8rpx 16rpx rgba(226, 231, 242, 0.4);
        opacity: 1;
        border-radius: 12rpx;
        margin-top: 32rpx;
        margin-left: 32rpx;
        flex-direction: row;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .name-logo {
            height: 136rpx;
            width: 136rpx;
            border-radius: 50%;
            margin-left: 32rpx;
        }
        .name-phone {
            flex-direction: column;
            display: flex;
            margin-left: 24rpx;

            .name-text {
                font-size: 32rpx;
                font-weight: 800;
                line-height: 45rpx;
                color: #222222;
                opacity: 1;
            }
            .phone-text {
                margin-top: 8rpx;
                font-size: 32rpx;
                font-weight: 400;
                line-height: 45rpx;
                color: #888888;
                opacity: 1;
            }
        }
        .r-code-i {
            width: 48rpx;
            height: 48rpx;
            margin-left: 50rpx;
        }
    }

    .tip-view {
        width: 686rpx;
        height: 80rpx;
        background: rgba(192, 25, 31, 0.05);
        opacity: 1;
        border-radius: 10rpx;
        flex-direction: row;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: 32rpx;
        margin-top: 24rpx;

        text {
            margin-left: 32rpx;
            width: 520rpx;
            font-size: 26rpx;
            font-weight: bold;
            line-height: 48rpx;
            color: #c0191f;
        }
        image {
            width: 24rpx;
            height: 24rpx;
            margin-right: 32rpx;
        }
    }

    .costomer-type-view {
        margin-top: 24rpx;
        width: 686rpx;
        background: #ffffff;
        box-shadow: 0rpx 8rpx 16rpx rgba(226, 231, 242, 0.4);
        border-radius: 12rpx;
        margin-left: 32rpx;
        display: flex;
        flex-direction: column;

        .sub-title {
            margin-top: 27rpx;
            text {
                margin-left: 32rpx;
                font-size: 32rpx;
                font-weight: 800;
                color: #222222;
            }
        }

        .type-view {
            flex-direction: row;
            display: flex;
            margin-left: 32rpx;
            flex-wrap: wrap;
            margin-bottom: 10rpx;
            .type-item {
                margin-top: 10rpx;
                margin-bottom: 10rpx;
                width: 190rpx;
                height: 64rpx;
                flex-direction: column;
                display: flex;
                background: #f5f5f5;
                border-radius: 10rpx;
                justify-content: center;
                align-items: center;
                position: relative;
                border: 1px solid #f5f5f5;
                &.isBorder {
                    border: 1px solid #c0191f;
                }
                .recommend-image {
                    position: absolute;
                    right: -1rpx;
                    top: -1rpx;
                    width: 40rpx;
                    height: 40rpx;
                }
                image {
                    width: 64rpx;
                    height: 64rpx;
                }
                text {
                    height: 64rpx;
                    font-size: 28rpx;
                    font-weight: 400;
                    line-height: 64rpx;
                    text-align: center;
                }
            }
        }
    }

    .detail-address-view {
        margin-top: 24rpx;
        width: 686rpx;
        background: #ffffff;
        box-shadow: 0rpx 8rpx 16rpx rgba(226, 231, 242, 0.4);
        border-radius: 12rpx;
        margin-left: 32rpx;
        display: flex;
        flex-direction: column;

        .detail-info {
            flex-direction: row;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-left: 32rpx;
            margin-right: 32rpx;
            margin-top: 40rpx;

            .title-text {
                font-size: 30rpx;
                font-weight: 400;
                line-height: 42rpx;
                color: #888888;
            }

            .choose-address {
                flex-direction: row;
                display: flex;
                justify-content: center;
                align-items: center;
                image {
                    margin-left: 16rpx;
                    width: 12rpx;
                    height: 22rpx;
                }
                text {
                    font-size: 30rpx;
                    font-weight: 400;
                    line-height: 42rpx;
                    text-align: right;
                    color: #222222;
                    max-width: 452rpx;
                }
            }

            input {
                max-width: 452rpx;
                font-size: 30rpx;
                font-weight: 400;
                line-height: 42rpx;
                text-align: right;
                color: #222222;
            }
        }
        .last {
            margin-bottom: 40rpx;
        }
    }
    .bottom-view {
        width: 750rpx;
        height: 176rpx;
    }
    .upload-photo-view {
        width: 686rpx;
        height: 280rpx;
        //height: 420rpx;
        background: #ffffff;
        box-shadow: 0rpx 8rpx 16rpx rgba(226, 231, 242, 0.4);
        border-radius: 12rpx;
        margin-left: 32rpx;
        margin-top: 24rpx;
        flex-direction: row;
        display: flex;
        justify-content: center;
        align-items: center;
        .margin-size {
            margin-left: 20rpx;
        }
        .photo-item {
            background-color: #f5f5f5;
            flex-direction: column;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 200rpx;
            height: 154rpx;
            border: 1px dashed #cccccc;
            opacity: 1;
            border-radius: 10rpx;
            .pic {
                border-radius: 10rpx;
                width: 200rpx;
                height: 154rpx;
            }
            image {
                width: 80rpx;
                height: 60rpx;
            }

            text {
                font-size: 22rpx;
                font-weight: 400;
                line-height: 40rpx;
                color: #888888;
                margin-top: 12rpx;
            }
        }
    }

    .submit-btn {
        position: fixed;
        left: 40rpx;
        right: 40rpx;
        bottom: 40rpx;
        height: 96rpx;
        background: linear-gradient(132deg, #c11920 0%, #ee2626 100%);
        opacity: 1;
        width: 89.3%;
        border-radius: 48px;
        text-align: center;
        color: #ffffff;
        font-size: 32rpx;
        font-weight: bold;
        line-height: 96rpx;
    }
}
.open-text {
    width: 686rpx;
    padding-top: 10rpx;
    padding-bottom: 10rpx;
    justify-content: center;
    font-size: 28rpx;
    color: #888;
}

/* 插屏广告 */
	.uni-image {
		position: relative;

	}

.showtip-title {
    width: 400rpx;
    text-align: center;
    margin: 0 auto;
    color: #FFFFFF;
    margin-top: 380rpx;
    font-size: 36rpx;
}
	.image {
		width: 400rpx;
		height: 400rpx;
        display: block;
        margin: 0 auto;
        margin-top: 20rpx;
        // margin-top: 400rpx;
        // position: absolute;
        // left: 50%;
        // top: 50%;
        // transform: translate(-50%,-50%);
	}

	.uni-image-close {
		margin-top: 20rpx;
		text-align: center;
	}
</style>
