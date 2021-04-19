/* eslint-disable no-shadow */
const ci = require('miniprogram-ci')
const fs = require('fs')
const inquirer = require('inquirer')
const stripJsonComments = require('strip-json-comments') /* 去除json文件中的注释 */
const env = process.env.NODE_ENV === 'production' ? 'build' : 'dev'
const versionConfig = './version.config.json'
const {version} = JSON.parse(stripJsonComments(fs.readFileSync(versionConfig, 'utf-8')))
const manifest = JSON.parse(stripJsonComments(fs.readFileSync('./src/manifest.json', 'utf-8')))

const config = {
    appid: manifest['mp-weixin'].appid,
    type: 'miniProgram',
    projectPath: `dist/${env}/mp-weixin`,
    privateKeyPath: 'private.key',
    ignores: ['node_modules/**/*']
}
const project = new ci.Project(config)

function inquirerResult() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'version',
            message: `设置上传的版本号(当前版本${version}):`,
            validate: (name) => {
                if (!name) {
                    console.log('请设置上传的版本号')
                    return false
                }
                return true
            }
        },
        {
            type: 'input',
            name: 'robot',
            message: '设置开发者标识,请在(1~30)之间的数字选择:',
            when: () => {
                return process.env.NODE_ENV === 'production'
            },
            validate: (name) => {
                if (!name || !/^\d+?$/.test(name)) {
                    console.log('请设置正确的开发者标识')
                    return false
                }
                return true
            }
        },
        {
            type: 'input',
            name: 'desc',
            message: '项目备注:',
            validate: (name) => {
                if (!name) {
                    console.log('请输入项目备注')
                    return false
                }
                return true
            }
        }
    ])
}

async function upload({version = '1.0.0', robot = 1, desc = ''}) {
    const uploadResult = await ci.upload({
        project,
        version,
        desc,
        robot,
        setting: {
            codeProtect: true,
            minify: true,
            es6: true
        }
    })
    console.log('size: ' + uploadResult.subPackageInfo[0].size)
}

async function preview({version = '1.0.0', desc = ''}) {
    const previewResult = await ci.preview({
        project,
        version,
        desc,
        setting: {
            es6: true
        },
        // qrcodeFormat: 'image',
        // qrcodeOutputDest: './preivew.jpg',
        // searchQuery: 'a=1&b=2',  // 预览参数 [注意!]这里的`&`字符在命令行中应写成转义字符`\&`
        pagePath: 'pages/cart/cart' // 预览页面
    })
    console.log('size: ' + previewResult.subPackageInfo[0].size)
}

async function init() {
    const result = await inquirerResult()
    if (process.env.NODE_ENV === 'production') {
        upload(result)
        // 重写版本文件
        fs.writeFileSync(versionConfig, JSON.stringify(result), err => {
            if (err) {
                console.log(`自动写入${versionConfig}文件失败，请手动填写，并检查错误`)
            }
        })
    } else {
        preview(result)
    }
}
init()
