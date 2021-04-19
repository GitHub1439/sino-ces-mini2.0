<template>
    <button
        class="sn-btn-class sn-btn"
        :class="['sn-btn-'+size,plain?'sn-'+type+'-outline':'sn-'+(type || 'gradual'),getDisabledClass(disabled,type),getShapeClass(shape,plain)]"
        :hover-class="getHoverClass(disabled,type,plain)"
        :loading="loading"
        :disabled="disabled"
        :open-type="openType"
        @tap="handleClick"
        @getuserinfo="bindgetuserinfo"
        @getphonenumber="getPhoneNumber"
        :form-type="formType"
        v-if="!hidden"
    >
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'SnButton',
    props: {
        // primary, white, danger, warning, green, gray,gradual
        type: {
            type: String,
            default: 'gradual'
        },
        // block, mini, small
        size: {
            type: String,
            default: 'block'
        },
        // circle, square，rightAngle
        shape: {
            type: String,
            default: 'square'
        },
        plain: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        openType: {
            type: String, /* getPhoneNumber, getUserInfo */
            default: ''
        },
        formType: {
            type: String,
            default: ''
        },
        hidden: {
            type: Boolean,
            default: false
        },
        bottom: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        handleClick() {
            if (this.disabled) {
                return false
            }
            this.$emit('clickF', {})
        },
        bindgetuserinfo({detail = {}} = {}) {
            this.$emit('getuserinfo', detail)
        },
        getPhoneNumber({detail = {}} = {}) {
            this.$emit('getphoneNumber', detail)
        },
        getDisabledClass(disabled, type) {
            let className = ''
            if (disabled && type !== 'white' && type !== 'gray') {
                className = type === 'gradual' ? 'btn-gradual-disabled' : 'sn-dark-disabled'
            }
            return className
        },
        getShapeClass(shape, plain) {
            let className = ''
            if (shape === 'circle') {
                className = plain ? 'sn-outline-fillet' : 'sn-fillet'
            } else if (shape === 'rightAngle') {
                className = plain ? 'sn-outline-rightAngle' : 'sn-rightAngle'
            }
            return className
        },
        getHoverClass(disabled, type, plain) {
            let className = ''
            if (!disabled) {
                className = plain ? 'sn-outline-hover' : ('sn-' + (type || 'gradual') + '-hover')
            }
            return className
        }
    }
}
</script>

<style>
    .sn-primary {
        background: #5677fc !important;
        color: #fff;
    }

    .sn-danger {
        background: #EB0909 !important;
        color: #fff;
    }

    .sn-red {
        background: #e41f19 !important;
        color: #fff;
    }

    .sn-warning {
        background: #ff7900 !important;
        color: #fff;
    }

    .sn-green {
        background: #19be6b !important;
        color: #fff;
    }

    .sn-white {
        background: #fff !important;
        color: #333 !important;
    }

    .sn-gray {
        background: #ededed !important;
        color: #999 !important;
    }

    .sn-hover-gray {
        background: #f7f7f9 !important;
    }

    /* button start*/
    .sn-btn {
        width: 100%;
        position: relative;
        border: 0 !important;
        border-radius: 10rpx;
        display: inline-block;
        font-size: 28upx;
    }

    .sn-btn::after {
        content: "";
        position: absolute;
        width: 200%;
        height: 200%;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scale(0.5, 0.5);
        transform: scale(0.5, 0.5);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        left: 0;
        top: 0;
        border-radius: 20rpx;
    }

    .sn-btn-block {
        font-size: 32rpx;
        height: 90rpx;
        line-height: 90rpx;
    }

    .sn-white::after {
        border: 1px solid #eaeef1;
    }

    .sn-white-hover {
        background: #e5e5e5 !important;
        color: #2e2e2e !important;
    }

    .sn-dark-disabled {
        opacity: 0.6 !important;
        color: #fafbfc !important;
    }

    .sn-outline-hover {
        opacity: 0.5;
    }

    .sn-primary-hover {
        background: #4a67d6 !important;
        color: #e5e5e5 !important;
    }

    .sn-primary-outline::after {
        border: 1px solid #5677fc !important;
    }

    .sn-primary-outline {
        color: #5677fc !important;
        background: none;
    }

    .sn-danger-hover {
        background: #c80808 !important;
        color: #e5e5e5 !important;
    }

    .sn-danger-outline {
        color: #EB0909 !important;
        background: none;
    }

    .sn-danger-outline::after {
        border: 1px solid #EB0909 !important;
    }

    .sn-red-hover {
        background: #c51a15 !important;
        color: #e5e5e5 !important;
    }

    .sn-red-outline {
        color: #e41f19 !important;
        background: none;
    }

    .sn-red-outline::after {
        border: 1px solid #e41f19 !important;
    }

    .sn-warning-hover {
        background: #e56d00 !important;
        color: #e5e5e5 !important;
    }

    .sn-warning-outline {
        color: #ff7900 !important;
        background: none;
    }

    .sn-warning-outline::after {
        border: 1px solid #ff7900 !important;
    }

    .sn-green-hover {
        background: #16ab60 !important;
        color: #e5e5e5 !important;
    }

    .sn-green-outline {
        color: #44cf85 !important;
        background: none;
    }

    .sn-green-outline::after {
        border: 1px solid #44cf85 !important;
    }

    .sn-gray-hover {
        background: #d5d5d5 !important;
        color: #898989;
    }

    .sn-gray-outline {
        color: #999 !important;
        background: none !important;
    }

    .sn-white-outline {
        color: #fff !important;
        background: none !important;
    }

    .sn-gray-outline::after {
        border: 1px solid #ccc !important;
    }

    .sn-white-outline::after {
        border: 1px solid #fff !important;
    }

    /*圆角 */
    .sn-fillet {
        border-radius: 45rpx;
    }

    .sn-white.sn-fillet::after {
        border-radius: 90rpx;
    }

    .sn-outline-fillet::after {
        border-radius: 90rpx;
    }

    /*平角*/
    .sn-rightAngle {
        border-radius: 0;
    }

    .sn-white.sn-rightAngle::after {
        border-radius: 0;
    }

    .sn-outline-rightAngle::after {
        border-radius: 0;
    }

    /*渐变 */
    .sn-gradual {
        background: linear-gradient(-90deg, #5677fc, #5c8dff);
        border-radius: 45rpx;
        color: #fff;
    }

    .sn-gradual-hover {
        color: #d5d4d9 !important;
        background: linear-gradient(-90deg, #4a67d6, #4e77d9);
    }

    .btn-gradual-disabled {
        color: #fafbfc !important;
        border-radius: 45rpx;
        background: linear-gradient(-90deg, #cad8fb, #c9d3fb);
    }

    /*不同尺寸 */
    .sn-btn-mini {
        width: auto;
        font-size: 30rpx;
        height: 70rpx;
        line-height: 70rpx;
    }

    .sn-btn-small {
        width: auto;
        font-size: 30rpx;
        height: 60rpx;
        line-height: 60rpx;
    }

    /* button end*/
</style>
