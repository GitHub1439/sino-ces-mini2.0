<template>
    <view style="margin: 16px 0 10px 16px;font-size: 24rpx;" v-if="allBrand.length>0">
        <view class="brand">
            <view class="common-button" v-for="(item,index) in allBrand"
                :class="{'select-button':index == selectBrandIndex }" @click="clickActive(index)">
                {{item.name}}
            </view>
        </view>
       <!-- <view><text class="common-button select-button" :class="[specsList.length<=1?'disable-button':'']"
                @click="chooseSpecsClicked">选型号</text></view> -->
        <sn-popup ref="popup" :mask-click='false' type='bottom'>
            <view class="filter-content">
                <view>
                    <view class="filter-content-title">
                        <text>选择型号</text>
                    </view>
                    <view class="filter-content-detail">
                        <text v-for="(item,index) in specsList" :key="index" class='filter-content-detail-item-default'
                            :style="{'background-color':item.isSelected?'#EF3E3D':'#FFFFFF','color':item.isSelected?'#FFFFFF':'#EF3E3D'}"
                            @tap="itemTap(index)">
                            {{item.productModel}}
                        </text>
                    </view>
                    <view class="filter-content-footer">
                        <view class="filter-content-footer-item" style="color: #777777; background-color: #FFFFFF;"
                            @tap="this.$refs.popup.close();">
                            <text>关闭</text>
                        </view>
                        <view class="filter-content-footer-item"
                            :style="{'color': '#FFFFFF', 'background-color': '#EF3E3D'}" @tap="sureClick">
                            <text>确认</text>
                        </view>
                    </view>
                </view>
            </view>

        </sn-popup>

    </view>
</template>

<script>
    import snPopup from "@/components/sn-popup/uni-popup";
    export default {
        name: "sn-goods-filter",
        components: {
            snPopup
        },
        props: {
            allBrand: {
                type: Array,
                default: []
            },
            specsList: {
                type: Array,
                default: [{
                    productModel: '不限',
                    id: '',
                    isSelected: true
                }]
            },

        },
        data() {
            return {
                //specsListLength: 0, // 型号数量
                // specsList: [],
                selectBrandIndex: 0 //初始化第一个高亮

            };
        },
        methods: {
            // 确定规格
            sureClick() {
                let selectSpecs = this.specsList.filter(item => item.isSelected == true);
                console.log('selectSpecs', selectSpecs);
                this.$emit('sureSpecifi', selectSpecs);
                this.$refs.popup.close();

            },
            // 选中规格
            itemTap(index) {
                console.log('index', index);
                console.log('this.specsList0', this.specsList);
                this.$emit('updateSpecs',index);
                // this.getSpecsList();
                //if (index != 0) {
                // this.specsList[0].isSelected = false
                // this.specsList[index].isSelected = !this.specsList[index].isSelected;

                // this.$set(this.specsList[index], 'isSelected', !this.specsList[index].isSelected);

                console.log('this.specsList1', this.specsList);
                // for (let i = 0; i < this.specsList.length; i++) {
                //     if (index == i) {
                //         this.specsList[i].isSelected = true
                //     } else {
                //         this.specsList[i].isSelected = false
                //     }
                // }
                // let tempSpecsList = [...this.specsList];
                // tempSpecsList.splice(0, 1);
                // // 如果都是选中只选中不限即可
                // let havaNoSelect = [...tempSpecsList].find(v => {
                //     return v.isSelected === false;
                // });
                // if (!havaNoSelect) {
                //     this.getSpecsList();
                // }
                //}
            },
            //查询型号List
            // async getSpecsList() {
            //     let that = this;
            //     let data = await this.$get(this.$api.home.selectSpecByBrand, {
            //         "factoryId": this.allBrand[this.selectBrandIndex].id
            //     }, false);
            //     console.log('getSpecsList data', data);
            //     if (data) {
            //         this.specsList = data.map(v => {
            //             return {
            //                 ...v,
            //                 isSelected: false
            //             };
            //         });
            //         if (this.specsList.length >= 1) {
            //             this.specsList[0].isSelected = true;
            //             console.log('specsList', this.specsList);
            //         }

            //         //let newarr = [...this.specsList];
            //         // that.$set(this, this.specsList, newarr);

            //     } else {
            //         this.specsList = [];
            //         //let newarr = [...this.specsList];
            //         // that.$set(this, this.specsList, newarr);
            //     }
            //     that.specsListLength = that.specsList.length;

            //     that.specsList.unshift({
            //         name:'不限',
            //         id:''
            //     })



            // },
            /**
             * PopUp 弹出层点击事件
             */
            chooseSpecsClicked() {
                if (this.specsList.length > 1) {
                    this.$refs.popup.open();
                    // if (this.specsList.length == 0) {
                    //     // 获取规格list
                    //     this.getSpecsList();
                    // }
                }



            },
            // 选择品牌
            clickActive(index) {
                this.selectBrandIndex = index;
                this.$emit('selectBrandOk', this.allBrand[index].id);
                // // 选择品牌查询对应型号
                // this.getSpecsList();
            }

        }
    }
</script>

<style lang="scss" scoped>
    .disable-button {
        color: rgba(0, 0, 0, .3) !important;
        background-color: #f7f7f7 !important;
        border: none !important;
    }

    .common-button {
        border-radius: 12rpx;
        border: 1rpx solid #FFC6C1;
        color: #FF4A26;
        display: inline-block;
        margin: 0 10rpx 10rpx 0;
        font-size: 23rpx;
        font-weight: bold;
        padding: 5rpx 10rpx;

    }

    .select-button {
        color: #FFFFFF;
        background-color: #EF3E3D;

    }

    .brand {
        margin-bottom: 5px;

    }

    .filter-content {
        background-color: #F6F7F8;
    }

    .filter-content-title {
        border-bottom: #EEEEEE 1px solid;
        padding: 10px 15px;
        font-size: 13px;
        color: #999999;
    }

    .filter-content-detail {
        padding: 5px 15px;
    }

    .filter-content-detail-item-active {
        background-color: #D1372C;
        color: #FFFFFF;
        padding: 5px 15px;
        border-radius: 20px;
        margin-right: 10px;
        margin-top: 10px;
        display: inline-block;
        font-size: 14px;
    }

    .filter-content-detail-item-default {
        background-color: #FFFFFF;
        color: #666666;
        border: 1rpx solid #FFC6C1;
        padding: 5px 15px;
        border-radius: 20px;
        margin-right: 10px;
        margin-top: 10px;
        display: inline-block;
        font-size: 14px;
    }

    .filter-content-footer {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 45px;
        margin-top: 10px;
    }

    .filter-content-footer-item {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
    }

    .filter-content-list {

        padding: 5px 15px;
    }

    .filter-content-list-item-default {
        color: #666666;
        width: 100%;
        padding: 10px 0px;
    }

    .filter-content-list-item-default text {
        width: 90%;
        font-size: 14px;
        display: inline-block;
    }

    .filter-content-list-item-active {
        color: #D1372C;
        width: 100%;
        padding: 10px 0px;
    }

    .filter-content-list-item-active text {
        font-size: 14px;
        width: 90%;
        display: inline-block;
    }

    .filter-content-list-item-active:after {
        content: '✓';
    }
</style>
