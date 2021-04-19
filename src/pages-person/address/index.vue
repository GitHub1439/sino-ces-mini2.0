<template>
    <view class="sn-column" style="margin-bottom: 180rpx">
        <view v-if="addrs.length !== 0"  class="sn-column" v-for="(item,index) in addrs" :key="item.id" >
            <u-swipe-action
                bg-color="#fff"
                @open="open"
                :disabled="disabled"
                :index="getIndex(item)"
                :key="item.id"
                :show="item.show"
                @click="click"
                :btn-width="btnWidth"
                @close="close"
                :options="options"
            >
                <view class="sn-column item-view" @click='itemClicked(item,index)'>
                    <view class="sn-row-between">
                        <view class="sn-row-center">
                            <text class="name">{{item.consignee? item.consignee: '未知'}}</text>
                            <text class="phone">{{item.phone}}</text>
                        </view>
                        <view v-if="index === 0" class="default">默认</view>
                    </view>
                    <view class="sn-row-between addr-content">
                        <view class="addr"><text>{{item.province + item.city + item.area + item.fullAddress}}</text></view>
                        <image @click.stop="edit(item)" class="edit-image" src="/static/images/person/icon_bj.png"></image>
                    </view>
                </view>
            </u-swipe-action>
            <view class="line-view" v-if="index===0"></view>
        </view>
        <sn-nodata v-if="addrs.length ===0 " title="暂无收货地址"></sn-nodata>
        <view @click="goAdd" class="add-btn">新增地址</view>
    </view>
</template>

<script>
export default {
    name: 'index',
    components: {},
    data(){
        return {
            addrs: [],
            size: 100000,
            current: 1,
            options: [
                {
                    text: '删除',
                    style: {
                        backgroundColor: '#dd524d'
                    }
                }
            ],
            openIndex: 0,
            disabled: false,
            btnWidth: 200,
            isSelect: false,
            selectId: '',
            isChooseAddress: false,
        }
    },
    onPullDownRefresh(){
        setTimeout(()=>{
            this.current = 1
            this.getAddrList()
            uni.stopPullDownRefresh()
        },500)
    },
    computed:{
        getIndex(){
            return (item)=>{
                let {addrs} = this
                return addrs.indexOf(item)
            }
        }
    },
    onShow(){
        this.getAddrList()
    },
    onLoad (parms) {
        this.isChooseAddress = parms.isChooseAddress;
    },
    methods:{
        /**
         * 滑动删除删除操作
         * */
        click(index, index1) {
            let ids = this.addrs[index].id
            this.close(index)
            if (index1 === 0) {
                uni.showModal({
                    title: '温馨提示',
                    content: '您确定删除此地址吗?',
                    complete: async (t) => {
                        if (t.confirm) {
                            await this.$post(this.$api.person.removeAddr+'?ids='+ids, {})
                            this.addrs.splice(index, 1)
                            this.$util.showToast('删除成功')
                            this.$forceUpdate()
                        }
                    }
                })
            }
        },
        /**
         * 滑动删除关闭方法
         * */
        close(index) {
            this.addrs[index].show = false
            this.$forceUpdate()
        },
        /**
         * 滑动删除打开方法
         * */
        open(index) {
            this.addrs[index].show = true
            this.addrs.map((val, idx) => {
                if (index !== idx) this.addrs[idx].show = false
                this.$forceUpdate()
            })
        },
        /**
         * 获取收货地址
         * */
        async getAddrList(){
            let param = {
                size: this.size,
                current: this.current
            }
            let data = await this.$get(this.$api.person.addrList,param)
            if(data){
                this.addrs = data.records
                if(this.addrs.length>1){
                    let isIndex = 0
                    this.addrs.forEach((e,i)=>{
                        if(Number(e.isDefault) ===0){
                            isIndex = i
                        }
                    })
                    this.addrs[0] = this.addrs.splice(isIndex, 1, this.addrs[0])[0];
                    this.$forceUpdate()
                }
            }
        },
        /**
         * 编辑地址跳转
         * **/
        edit(e){
            uni.navigateTo({
                url: `/pages-person/address/edit?id=${e.id}`
            })
        },
        /**
         * 新增地址跳转
         * */
        goAdd(){
            uni.navigateTo({
                url: '/pages-person/address/add'
            })
        },
        bindClick(e){
            console.log(e)
        },
        swipeChange(e,index){
            console.log(e)
        },
        itemClicked (item,index) {
            if (!this.isChooseAddress) {
                return
            }
            uni.navigateBack({
                delta: 1,
            });
            uni.$emit('updateAddress',item);
        }
    }
}
</script>

<style scoped lang="scss">
    .add-btn{
        position: fixed;
        bottom: 64rpx;
        left: 40rpx;
        width: 670rpx;
        height: 96rpx;
        background: linear-gradient(178deg, #EE2626 0%, #C11920 100%);
        opacity: 1;
        border-radius: 48rpx;
        font-size: 32rpx;
        font-weight: bold;
        line-height: 96rpx;
        color: #FFFFFF;
        text-align: center;
    }
    .line-view{
        width: 750rpx;
        height: 20rpx;
        background-color: #F5F6F8;
    }
    .mgb{
        margin-bottom: 180rpx;
    }
    .item-view{
        width: 750rpx;
        background-color: #fff;
        padding-left: 30rpx;
        padding-right: 30rpx;
        padding-bottom: 28rpx;
        padding-top: 28rpx;

        .name{
            font-size: 32rpx;
            font-weight: bold;
            color: #222222;
        }
        .phone{
            font-size: 28rpx;
            font-weight: bold;
            color: #222222;
            margin-left: 12rpx;
        }
        .default{
            width: 56rpx;
            height: 32rpx;
            background: linear-gradient(42deg, #FF5734 0%, #FF3636 100%);
            opacity: 1;
            border-radius: 4rpx;
            font-size: 22rpx;
            font-weight: 400;
            line-height: 32rpx;
            color: #FFFFFF;
            text-align: center;
        }
        .addr{
            width: 592rpx;
            height: 80rpx;
            margin-top: 12rpx;
            font-size: 28rpx;
            font-weight: 400;
            color: #888888;
            opacity: 1;
            justify-content: center;
            text{
                width: 592rpx;
                height: 80rpx;
                font-size: 28rpx;
                font-weight: 400;
                color: #888888;
                text-overflow: -o-ellipsis-lastline;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
            }
        }
        .addr-content{
            margin-top: 11rpx;
            align-items: center;
        }
        .edit-image{
            width: 48rpx;
            height: 48rpx;
        }
    }
</style>
