/**
 * API接口配置文件
 */
module.exports = {
    /**
     * 通用接口
     * **/
    common: {
        //decode接口,获取用户信息
        decode: 'sino-auth/oauth/decode',
        //decodekey接口,获取用户手机号
        decodeKey: 'sino-auth/oauth/decode/key',
        //认证资料申请提交
        applySubmit: 'sino-dst/mp/customer-apply/submit',
        //认证资料详情
        applyDetail: 'sino-dst/mp/customer-apply/detail',
        //邀请码
        inviteCode: 'sino-dst/mp/customer/invite-code',
        //地区选择
        regionSelect: 'sino-dst/region/select',
        //上传图片
        putFile: 'sino-resource/oss/endpoint/put-file',
        //数据字典
        dictionary: 'sino-dst/dict/dictionary',
        // 热卖产品
        proUnLogin: 'sino-dst/mp/launch/product/list',
        // 微信支付
        wxPay: 'sino-dst/wxpay/miniapp-pay',
        // 发红包
        sendRedBag: 'sino-dst/wxpay/send-red-envelopes',
        // 发红包
        sendRedBagNotice: 'sino-dst/customer-red-envelopes/receive-notify',
        //获取诺行用户数据
        getByCertificate: 'sino-dst/base-mall/get-by-certificate-num'
    },
    /**
     * 首页模块相关接口
     * **/
    home: {
        // 店铺详情接口
        storeDetail: "sino-dst/mp/index/store/detail",
        // 分类列表接口
        categoryList: "sino-dst/mp/index/product/category/list",
        // 商品列表
        productList: "sino-dst/mp/index/product/list",
        // 商品详情
        detail: "sino-dst/mp/product/detail",
        // 收藏
        collectionProduct: "sino-dst/mp/product/collect/add",
        // 删除收藏
        removeProduct: "sino-dst/mp/product/collect/remove",
        // 活动详情
        activityDetail: "sino-dst/activity/detail",
        // 所有品牌
        allBrand: "sino-dst/mp/factory/brand",
        // 根据品牌id查询规格
        selectSpecByBrand: "sino-dst/mp/index/product-model/list",
    },
    /**
     * 购物车模块相关接口
     * **/
    cart: {
        // 购物车数量 常买数量
        offenBuyNum: "sino-dst/mp/customer-cart-item/cart-count",
        // 购物车数量新增或修改
        cartNum: "sino-dst/mp/customer-cart-item/submit",
        // 购物车列表
        cartList: "sino-dst/mp/customer-cart-item/list",
        // 常买
        offenBuy: "sino-dst/mp/customer-order/often-buy",
        // 清空用户购物车所有物品
        deleteAll: "sino-dst/mp/customer-cart-item/delete-by-account",
        // 删除用户购物车物品
        deleteByIds: "sino-dst/mp/customer-cart-item/delete-by-ids",
        // 订单确认
        orderConfirm: "sino-dst/mp/customer-order/confirm",
        // 订单提交
        orderSubmit: "sino-dst/mp/customer-order/submit",
        // 支付
        payOrder: "sino-dst/mp/customer-order/pay/complete",
        // 获取支付信息
        payDetail: "sino-dst/mp/index/store/detail",
        // 获取支付方式
        paymentMethod: "sino-dst/mp/customer/detail"
    },
    /**
     * 个人中心模块相关接口
     * **/
    person: {
        //收货地址列表
        addrList: 'sino-dst/mp/customer-address/list',
        //收货地址详情
        addrDetail: 'sino-dst/mp/customer-address/detail',
        //新增收货地址
        addAddr: 'sino-dst/mp/customer-address/save',
        //修改收货地址
        updateAddr: 'sino-dst/mp/customer-address/update',
        //删除收货地址
        removeAddr: 'sino-dst/mp/customer-address/remove',
        //订单列表
        orderList: 'sino-dst/mp/customer-order/page',
        //订单详情
        orderDetail: 'sino-dst/mp/customer-order/detail',
        //物流详情
        logisticeDetail: 'sino-dst//mp/customer-order/delivery-detail',
        //客户订单数量
        orderAccount: 'sino-dst/mp/customer-order/count',
        //订单取消
        cancelOrder: 'sino-dst/mp/customer-order/cancel',
        //订单确认
        confirmOrder: 'sino-dst/mp/customer-order/confirm',
        //确认收货
        confirmRecive: 'sino-dst/mp/customer-order/confirm-received',
        //开票列表
        billList: 'sino-dst/mp/customer-order/bill/list',
        // 申请开票接口
        addBill: 'sino-dst/mp/customer-order/bill/submit',
        // 授信管理
        creditDetail: 'sino-dst/mp/customer/credit/detail',
        // 收藏列表
        collectList: 'sino-dst/mp/product/collect/list',
        // 赠品列表
        giftList: 'sino-dst/mp/customer-order/factory-gift/list',
        // 赠品兑换
        giftExchange: 'sino-dst/mp/customer-order/factory-gift/exchange',
        // 再次购买
        againBuyOrder: "sino-dst/mp/customer-cart-item/submit-by-order",
        // 上传凭证
        uploadPaymentVoucher: "sino-dst/mp/customer-order/upload-payment-voucher",
        // 最新订单物流信息
        deliveryNnew: "sino-dst/mp/customer-order/delivery-new"
    }
}
