
let result = `/*
* 面试官你好，我是洪凯
* 首先我想简单的介绍我自己
* 只是以文字介绍太单调了
* 我就用代码来展示吧
* 首先准备一些样式
*/
*{
    transition:all 1s;
}
html{
    background:rgb(222,222,222);
}
#pre{
    padding:10px;
    border:1px solid red;
}
/*现在我需要使一些代码高亮*/
.token.selector{
    color: #690;
}
.token.property{
    color: #905;
}
.token.function{
    color: #dd4a68;
}
/*现在需要一点3D效果*/
#pre{
    transform:rotateX(360deg);
}
/*下面开始进入正题，介绍一下自己吧 */
/* 首先，我需要一张白纸 */
`
writeCode(result)

/*................................ */
function writeCode(code,fn) {
    let preCode = document.querySelector('#pre')
    let n = 0
    let id = setInterval(() => {  //preCode.innerHTML通过把code在高亮库加工再赋值
        preCode.innerHTML = Prism.highlight(code.substring(0, n), Prism.languages.css)
        preStyle.innerHTML = code.substring(0, n)
        n += 1                               
        if (n >= code.length) {
            window.clearInterval(id)
            fn2.call()
        }
    }, 10)
}


function fn2() {
    var paper = document.createElement('div')
    paper.id = 'paper'
    document.body.appendChild(paper)
}
function fn3(x) {
    var result = `#paper{
        width:600px;
        height:800px;
        background:grey;
    }
    `
    var n = 0
    var id = setInterval(() => {
        //直接加x：result是因为上面'逐步出现'这个动画已经执行过，可以让result直接出现了
        preStyle.innerHTML = x + result.substring(0, n)
        pre.innerHTML = x + result.substring(0, n)
        pre.innerHTML = Prism.highlight(pre.innerHTML, Prism.languages.css);
        n += 1
        if (n >= result.length) {
            window.clearInterval(id)
        }
    }, 10)
}