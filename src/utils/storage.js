class Storage {
    constructor(props) {
        this.context = props
        this.prefix = '__separator__'
        this.source = uni
    }
    /**
     * 获取缓存
     * @param String $key  key
     * @param String $def  若想要无缓存时，返回默认值则get('key','默认值')（支持字符串、json、数组、boolean等等）
     * @return value;
     */
    get(key, def = '') {
        const {source, prefix} = this
        const timeout = parseInt(source.getStorageSync(`${key}${prefix}`) || 0)

        // 过期失效
        if (timeout) {
            if (Date.now() > timeout) {
                this.remove(key)
                return
            }
        }
        let value = source.getStorageSync(key)
        return value ? value : def
    }

    /**
     * 设置缓存
     * @param String $key       key
     * @param String $value     value（支持字符串、json、数组、boolean等等）
     * @param Number $timeout   过期时间（单位：分钟）不设置时间即为永久保存
     * @return value;
     */
    set(key, value, timeout = 0) {
        const {source, prefix} = this
        let time = parseInt(timeout)
        source.setStorageSync(key, value)
        if (time) {
            source.setStorageSync(`${key}${prefix}`, Date.now() + 1000 * 60 * time)
        } else {
            source.removeStorageSync(`${key}${prefix}`)
        }
        return value
    }

    remove(key) {
        const {source, prefix} = this
        source.removeStorageSync(key)
        source.removeStorageSync(`${key}${prefix}`)
        return undefined
    }
}
const storages = new Storage()
export default storages
