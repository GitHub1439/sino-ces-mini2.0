module.exports = {
    parser: 'vue-eslint-parser',
    env: {
        browser: true,
        commonjs: true,
        es6: true
    },
    // extends: ["airbnb-base"],
    extends: ['eslint:recommended', 'plugin:vue/strongly-recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module',
        ecmaVersion: 2018
    },
    rules: {
        'no-use-before-define': 'off', // ["error", { functions: true, classes: true }], // disallow use of variables before they are defined
        'no-const-assign': 'error', // 不允许修改const的值
        'no-var': 'error', // 不允许出现var申明
        'no-new-object': 'error', // 不允许使用new Object的方式创建对象
        semi: ['error', 'never'], // 是否已分号结尾
        'no-undef': 'off', // 忽略全局的定义变量
        'object-shorthand': [
            'error',
            'always',
            {
                // 尽量使用对象属性简写
                ignoreConstructors: false,
                avoidQuotes: true
            }
        ],
        'quote-props': [
            'error',
            'as-needed',
            {
                // 尽量少的给属性名加引号
                keywords: false,
                unnecessary: true,
                numbers: false
            }
        ],
        // disallow use of the Array constructor
        'no-array-constructor': 'error',
        quotes: ['error', 'single'], // 强制使用单引号
        'max-len': ['error', {
            code: 200,
            ignoreUrls: true,
            ignoreComments: true,
            ignorePattern: ';base64,'
        }], // 一行的字符不能超过200
        // disallow use of eval()
        'no-eval': 'error',
        'no-console': 'off', // 禁止使用console（无控制台）
        'no-useless-escape': 'off', // 去掉不必要的转译
        'func-style': ['off', 'expression'], // 需要使用函数表达式
        'wrap-iife': ['error', 'outside'], // 立即执行函数需要用括号包裹
        // suggest using the spread operator instead of .apply()
        'prefer-spread': 'error', // 用spread操作符...去调用多变的函数更好
        // use rest parameters instead of arguments
        'prefer-rest-params': 'error',
        // suggest using arrow functions as callbacks
        'prefer-arrow-callback': [
            'error',
            {
                allowNamedFunctions: false,
                allowUnboundThis: true
            }
        ],
        // disallow arrow functions where they could be confused with comparisons
        'no-confusing-arrow': [
            'error',
            {
                allowParens: true
            }
        ],
        // Enforce the location of arrow function bodies with implicit returns
        'implicit-arrow-linebreak': ['error', 'beside'],
        // disallow use of Object.prototypes builtins directly
        'no-prototype-builtins': 'error',
        // disallow duplicate class members
        'no-dupe-class-members': 'error',
        // encourages use of dot notation whenever possible
        'dot-notation': ['error', {allowKeywords: true}],
        // disallow use of chained assignment expressions
        'no-multi-assign': ['off'],
        // disallow use of unary operators, ++ and --
        'no-plusplus': 'off',
        // disallow declaration of variables that are not used in the code
        'no-unused-vars': [
            'error',
            {vars: 'all', args: 'after-used', ignoreRestSiblings: true}
        ],
        // require the use of === and !==
        eqeqeq: ['error', 'always', {null: 'ignore'}],
        // enforce position of line comments
        'line-comment-position': [
            'off',
            {
                position: 'above',
                ignorePattern: '',
                applyDefaultPatterns: true
            }
        ],
        // require or disallow a space immediately following the // or /* in a comment
        'spaced-comment': [
            'error',
            'always',
            {
                line: {
                    exceptions: ['-', '+'],
                    markers: ['=', '!'] // space here to support sprockets directives
                },
                block: {
                    exceptions: ['-', '+'],
                    markers: ['=', '!'], // space here to support sprockets directives
                    balanced: true
                }
            }
        ],
        'no-irregular-whitespace': 'off',
        indent: ['error', 4],
        // require or disallow space before blocks
        'space-before-blocks': 'error',
        // disallow multiple empty lines and only one newline at the end
        'no-multiple-empty-lines': ['error', {max: 2, maxBOF: 1, maxEOF: 0}], // 不允许多个空行.该规则目的在于，当你读代码时，减少滚动。当超过最大空行数，该规则将发出警告。
        // enforce consistent line breaks inside function parentheses
        'function-paren-newline': ['error', 'consistent'],
        // require or disallow spaces inside parentheses
        'space-in-parens': ['error', 'never'],
        // require spaces around operators
        'space-infix-ops': 'error',
        'no-else-return': 'error',
        // enforce spacing before and after comma
        'comma-spacing': ['error', {before: false, after: true}], // 该规则强制在变量声明、数组字面量、对象字面量、函数参数 和 序列中的逗号左右的空格的一致性。
        'key-spacing': ['error', {afterColon: true}],
        'no-empty': ['error', {allowEmptyCatch: true}],
        'global-require': 'off', // 此规则要求所有调用 require() 必须在模块顶部，与 ES6 中 import 和 export 语句（只能放在顶部）相同。
        'comma-dangle': ['error', 'never'], // 结尾逗号
        'no-unused-expressions': 'off', // 不允许  this.toast.finally && this.toast.finally();形式
        'func-names': 'off', // 不允许使用 const getList = function() {...}，是个警告， 是否允许命名表达式
        'no-restricted-syntax': 'off', // 禁止使用for in
        'arrow-parens': 'off', // 箭头函数用小括号括起来
        'guard-for-in': 'off', // for in循环要用if语句过滤
        'no-await-in-loop': 'warn', // 禁止在循环中 出现 await.然而，每次运算都执行 await，意味着该程序并没有充分利用 async/await 并行的好处。通常，代码应该重构为立即创建所有 promise，然后通过 Promise.all() 访问结果。否则，每个后续的操作将不会执行，直到前一个操作执行完毕。在许多情况下，一个循环的迭代实际上并不是相互独立的。例如，一次迭代的输出可能是另一次迭代的输入。或者，循环可以重试不成功的异步操作。在这种情况下，在循环中使用 await 是有意义的，并建议使用标准的 ESLint 禁用注释禁用规则。
        'consistent-return': 'off', // 该规则要求 return 语句要么总是要么从不指定值。
        'default-case': 'error', // 要求所有的 switch 语句中必须包含 default 分支，即使默认分支中没有任何代码,允许省略掉 default 分支，但是要写明注释以说明是故意为之。 // no default.该规则接受单个选项参数：设置 commentPattern 为一个正则表达式字符串，来改变默认的 /^no default$/i 注释匹配模式
        'no-continue': 'off', // 该规则禁止使用 continue 语句。
        'no-empty-function': 'error', // 该规则旨在消除空函数。如果一个函数包含了一条注释，它将不会被认为有问题。
        'no-tabs': 'error', // 该规则查找文件中任何位置的 tab：代码，注释或其他
        'no-mixed-spaces-and-tabs': 'error', // 该规则禁止使用 空格 和 tab 混合缩进。
        'one-var': ['error', 'never'], //
        'no-return-await': 'off', // 该规则旨在防止由于缺乏对 async function 语法的理解而造成的常见的性能风险。在 async function， return await 是没有用的 。因为 async function 的返回值总是包裹在 Promise.resolve，在 Promise resolve 或 reject 之前，return await 实际上不会做任何事情。这种模式几乎可以肯定是由于程序员不知道 async function 语法的返回值造成的。
        'no-shadow': ['error', {hoist: 'never'}], // 此规则旨在消除变量声明覆盖。
        'no-return-assign': 'off', // 此规则目的在于移除 return 语句中的赋值语句。因此，当在return中发现赋值，该规则将发出警告。
        'semi-style': 'off',
        'object-curly-newline': 'off', // 要求需要有一致的换行符
        'no-trailing-spaces': ['error', {skipBlankLines: true}], // 禁用行尾空白
        'object-curly-spacing': 'error', // 该规则强制在对象字面量、解构赋值 和 import/export 说明符的花括号中使用一致的空格。 { key: value }与{key: value}
        'keyword-spacing': 'error', // 该规则强制关键字和类似关键字的符号周围空格的一致性：as、async、await、break、case、catch、class、const、continue、debugger、default、delete、do、else、export、extends、finally、for、from、function、get、if、import、in、instanceof、let、new、of、return、set、static、super、switch、this、throw、try、typeof、var、void、while、with 和 yield。该规则不会与其它空格规则发生冲突：它并不应用于别的规则会报告问题的空格。
        'vars-on-top': 'off', // for (var i=0; i<10; i++) {}会报错

        'vue/html-indent': ['error', 4], // vue template 缩进
        'vue/max-attributes-per-line': ['error', {singleline: 6}], // vue template 多个属性换行问题
        'vue/html-self-closing': 'off', // 标签闭合
        'vue/html-quotes': 'off', // 标签中引号配置
        'vue/singleline-html-element-content-newline': 'off', // 在单行元素的内容之前和之后需要换行
        'vue/mustache-interpolation-spacing': ['error', 'never'],
        'vue/no-multi-spaces': ['error', {ignoreProperties: false}],
        'vue/attribute-hyphenation': 'error',
        'vue/name-property-casing': 'error',
        'vue/require-prop-types': 'error',
        'vue/multiline-html-element-content-newline': 'error',
        'vue/html-closing-bracket-spacing': 'error'
    }
}
