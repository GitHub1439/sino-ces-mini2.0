import api from '@/utils/api'
let {baseUrl} = require(`../config/index-${process.env.NODE_ENV}`)

const timeParse = (time, format) => {
    if (time === '' || time === undefined || time === null) { return '' }
    let t = new Date(time)
    t = t.getFullYear() > 0 ? t : new Date(Date.parse(time.replace(/-/g, '/'))) // Safari 出现日期转换的问题
    let tf = function(i) {
        return (i < 10 ? '0' : '') + i
    }
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (a) => {
        switch (a) {
            case 'yyyy':
                return tf(t.getFullYear())
            case 'MM':
                return tf(t.getMonth() + 1)
            case 'mm':
                return tf(t.getMinutes())
            case 'dd':
                return tf(t.getDate())
            case 'HH':
                return tf(t.getHours())
            case 'ss':
                return tf(t.getSeconds())
            default:
                break
        }
    })
}
function tabTime(day1, day2) {
    //   在苹果上，时间格式最好是 是 2020/02/02 它是斜杠开头的
    let day11 = day1.replace(/-/g, '/')
    let day22 = day2.replace(/-/g, '/')

    let day_day1 = new Date(day11)
    let day_day2 = new Date(day22)

    let disparity = day_day2.getTime() - day_day1.getTime()
    // 转为分钟数的时候，可能会出现精度丢失;你需要注意下
    let min = Math.round(disparity / 1000 / 60)
    return min
}

/**
 * 根据日期字符串获取星期几
 * @param dateString 日期字符串（如：2020-05-02）
 * @returns {String}
 */
function getWeek(dateString) {
    let dateArray = dateString.split('-')
    let date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2])
    return '星期' + '日一二三四五六'.charAt(date.getDay())
}
function changTime(value) {
    let days = value.split(' ')
    let yearmonthday = days[0].split('-')
    let year = yearmonthday[0]
    let month = yearmonthday[1]
    let day = yearmonthday[2]
    if (Number(month) < 10 && month.indexOf('0') === -1) {
        month = '0' + month
    }
    if (Number(day) < 10 && day.indexOf('0') === -1) {
        day = '0' + day
    }
    let sfm = days[1] ? days[1] : ''
    let newValue = year + '-' + month + '-' + day + ' ' + sfm
    return newValue
}
function getIMTime(time) {
    let value = ''
    let nowDate =  timeParse(new Date(), 'yyyy-MM-dd')
    let targetDate = time.split(' ')[0]
    let targetTime = time.split(' ')[1]
    let targetTimes = targetTime.split(':')
    let day = getDaysBetween(nowDate, targetDate)
    if (day === 0) {
        let shijian = ''
        let hour = Number(targetTimes[0])
        if (hour >= 0 && hour <= 5) {
            shijian = '凌晨'
        } else if (hour > 5 && hour < 12) {
            shijian = '上午'
        } else if (hour === 12) {
            shijian = '中午'
        } else if (hour > 12 && hour < 18) {
            shijian = '下午'
            hour = hour - 12
            targetTimes[0] = '0' + hour
        } else if (hour >= 18 && hour <= 24) {
            shijian = '晚上'
            hour = hour - 12
            targetTimes[0] = '0' + hour
        }
        value = shijian + ' ' + targetTimes[0] + ':' + targetTimes[1]
    } else if (1 < day < 7)  {
        value = getWeek(targetDate) + ' ' +  targetTimes[0] + ':' + targetTimes[1]
    } else {
        value = time
    }
    return value
}


function formatDate (date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

// 最近7天
function getWeekDay() {
    let nowDate = new Date().getTime()
    return new Date(nowDate - 1000 * 60 * 60 * 24 * 6)
}

// 最近xxx个月
function getMonth(monthNumber) {
    let number = monthNumber || 1
    let end = new Date()
    end.setMonth(end.getMonth() - number)
    return (end.getFullYear()) + '-' + ((end.getMonth() + 1) < 10 ? '0' : '') + (end.getMonth() + 1) + '-' + (end.getDate() < 10 ? '0' : '') + end.getDate()
}

// 判断时间段不能超过6个月
function timeDifference(date1, date2) {
    let newYear = date1.getFullYear()
    let newMonth = date1.getMonth() + 6 // 先计算其实日期6个月后的日期
    if (newMonth >= 11) {
        newYear += 1
        newMonth -= 11
        date1.setFullYear(newYear)
        date1.setMonth(newMonth - 1)
    } else {
        date1.setFullYear(newYear)
        date1.setMonth(newMonth)
    }
    if (date1.getTime() >= date2.getTime()) { // 不超过6个月
        return false
    }
    return true

}

function  getDaysBetween(dateString1, dateString2) {
    let  startDate = Date.parse(dateString1)
    let  endDate = Date.parse(dateString2)
    let days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
    // alert(days);
    return  days
}
function getCurrentPage() {
    let pages = getCurrentPages() // 获取加载的页面
    let currentPage = pages[pages.length - 1] // 获取当前页面的对象
    console.log(currentPage)
    return currentPage
}
function validateStrAndNo(str) {
    let reg = {letter: '^bai[A-Za-z]+$', num: '^([+-]?)\\d*\\.?\\d+$'}
    if ((new RegExp(reg.letter)).test(str) || (new RegExp(reg.num)).test(str)) {
        return true
    }
    return false

}

// 获取当天后n天
function getNextDate(date, day) {
    let dd = new Date(date)
    dd.setDate(dd.getDate() + day)
    let y = dd.getFullYear()
    let m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1
    let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()
    return y + '-' + m + '-' + d
}


function isphone(str) {
    if (str.trim().length !== 11) {
        return false
    }
    return /^1[3456789]\d{9}$/.test(str)
}

// 去除字符串的前后空格
function trimStr(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
}
function isUrl(url) {
    return /^(https?|http):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/.test(url)
}
// 脱敏处理
function idCardEncrypt(cardid) {
    if (cardid && cardid.length > 9) {
        return cardid.replace(/^(.{4})(?:\d+)(.{4})$/, '$1**********$2')
    }
    return cardid
}

function getQueryParam(url, name) {
    let urls = url.split('?')[1]
    if (!urls) return ''
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let r = urls.match(reg)
    if (r != null) return decodeURI(r[2]); return null
}
function throttle(fn, interval) {
    let _self = fn // 保存需要被延迟执行的函数引用
    let firstTime = true // 是否初次调用
    let timer// 定时器
    return function(arg) {
        let args = {...arg}
        let _me = this
        if (firstTime) {      // 如果是第一次调用不需要延迟执行
            _self.call(_me, args)
        }
        if (timer) {      // 如果定时器还在，说明前一次延迟执行还没有完成
            return false
        }
        timer = setTimeout(() => {      // 延迟一段时间执行
            clearTimeout(timer) // 清除定时器 避免下一次return false
            timer = null
            _self.call(_me, args)
        }, interval || 500)
    }
}

function debounce(fn) {
    let timer
    let _self = fn
    return function(arg) {
        clearTimeout(timer)
        let args = {...arg} // fn所需要的参数
        let _me = this // 当前的this
        timer = setTimeout(() => {
            _self.call(_me, args)
        }, 200)
    }
}
function showToast(str) {
    uni.showToast({
        title: str,
        icon: 'none',
        duration: 2000
    })
}
function getCanvasImage(canvasId) {
    return  new Promise((resolve => {
        uni.canvasToTempFilePath({
            canvasId,
            success(res) {
                resolve(res.tempFilePath)
                console.log(res.tempFilePath)
            }
        })
    }))
}
/**
 * 根据身份证获取出生日期
 * @param idCard
 */
const getBirth = (idCard) => {
    let birthday = ''
    if (idCard != null && idCard !== '') {
        if (idCard.length === 15) {
            birthday = '19' + idCard.slice(6, 12)
        } else if (idCard.length === 18) {
            birthday = idCard.slice(6, 14)
        }
        birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
        // 通过正则表达式来指定输出格式为:1990-01-01
    }
    return birthday
}

/**
 * 根据身份证获取行性别 1 男 2 女
 * @param idCard
 */
const getSex = (idCard) => {
    let sexStr = ''
    if (parseInt(idCard.slice(-2, -1)) % 2 === 1) {
        sexStr = 1
    } else {
        sexStr = 2
    }
    return sexStr
}
/**
 * 判断是否是iphonex
 *
 */

function isIphonex() {

    let isX = false;
    let isAndroid = false

    switch(uni.getSystemInfoSync().platform){
    case 'android':
        isAndroid = true
        break;
    case 'ios':
        isAndroid = false
        break;

    default:
        break;
    }

    wx.getSystemInfo({
        success: res => {
            //x及以上的异形屏top为44，非异形屏为20
            if (res.safeArea.top > 20) {
                isX = true;
            }
        },
        fail(err) {
            console.error(err);
        }
    })

    return isX && !isAndroid;
}



/**
 * 上传图像
 * */
function uploadPic(tempPaths){
    return new Promise((resolve,reject)=>{
        uni.showLoading()
        uni.uploadFile({
            url: baseUrl + api.common.putFile,
            filePath: tempPaths[0],
            name: 'file',
            success: (res) => {
                uni.hideLoading()
                if(res.statusCode === 200){
                    let data = JSON.parse(res.data)
                    resolve(data.data.link)
                }else {
                    reject('')
                    console.log('上传失败')
                }
            },
            fail: (err)=>{
                uni.hideLoading()
                reject('')
                console.log('上传失败：'+err)
            }
        })
    })
}
module.exports = {
    timeParse,
    formatDate,
    getMonth,
    getWeekDay,
    timeDifference,
    isphone,
    trimStr,
    isUrl,
    idCardEncrypt,
    getQueryParam,
    throttle,
    debounce,
    getCurrentPage,
    showToast,
    getDaysBetween,
    getNextDate,
    getCanvasImage,
    getBirth,
    getSex,
    validateStrAndNo,
    tabTime,
    changTime,
    isIphonex,
    getIMTime,
    uploadPic
}
