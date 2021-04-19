<template>
    <view class="sn-column content">
        <view class="line"></view>
        <view class="sn-row-center item-content border">
            <text>收货人</text>
            <input :placeholder-style="pholdStyle" @input="(e)=>inputChange('consignee',e)" :value="addParams.consignee" placeholder="请输入收货人姓名"/>
        </view>
        <view class="sn-row-center item-content border">
            <text>联系电话</text>
            <input type="number" maxlength="11" :placeholder-style="pholdStyle" :value="addParams.phone" @input="(e)=>inputChange('phone',e)" placeholder="请输入联系电话"/>
        </view>
        <view class="sn-row-center sn-row-between item-content border" @click="openPick">
            <view class="sn-row">
                <text>收货地址</text>
                <text :class="[addParams.province?'':'phold']">{{addParams.province? regionStr : '请选择收货地址'}}</text>
            </view>
            <uni-icons color="#888888" type="arrowright" size="24" />
        </view>
        <view class="sn-row-center item-content border dis">
            <text>详细地址</text>
            <input class="sn-row-center--cell-input" :placeholder-style="pholdStyle" :value="addParams.fullAddress" @input="(e)=>inputChange('fullAddress',e)" placeholder="请输入详细地址" />
            <view class="sn-row-center--cell-btn" v-if="addParams.fullAddress == ''" @click="getLocation">定位</view>
        </view>
        <view class="sn-row-between item-content">
            <text>是否默认</text>
            <switch color="#C11920"  @change="switchChange" />
        </view>
        <view class="add-view" @click="save">保存地址</view>
        <sn-regions-picker ref="picker" @confirm="confirmData"/>
    </view>
</template>

<script>
let QQMapWX = require('../../lib/qqmap-wx-jssdk');
export default {
    data(){
        return {
            pholdStyle: 'color:#888888;font-size:32rpx',
            addParams: {
                "area": "",
                "city": "",
                "cityCode": '',
                "districtCode": '',
                "provinceCode": '',
                "consignee": "",
                "fullAddress": "",
                "phone": "",
                "province": "",
                "isDefault": 1
            },
            regionStr: '',
            qqmapsdk: '',
        }
    },
    methods:{
        /**
         * 默认地址开关选中事件
         * */
        switchChange(e){
            this.addParams.isDefault = e.detail.value? 0:1
        },
        /**
         * 打开地址选择控件
         * */
        openPick(){
            this.$refs.picker.show()
        },
        /**
         * 选择地址后赋值操作
         * */
        confirmData(e){
            this.regionStr = e.resultName
            this.addParams.province = e.provinceName
            this.addParams.city = e.cityName
            this.addParams.area = e.districtName
            this.addParams.provinceCode  = e.provinceCode
            this.addParams.districtCode = e.districtCode
            this.addParams.cityCode = e.cityCode

        },
        /**
         * 文字输入监听
         * */
        inputChange(key,e){
            this.addParams[key] = e.detail.value
        },
        /**
         * 保存地址
         * */
        async save(){
            if(!this.addParams.consignee){
                this.$util.showToast('请输入收货人姓名')
                return
            }
            if(!this.addParams.phone){
                this.$util.showToast('请输入联系电话')
                return
            }
            if(!this.addParams.province){
                this.$util.showToast('请选择收货地址')
                return
            }
            if(!this.addParams.fullAddress){
                this.$util.showToast('请输入详细地址')
                return
            }
            let data = await this.$post(this.$api.person.addAddr, this.addParams)
            if(data){
                this.$util.showToast('保存成功')
                uni.navigateBack({
                    delta: 1
                })
            }
        },
    getLocation(){ // 实时定位
            let that = this
            that.qqmapsdk = new QQMapWX({
                key: 'DTNBZ-3PQHF-ADLJF-NPKWB-BAGN3-TFBUU'
            })
            uni.showLoading()
            uni.getLocation({
                type: 'gcj02',
                success: function (res) {
                    let loc = `${res.latitude}`+','+`${res.longitude}`
                    that.qqmapsdk.reverseGeocoder({
                        location: loc,
                        success: function(res) {
                            that.addParams.fullAddress = res.result.address
                            uni.hideLoading()
                        },
                        fail: function(err){
                            uni.hideLoading()
                        }
                    })
                }
            });
        },
    }
}
</script>

<style scoped lang="scss">
    .content{
        background-color: #fff;
    }
    .item-content{
        width: 690rpx;
        height: 128rpx;
        background: #FFFFFF;
        align-items: center;
        opacity: 1;
        margin-left: 30rpx;
        margin-right: 30rpx;
        .phold{
            color:#888888;
            font-size:32rpx;
            font-weight: 400;
            margin-left: 24rpx;
        }
        text{
            min-width: 128rpx;
            font-size: 32rpx;
            font-weight: 400;
            color: #222222;
            opacity: 1;
            margin-left: 24rpx;
        }
        input{
            color: #222222;
            font-size: 32rpx;
            font-weight: 400;
            margin-left: 24rpx;
        }
    }
    .line{
        width: 750rpx;
        height: 20rpx;
        background: #F5F5F7;
        opacity: 1;
    }
    .border{
        border-bottom: 1rpx solid #E2E2E2;
    }
    .add-view{
        position: fixed;
        left: 40rpx;
        bottom: 64rpx;
        width: 670rpx;
        height: 96rpx;
        background: linear-gradient(178deg, #EE2626 0%, #C11920 100%);
        opacity: 1;
        border-radius: 48rpx;
        font-size: 32rpx;
        font-weight: bold;
        line-height: 96rpx;
        text-align: center;
        color: #FFFFFF;
    }

    .dis{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .sn-row-center--cell-btn{
        width: 160rpx;
        height: 60rpx;
        line-height: 50rpx;
        margin-left: 4rpx;
        font-size: 12rpx;
        text-align: center;
        background: linear-gradient(178deg, #EE2626 0%, #C11920 100%);
        border-radius: 20rpx;
        color: #FFFFFF;
        font-size: 30rpx;
    }

    .sn-row-center--cell-input{
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
